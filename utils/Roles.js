/**
 * Class to validate role type
 */
class Roles {
    /**
     * Method to validate if a user is an Administrator
     * @param role
     * @returns {boolean}
     */
    static isAdministrator(role) {
        if (role === 'administrator') {
            return true;
        } else {
            return false;
        }
    }
}

module.exports = Roles;
