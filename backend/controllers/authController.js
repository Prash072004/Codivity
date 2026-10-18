const User = require("../models/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Sign Up
async function signup(req, res) {
    try {
        const { username, email, password } = req.body;

        if(!username || !email || !password) {
            return res.status(400).json({ message: "Please fill all required fields" });
        }

        const existingUser = await User.findOne({ $or: [ {username}, {email} ] });

        if(existingUser) {
            return res.status(409).json({ message: "Username or email already exists" });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            username,
            email,
            password: passwordHash
        });

        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({message: "Server error"});
    }
}

const JWT_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7d, matches JWT expiresIn

// Cross-site (codivity.app -> onrender.com) requires SameSite=None; Secure in production
function getBaseCookieOptions() {
    const isProduction = process.env.NODE_ENV === "production";

    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax"
    };
}

function getCookieOptions() {
    return {
        ...getBaseCookieOptions(),
        maxAge: JWT_MAX_AGE_MS
    };
}

// Sign In
async function signin(req, res) {
    try {
        const { username, email, password } = req.body;

        if((!username && !email) || !password) {
            return res.status(400).json({ message: "Please provide username/email and password" });
        }

        const user = await User.findOne({ $or: [ { username: username }, { email: email } ] });

        if(!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, getCookieOptions());

        return res.status(200).json({
            message: "Sign in successful"
        });
    } catch (error) {
        console.error("Signin error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

// Log Out
function logout(req, res) {
    res.clearCookie("token", getBaseCookieOptions());

    return res.status(200).json({ message: "Logged out successfully" });
}

module.exports = {
    signup,
    signin,
    logout
};