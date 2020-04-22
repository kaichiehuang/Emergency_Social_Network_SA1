const bcrypt = require('bcrypt');
const TokenServerClass = require('../middleware/TokenServer');
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
}

module.exports = UserHelper;
