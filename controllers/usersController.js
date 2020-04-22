const User = require('../model/user.js');
const EmergencyStatusDetail = require('../model/emergencyStatusDetail.js');
const SocketIO = require('../utils/SocketIO.js');
/**
 * user controller
 */
class UsersController {
    constructor() {
        this.updateUser = this.updateUser.bind(this);
    }

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

        const jsonResponseData = {};

        // 2. Validate if user exists
        User.findUserByUsername(signUpData['username'])
            .then((user) => {
                let userInstance = user;
                // 4. if user doesn't exist validate data and create it
                if (user == null) {
                    userInstance = new User();
                    userInstance.setRegistrationData(signUpData['username'], signUpData['password']);

                    // 3. Run validations on user object
                    userInstance.validateCreate()
                        .then(function(result) {
                            return userInstance.registerUser();
                        }).then(function(response) {
                            return userInstance.generateTokens();
                        }).then((tokens) => {
                            jsonResponseData.user = Object.assign({}, userInstance._doc);
                            jsonResponseData.user.userId = userInstance._id.toString();
                            jsonResponseData.tokens = tokens;
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
                        .then((response) => {
                            // Validating if user is active
                            if (userInstance.active) {
                                userInstance.generateTokens()
                                    .then((tokens) => {
                                        jsonResponseData.user = Object.assign({}, userInstance._doc);
                                        jsonResponseData.user.userId = userInstance._id.toString();
                                        jsonResponseData.tokens = tokens;
                                        res.contentType('application/json');
                                        return res.status(201).send(JSON.stringify(jsonResponseData));
                                    });
                            } else {
                                return res.status(401).send({
                                    msg: 'Your account is inactive, try to login later'
                                }).end();
                            }
                        }).catch((err) => {
                            /* istanbul ignore next */
                            res.contentType('application/json');
                            return res.status(422).send({
                                msg: err
                            }).end();
                        });
                }
            }).catch((err) => {
            /* istanbul ignore next */
                res.contentType('application/json');
                return res.status(422).send({
                    msg: 'no existe'
                }).end();
            });
    }

    validateAccountStatus(userData, newStatus, resSocket) {
        if (newStatus.active !== undefined &&
            userData.active &&
            !newStatus.active) {
            const sockets = userData.sockets;
            if (sockets !== undefined && sockets.size > 0) {
                sockets.forEach(function(value, index) {
                    const socketIO = new SocketIO(resSocket.to(index));
                    socketIO.emitMessage('logout-user', 'Sorry, Your account has benn Suspended');
                });
            }
        }
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
        // 1. update user data
        User.findById(userId).then((user) => {
            userInstance = user;
            this.validateAccountStatus(user, req.body, res.io);
            return userInstance.updateUser(req.body);
        }).then((_) => {
            let jsonResponseData = {};
            jsonResponseData = userInstance;
            jsonResponseData['userId'] = userInstance._id;
            res.contentType('application/json');
            return res.status(201).send(JSON.stringify(jsonResponseData));
        }).catch((err) => {
            /* istanbul ignore next */
            res.contentType('application/json');
            /* istanbul ignore next */
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
        // check if user is authorized to get other users data
        const userId = req.params.userId;
        // 1. find user only if it is the same user or an authorized user
        User.findUserByIdIfAuthorized(userId, req.tokenUserId).then((user) => {
            res.contentType('application/json');
            user.personal_message.message = '';
            return res.status(201).send(JSON.stringify(user));
        }).catch((err) => {
            /* istanbul ignore next */
            if (err.toString().localeCompare('You are not authorized') == 0) {
                return res.status(403).send(err);
            }
            /* istanbul ignore next */
            return res.status(500).send(err);
        });
    }
    /**
     * Get the users of the DataBase (only user_name and online fields)
     * @param req
     * @param res
     */
    getPersonalMessageUser(req, res) {
        res.contentType('application/json');
        if (req.query.security_question_answer == undefined || req.query.security_question_answer.length == 0) {
            return res.status(403).send({
                msg: 'Invalid answer'
            });
        }
        const userId = req.params.userId;
        const securityQuestionAnswer = req.query.security_question_answer;
        // 1. find user by id and check if user is authorized to get other users data
        User.findUserByIdIfAuthorized(userId, req.tokenUserId).then((userInstance) => {
            return userInstance.getPersonalMessage(securityQuestionAnswer);
        }).then((message) => {
            return res.status(201).send({
                'message': message
            });
        }).catch((err) => {
            return res.status(403).send({
                msg: err
            });
        });
    }
    /**
     * Search users by username or status
     * @param req
     * @param res
     * @return {*}
     */
    getUsers(req, res) {
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
                /* istanbul ignore next */
                return res.status(500).send(err);
            });
        } else {
            // If there's not a query parameter return all users.
            User.getUsers().then((users) => {
                return res.status(201).send(JSON.stringify(users));
            }).catch((err) => {
                /* istanbul ignore next */
                return res.status(500).send(err);
            });
        }
    }
}
module.exports = UsersController;