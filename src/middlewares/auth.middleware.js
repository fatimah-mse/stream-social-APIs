const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization;

        if(!authorization) {
            return res.status(403).json({ message: "Authorization must be required" })
        }

        const token = authorization.split(" ")[1]; 

        const data = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = await User.findById(data?.id)

        if(!user) {
            return res.status(401).json({ message: "Invalid user id" })
        }

        req.user = { id: data.id };
        
        next();
    } 
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token expired',
                expiredAt: err.expiredAt
            });
        }
        return res.status(500).json({ message: error.message })
    }
}

module.exports = {auth}