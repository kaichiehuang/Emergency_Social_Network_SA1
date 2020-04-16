const User = require('../model/user.js');
const EmergencyStatusDetail = require('../model/emergencyStatusDetail.js')
// const  = model.User;
class UsersController {
    /**
     * [createUser description]
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    createUser(req, res) {
        const signUpData = req.body;
        // 1. If no username or password in json set them with emtpy values
        if (signUpData['username'] == undefined) {
            signUpData['username'] = '';
        }
        if (signUpData['password'] == undefined) {
            signUpData['password'] = '';
        }

        // 2. Validate if user exists
        User.findUserByUsername(signUpData['username'])
        .then((user) => {
            let userInstance = user;
            // 4. if user doesn't exist validate data and create it
            if (user == null) {
                userInstance = new User();
                userInstance.setRegistrationData(signUpData['username'], signUpData['password']);

                // 3. Run validations on user object
                let userData = null;
                userInstance.validateCreate()
                .then(function(result) {
                    return userInstance.registerUser();
                }).then(function(response) {
                    return userInstance.generateTokens();
                }).then((tokens) => {
                    let jsonResponseData = {};
                    jsonResponseData['user'] = userInstance;
                    jsonResponseData['user']['userId'] = userInstance._id;
                    jsonResponseData['tokens'] = tokens;
                    res.contentType('application/json');
                    return res.status(201).send(JSON.stringify(jsonResponseData));
                }).then((res) => {
                    const emergency_status_detail_instance = new EmergencyStatusDetail(userInstance._id);
                    return emergency_status_detail_instance.createEmergencyStatusDetail();
                }).catch((err) => {
                    res.contentType('application/json');
                    console.log(err);
                    return res.status(422).send({
                        msg: err
                    }).end();
                });
            } else {
                // 3. Run validations on user object
                userInstance.isPasswordMatch(signUpData['password'])
                .then(function(response) {
                    return userInstance.generateTokens();
                }).then((tokens) => {
                    const jsonResponseData = {};
                    jsonResponseData['user'] = userInstance;
                    jsonResponseData['user']['userId'] = userInstance._id.toString();
                    jsonResponseData['tokens'] = tokens;
                    res.contentType('application/json');
                    return res.status(201).send(JSON.stringify(jsonResponseData));
                }).catch((err) => {
                    res.contentType('application/json');
                    console.log(err);
                    return res.status(422).send({
                        msg: err
                    }).end();
                });
            }
        }).catch((err) => {
            res.contentType('application/json');
            return res.status(422).send({
                msg: 'no existe'
            }).end();
        });
    }
    /**
     * [updateUser description]
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    updateUser(req, res) {
        let userInstance = null;
        const userId = req.params.userId;
        console.log(req.body);
        // 1. update user data
        User.findById(userId).then(user => {
            userInstance = user;
            return userInstance.updateUser(req.body);
        })
        .then( _ => {
            let jsonResponseData = {};
            jsonResponseData = userInstance;
            jsonResponseData['userId'] = userInstance._id;
            res.contentType('application/json');
            return res.status(201).send(JSON.stringify(jsonResponseData));
        }).catch((err) => {
            res.contentType('application/json');
            return res.status(422).send({
                msg: err
            }).end();
        });
    }

    /**
     * Get the users of the DataBase (only user_name and online fields)
     * @param req
     * @param res
     */
    getUser(req, res) {

        var tokenUser = null;
        //check if user is authorized to get other users data
        const userId = req.params.userId;
        //1. find user only if it is the same user or an authorized user
        User.findUserByIdIfAuthorized(userId, req.tokenUserId)
        .then((user) => {
            res.contentType('application/json');
            user.personal_message.message = '';
            return res.status(201).send(JSON.stringify(user));
        }).catch((err) => {
            if(err.toString().localeCompare("You are not authorized") == 0){
                return res.status(403).send(err);
            }
            return res.status(500).send(err);
        });
    }

    /**
     * Get the users of the DataBase (only user_name and online fields)
     * @param req
     * @param res
     */
    getPersonalMessageUser(req, res) {
        if(req.query.security_question_answer == undefined){
            return res.status(403).send("Invalid answer");
        }
        const userId = req.params.userId;
        const security_question_answer = req.query.security_question_answer;

        //1. find user by id and check if user is authorized to get other users data
        User.findUserByIdIfAuthorized(userId, req.tokenUserId).then(userInstance => {
            return userInstance.getPersonalMessage(security_question_answer)
        })
        .then((message) => {
            res.contentType('application/json');
            return res.status(201).send({"message": message});
        }).catch((err) => {
            return res.status(403).send(err);
        });
    }
    /**
     * [createSocket description]
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    createSocket(req, res) {
        const socketId = req.body.socketId;
        const userId = req.params.userId;
        // 1. Validate if user exists
        User.findUserById(userId).then((user) => {
            return User.insertSocket(userId, socketId);
        }).then((user) => {
            res.contentType('application/json');
            return res.status(201).send(JSON.stringify(user));
        }).catch((err) => {
            return res.status(500).send(err);
        });
    }
    /**
     * Delete user sockets
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    deleteSocket(req, res) {
        const socketId = req.params.socketId;
        const userId = req.params.userId;
        // 1. Validate if user exists
        User.findUserById(userId).then((user) => {
            return User.removeSocket(userId, socketId);
        }).then((user) => {
            res.contentType('application/json');
            return res.status(201).send(JSON.stringify(user));
        }).catch((err) => {
            console.log('catch when socket id doesn\'t exist');
            return res.status(500).send(err);
        });
    }

    /**
     * Search users by username or status
     * @param req
     * @param res
     * @return {*}
     */
    getUsers(req, res) {
        console.log('searchUserInformation');
        const username = req.query.username;
        const status = req.query.status;
        res.contentType('application/json');
        // type of search (username or status)
        if ((username !== undefined && username.length !== 0) || (status !== undefined && status.length !== 0)) {
            // search users by username
            User.findUsersByParams({
                'username': username,
                'status': status
            }).then((users) => {
                return res.status(201).send(JSON.stringify(users));
            }).catch((err) => {
                console.log('Error searching users by username');
                return res.status(500).send(err);
            });
        } else {
            // If there's not a query parameter return all users.
            User.getUsers().then((users) => {
                return res.status(201).send(JSON.stringify(users));
            }).catch((err) => {
                console.log('Error searching all users');
                return res.status(500).send(err);
            });
        }
    }
}
module.exports = UsersController;

