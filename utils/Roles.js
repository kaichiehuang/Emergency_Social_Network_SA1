class Roles {
    static isAdministrator(role) {
        if (role === 'Administrator') {
            return true;
        } else {
            return false;
        }
    }

    static isCitizen(role) {
        if (role=== 'Citizen') {
            return true;
        } else {
            return false;
        }
    }

    static isCoordinator(role) {
        if (role === 'Coordinator') {
            return true;
        } else {
            return false;
        }
    }
}

module.exports = Roles;
