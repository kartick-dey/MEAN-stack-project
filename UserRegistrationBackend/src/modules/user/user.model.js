const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

/**
 * User Schema
 */

const Schema = mongoose.Schema;
const userSchema = new Schema({
    name: {
        type: String,
        required: true        
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    }
}, { timestamps: true });


userSchema.index({ email: true });

/**
 * This a middleware will help to hasded the pwd before saving data into DB
 */
// userSchema.pre('save', async function (next) {
//     try {
//         const salt = await bcrypt.genSalt(10);
//         const hashedPwd = await bcrypt.hash(this.password, salt);
//         this.password = hashedPwd;
//         next();
//         // console.log('Called before saving data and pwd is: ');
//     } catch (error) {
//         next(error)
//     }
// });

/**
 * User model exporting
 */
module.exports = mongoose.model('users', userSchema);
module.exports = mongoose.model('users');