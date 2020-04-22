const bcrypt = require('bcrypt');
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
}

module.exports = UserHelper;
