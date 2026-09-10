const User = require("../models/User.js");

async function getProfile (req, res) {
    try {
        // fetch the logged-in user's data while excluding the password
        const user = await User.findById(req.user.userId).select("-password");

        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (err) {
        console.error("Profile error:", error);

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

module.exports = {
    getProfile
};