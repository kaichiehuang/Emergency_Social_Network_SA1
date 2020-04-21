const RBAC = require('easy-rbac');
const rules = require('./rbacRules.js')
const User = require('../model/user.js');
const rbac = new RBAC(rules);

class RoleBasedAccessControl {

    //chech by userId if the user is active or not
    static checkActive(userId, res) {
        return User.findUserById(userId).then((user) => {
            //true or false
            console.log(user.active);
            return user.active;
        }).catch((err) => {
            return res.status(500).send(err);
        });
    }

    //get the role of the user
    static getRole(userId, res) {
        return User.findUserById(userId).then((user) => {
            console.log(user.role);
            return user.role;
        }).catch((err) => {
            return res.status(500).send(err);
        });
    }

    //first check if the user is active, than see if the role of the user is permitted to do an action
    static async validateUser (req, res, next) {
        console.log("in validate user")
        let userId = req.tokenUserId;
        let route = req.baseUrl;
        let method = Object.keys(req.route.methods)[0];
        let role = await RoleBasedAccessControl.getRole(userId, res);
        let action = route + ':' + method;
        let active = await RoleBasedAccessControl.checkActive(userId, res);

        if (action === "put") {
            if (req.params.userId != userId && role != 'administrator') {
                return res.status(401).send("Invalid attempt to modify other user's profile").end();
            } 
        }
        
        if (active === true) {
            rbac.can(role, action) 
            .then(result => {
                if (result) {
                  // we are allowed access
                  console.log(userId + " is allowed to " + action);
                  return res.status(200).send(userId + " is allowed to " + action).end();// UNAUTHORIZED
                  //next();
                } else {
                  // we are not allowed access
                  return res.status(401).send("rbac not passed").end();// UNAUTHORIZED
                }
              })
              .catch(err => {
                // something else went wrong - refer to err object
                return res.status(401).send(err.message).end();
              });
        } else {
            return res.status(401).send("user not active").end();// UNAUTHORIZED
        }
    }
}

module.exports = RoleBasedAccessControl;