const jwt = require('jsonwebtoken')

function restrict () {
    return async (req, res, next) => {
        const authErr = {
            message: "Error in authentication."
        }
        try{
            const token = req.cookies.token
            if (!token) {
                return res.status(401).json(authErr)
            }
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(401).json(authErr)
                }
                req.token = decoded
                next()
            })
        }
        catch (err) {
            next(err)
        }
    }
}
module.exports = restrict;