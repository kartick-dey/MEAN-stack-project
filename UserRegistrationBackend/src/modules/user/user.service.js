const UserModel = require('./user.model');
const jwt = require('jsonwebtoken');
const mailgun = require("mailgun-js");
const bcrypt = require('bcrypt');
const userModel = require('./user.model');
const DOMAIN = process.env.MAILGUN_DOMAIN;
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN });


/**
 * Helps to save user data into DB
 * @param user 
 * @returns user
 */
const createUserInDB = async (user) => {

    try {
        let userInDB = await UserModel.findOne({ email: user.email });
        if (!userInDB) {
            // creating emailVerificationToken using jsonWebToken lib
            const emailVerifyToken = jwt.sign(user, process.env.JWT_ACC_ACTIVATE_KEY, { expiresIn: '1d' });

            const data = {
                from: 'noreply@kd.com',
                to: user.email,
                subject: 'Verify your email to activate account',
                html: `
                <h2>Please click on given link or button to activate your account</h2>
                <p>${process.env.CLIENT_URL}/confirmemail?token=${emailVerifyToken}</p>
                <a href='${process.env.CLIENT_URL}/confirmemail?token=${emailVerifyToken}'>Click Here to Verify</a>
                `
            };
            mg.messages().send(data, function (error, body) {
                console.log(body);
            });

            //hashing the pwd before saved to db
            const salt = await bcrypt.genSalt(10);
            const hashedPwd = await bcrypt.hash(user.password, salt);
            user.password = hashedPwd;
            const userInfo = await UserModel.create(user);
            return userInfo;
        }
        await userInDB.save();
        return userInDB;
    } catch (error) {
        throw error;
    }
};

/**
 * Helps to activate user account and update the record ino DB
 * @param token 
 * @returns user
 */

const activateAccountInDB = async (token, callback) => {
    jwt.verify(token, process.env.JWT_ACC_ACTIVATE_KEY, async (error, decodedToken) => {

        if (!decodedToken) {
            return callback('Invaild link');
        }

        try {
            let userInDB = await UserModel.findOne({ email: decodedToken.email });

            if (!userInDB) {
                // throw new Error('Invaild link');
                return callback('Invaild link');
            }
            userInDB.isVerified = true;

            await userInDB.save();
            return callback(null, userInDB);
        } catch (error) {
            return callback(error);
        }
    })
};

/**
 * Helps to check user exist in DB or not for login purpose
 * @param (bodyParam, callback)
 * @returns jwtToken
 */

const loginFromDB = async (bodyParam, callback) => {
    const user = await UserModel.findOne({ email: bodyParam.email });
    if (!user) {
        return callback('Invalid Email!');
    }

    if (!user.isVerified) {
        return callback('Please verify your email. then try to login');
    }

    // Comparing the pwd
    const validPwd = bcrypt.compareSync(bodyParam.password, user.password);
    console.log('validPwd: ', validPwd);
    if (!validPwd) {
        return callback('Invalid Password!');
    }

    const jwtToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: 3600 });

    return callback(null, jwtToken);
}



/**
 * Helps to save user data into DB
 * @param userId 
 * @returns user
 */
const getUserByIdFromDB = async (userId, callback) => {
    try {
        const user = await UserModel.findById(userId);
        return callback(null, user);
    } catch (error) {
        return callback('USER_NOT_FOUND');
    }
};


/**
 * Helps to save user data into DB
 * @param callback 
 * @returns users
 */

const getAllUsersFromDB = async (callback) => {
    try {
        const users = await userModel.find();
        return callback(null, users);
    } catch (error) {
        return callback("Somenthing went wrong!");
    }

}

/**
 * Helps to save user data into DB
 * @param callback 
 * @returns users
 */

const getEmailFromDB = async (email, callback) => {
    try {
        const user = await userModel.findOne({ email: email });
        return callback(null, user);
    } catch (error) {
        return callback("Somenthing went wrong!");
    }

}

module.exports = {
    createUserInDB,
    activateAccountInDB,
    loginFromDB,
    getAllUsersFromDB,
    getUserByIdFromDB,
    getEmailFromDB
};

