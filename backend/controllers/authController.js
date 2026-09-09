const User = require("../models/User.js");
const bcrypt = require("bcrypt");

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

module.exports = {
    signup
};