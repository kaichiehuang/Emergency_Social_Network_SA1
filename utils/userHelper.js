const bcrypt = require('bcrypt');
const TokenServerClass = require('../middleware/TokenServer');
const UserPersonalValidator = require('../model/validators/userPersonalValidator.js');
const UserMedicalValidator = require('../model/validators/userMedicalValidator.js');
const UserOtherValidator = require('../model/validators/userOtherValidator.js');
const UserDefaultValidator = require('../model/validators/userDefaultValidator.js');
/**
 * user helper class
 */
class UserHelper {
    /**
     * hashes a user password //
     * @param  {[type]} password [description]
     * @return {[type]}          [description]
     */
    static hashPassword(password) {
        return bcrypt.hashSync(password, 10);
    }
    /**
     * [isPasswordMatch description]
     * @param  {[type]}  password [description]
     * @return {Boolean}          [description]
     */
    static isPasswordMatch(inputPassword, currentPassword) {
        return new Promise((resolve, reject) => {
            if (bcrypt.compareSync(inputPassword, currentPassword)) {
                return resolve(true);
            } else {
                return reject('Invalid username / password.');
            }
        });
    }
    /**
     * Generates a token for a user
     * @return {[type]} [description]
     */
    static generateTokens(userId) {
        return new Promise((resolve, reject) => {
            let token = '';
            TokenServerClass.generateToken(userId, false).then((generatedToken) => {
                token = generatedToken;
                TokenServerClass.generateToken(userId, true).then((genRefToken) => {
                    const tokens = {
                        token: token,
                        ex_token: genRefToken
                    };
                    return resolve(tokens);
                }).catch((err) => {
                    /* istanbul ignore next */
                    return reject(err);
                });
            }).catch((err) => {
                return reject(err);
            });
        });
    }

    /**
     * Validates structure of registered data, it doesn't validate is username and password match, this is done in isPasswordMatch
     * @return {[type]} [description]
     */
    static validateUpdate(data) {
        return new Promise((resolve, reject) => {
            let dataValidator;
            if (data.step != undefined && data.step == 0) {
                dataValidator = new UserAccountValidator();
            } else if (data.step != undefined && data.step == 1) {
                dataValidator = new UserPersonalValidator();
            } else if (data.step != undefined && data.step == 2) {
                dataValidator = new UserMedicalValidator();
            } else if (data.step != undefined && data.step == 3) {
                dataValidator = new UserOtherValidator();
            } else {
                // default validator
                dataValidator = new UserDefaultValidator();
            }
            dataValidator.validateDataRules(data)
                .then((result) => {
                    return resolve(true);
                }).catch((err) => {
                    return reject(err);
                });
        });
    }
}

module.exports = UserHelper;
