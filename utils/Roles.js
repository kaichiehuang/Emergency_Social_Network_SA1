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
    //
    // /**
    //  * Method to validate if a user is an citizen
    //  * @param role
    //  * @returns {boolean}
    //  */
    // static isCitizen(role) {
    //     if (role=== 'citizen') {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }
    //
    // /**
    //  * Method to validate if a user is an coordinator
    //  * @param role
    //  * @returns {boolean}
    //  */
    // static isCoordinator(role) {
    //     if (role === 'coordinator') {
    //         return true;
    //     } else {
    //         return false;
    //     }
    // }
}

module.exports = Roles;
