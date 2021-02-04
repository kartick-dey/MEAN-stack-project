const jwt = require('jsonwebtoken');
const { getUserByIdFromDB } = require('../modules/user/user.service');

const verifyToken = (req, res, next) => {
    const bearerToken = req.header('Authorization');
    console.log("bearerToken: ", bearerToken);
    if (typeof bearerToken !== 'undefined') {
        // Split at the space to divide Bearer keyword and <token>
        const token = bearerToken.split(' ')[1];
        // Verified JWT token
        jwt.verify(token, process.env.JWT_SECRET_KEY, (error, data) => {
            if (error) {
                res.status(400).json({
                    message: 'Invalid Token',
                });
            }

            // fetching user by ID
            getUserByIdFromDB(data._id, (error, result) => {
                if (error) {
                    res.status(400).json({
                        message: 'Invalid Token',
                    });
                }
                // Adding req with user data.
                req.user = result;
                next()
            });
        });
    } else {
        res.status(400).json({
            message: 'Invalid Token',
        });
    }
};

module.exports = verifyToken;