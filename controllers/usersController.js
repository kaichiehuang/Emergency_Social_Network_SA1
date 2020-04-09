const User = require('../model/user.js');
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
        // 2. Create user object
        let user_instance = new User();
        user_instance.setRegistrationData(signUpData['username'], signUpData['password']);
        // 3. Validate if user exists
        User.findUserByUsername(signUpData['username']).then((user) => {
            // 4. if user doesn't exist validate data and create it
            if (user == null) {
                // 3. Run validations on user object
                let userData = null;
                user_instance.validateCreate()
                .then(function(result) {
                    return user_instance.registerUser();
                }).then(function(response) {
                    userData = response;
                    user_instance._id = response._id;
                    return user_instance.generateTokens();
                }).then((tokens) => {
                    const jsonResponseData = {};
                    jsonResponseData['user'] = {
                        userId: userData._id,
                        username: userData.username,
                        name: userData.name,
                        acknowledgement: userData.acknowledgement,
                        onLine: userData.onLine,
                        status: userData.status
                    };
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
            } else {
                // 3. Run validations on user object
                let userData = user;
                user_instance.isPasswordMatch().then(function(response) {
                    userData = response;
                    user_instance._id = response._id;
                    return user_instance.generateTokens();
                }).then((tokens) => {
                    const jsonResponseData = {};
                    jsonResponseData['user'] = {
                        userId: userData._id.toString(),
                        username: userData.username,
                        name: userData.name,
                        acknowledgement: userData.acknowledgement,
                        onLine: userData.onLine,
                        status: userData.status
                    };
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
        const user_instance = new User();
        const userId = req.params.userId;
        console.log(req.body);
        // 1. update user data
        user_instance.updateUser(userId, req.body)
        .then((usr) => {
            let jsonResponseData = {};
            jsonResponseData = {
                _id: usr._id.toString(),
                username: usr.username,
                name: usr.name,
                last_name: usr.last_name,
                acknowledgement: usr.acknowledgement,
                onLine: usr.onLine,
                status: usr.status
            };
            if(req.body.acknowledgement != undefined){
                // jsonResponseData['tokens'] = tokens;
            }


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
        console.log("tokenUserId = " + req.tokenUserId);

        const userId = req.params.userId;
        console.log(userId, req.tokenUserId);
        //1. find token user id
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

        var tokenUser = null;
        //check if user is authorized to get other users data
        console.log("tokenUserId = " + req.tokenUserId);
        const userId = req.params.userId;

        if(req.query.security_question_answer == undefined){
            return res.status(403).send("Invalid answer");
        }

        const security_question_answer = req.query.security_question_answer;

        //1. find token user id
        User.getPersonalMessage(userId, req.tokenUserId, security_question_answer)
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
     * Update user status
     *  An specific Update user for status, to update status timestamp
     * @param req
     * @param res
     */
    updateUserStatus(req, res) {
        const user_instance = new User();
        const userId = req.params.userId;
        const status = req.body.status;
        // 1. update user data
        user_instance.updateUser(userId, req.body).then((usr) => {
            const jsonResponseData = {};
            jsonResponseData['user'] = {
                userId: usr._id.toString(),
                username: usr.username,
                name: usr.name,
                acknowledgement: usr.acknowledgement,
                onLine: usr.onLine,
                status: usr.status
            };
            res.contentType('application/json');
            return res.status(201).send(JSON.stringify(jsonResponseData));
        }).catch((err) => {
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
