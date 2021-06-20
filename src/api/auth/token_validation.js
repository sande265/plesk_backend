const jwt = require('jsonwebtoken');

module.exports = {
    verifyToken: (req, res, next) => {
        let token = req.headers.authorization || req.headers.auth;
        if (token) {
            token = token.split(" ")[1]
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) res.status(400).json({ message: `Invalid Token, ${err.message}` })
                else next();
            })
        } else {
            res.status(401).json({
                message: 'Access Denied! Unauthorized User.'
            })
        }
    }
}