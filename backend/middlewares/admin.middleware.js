const jwt = require('jsonwebtoken')
const config = require('../config')

const adminMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(400).json({
            message: "No token provided"
        })
    }
    const token = authHeader.split(" ")[1];
    try{
        const decoded = jwt.verify(token, config.JWT_SECRET_ADMIN)
        req.admin = decoded;
        next()
    } catch(error) {
        res.status(500).json({
            errors: "Invalid token or expired"
        })
    }
}

module.exports = {
    adminMiddleware
}