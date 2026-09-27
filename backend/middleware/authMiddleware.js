const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    try {
        let token = req.cookies?.token;

        // Fallback for existing Authorization: Bearer clients
        if (!token) {
            const authHeader = req.headers.authorization;

            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            }
        }

        if (!token) {
            return res.status(401).json({
                message: "Authentication required"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}

module.exports = authMiddleware;