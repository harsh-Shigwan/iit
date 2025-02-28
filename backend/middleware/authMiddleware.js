const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"; // Use the same secret

const authenticateToken = (req, res, next) => {
    const authHeader = req.header("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1]; // Extract token after "Bearer "
    
    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified; // Attach user data to request
        next();
    } catch (error) {
        return res.status(403).json({ error: "Invalid token" });
    }
};

module.exports = authenticateToken;
