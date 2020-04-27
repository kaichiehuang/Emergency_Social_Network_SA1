const RBAC = require('easy-rbac');
const rules = require('./rbacRules.js');
const User = require('../model/user.js');
const rbac = new RBAC(rules);

/**
 * role base access control
 */
class RoleBasedAccessControl {
    /**
     * check by userId if the user is active or not
     * @param userId
     * @param res
     * @returns {Q.Promise<unknown>}
     */
    static checkActive(userId, res) {
        return User.findUserById(userId).then((user) => {
            // true or false
            return user.active;
        }).catch((err) => {
            /* istanbul ignore next */
            return res.status(500).send(err);
        });
    }

    /**
     * get the role of the user
     * @param userId
     * @param res
     * @returns {Q.Promise<unknown>}
     */
    static getRole(userId, res) {
        return User.findUserById(userId).then((user) => {
            return user.role;
        }).catch((err) => {
            /* istanbul ignore next */
            return res.status(500).send(err);
        });
    }

    /** first check if the user is active, than see if the role of the user is permitted to do an action
     *
     * @param req
     * @param res
     * @param next
     * @returns {Promise<*>}
     */
    static async doValidation(req, res, next) {
        res.contentType('application/json');
        const userId = req.tokenUserId;
        const route = req.baseUrl;
        const method = Object.keys(req.route.methods)[0];
        const role = await RoleBasedAccessControl.getRole(userId, res);
        const action = route + ':' + method;
        const active = await RoleBasedAccessControl.checkActive(userId, res);

        if (method === 'put' && req.params.pictureId == null && route === '/api/users') {
            /* istanbul ignore next */
            if (req.params.userId != userId && role != 'administrator') {
                return res.status(401).send({msg: 'Invalid attempt to modify other user\'s profile'}).end();
            }
        }

        if (active === true) {
            rbac.can(role, action)
                .then((result) => {
                    if (result) {
                        // we are allowed access
                        next();
                    } else {
                        // we are not allowed access
                        /* istanbul ignore next */
                        return res.status(401).send({msg: 'You are not allowed to do this action'}).end();// UNAUTHORIZED
                    }
                })
                .catch((err) => {
                // something else went wrong - refer to err object
                    /* istanbul ignore next */
                    return res.status(401).send(err.message).end();
                });
        } else {
            /* istanbul ignore next */
            return res.status(401).send({msg: 'Inactive User'}).end();// UNAUTHORIZED
        }
    }

    /**
     * validate user
     * @param req
     * @param res
     * @param next
     * @returns {Promise<void>}
     */
    static async validateUser(req, res, next) {
        await RoleBasedAccessControl.doValidation(req, res, next);
    }
}

module.exports = RoleBasedAccessControl;
