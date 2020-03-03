const User = require('../model/user.js');
const ReservedNamesModel = require('../model/model').ReservedNamesMongo;
//const  = model.User;
const ObjectId = require('mongoose').Types.ObjectId;
class UsersController {
    /**
     * [createUser description]
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    createUser(req, res) {
        let signUpData = req.body;
        //1. If no username or password in json set them with emtpy values
        if (signUpData['username'] == undefined) {
            signUpData['username'] = '';
        }
        if (signUpData['password'] == undefined) {
            signUpData['password'] = '';
        }
        //2. Create user object
        let user_instance = new User(signUpData['username'], signUpData['password'], signUpData['name'], signUpData['last_name']);
        //3. Validate if user exists
        User.findUserByUsername(signUpData['username']).then(user => {
            //4. if user doesn't exist validate data and create it
            if (user == null) {
                //3. Run validations on user object
                var userData = null;
                user_instance.validate().then(function(result) {
                    return user_instance.registerUser();
                }).then(function(response) {
                    userData = response;
                    user_instance._id = response._id;
                    return user_instance.generateTokens();
                }).then(tokens => {
                    let jsonResponseData = {};
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
                }).catch(err => {
                    res.contentType('application/json');
                    return res.status(422).send({
                        msg: err
                    }).end();
                });
            } else {
                //3. Run validations on user object
                var userData = user;
                user_instance.isPasswordMatch().then(function(response) {
                    console.log(response);
                    userData = response;
                    user_instance._id = response._id;
                    return user_instance.generateTokens();
                }).then(tokens => {
                    let jsonResponseData = {};
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
                }).catch(err => {
                    res.contentType('application/json');
                    return res.status(422).send({
                        msg: err
                    }).end();
                });
            }
        }).catch(err => {
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
        let user_instance = new User();
        let userId = req.params.userId;
        let acknowledgement = req.body.acknowledgement;
        let onLine = req.body.onLine;
        let status = req.body.status;
        console.log(userId, acknowledgement);
        //1. update user data
        user_instance.updateUser(userId, acknowledgement, onLine, status).then(usr => {
            let jsonResponseData = {};
            jsonResponseData['user'] = {
                userId: usr._id.toString(),
                username: usr.username,
                name: usr.name,
                acknowledgement: usr.acknowledgement,
                onLine: usr.onLine,
                status: usr.status
            };
            // //save and delete the socket id if its online or offline
            // if (socketId != undefined && socketId != '' && deleteSocket != undefined) {
            //     if (deleteSocket === false) {
            //         User.insertSocket(usr._id.toString(), socketId).then(user => {
            //             console.log('success storing socket');
            //         }).catch(err => {
            //             console.log('error inserting socket');
            //         });
            //     } else if (deleteSocket === true) {
            //         User.removeSocket(usr._id.toString(), socketId);
            //     }
            // }
            res.contentType('application/json');
            return res.status(201).send(JSON.stringify(jsonResponseData));
        }).catch(err => {
            return res.status(500).send(err);
        });
    }
    /**
     * Get the users of the DataBase (only user_name and online fields)
     * @param req
     * @param res
     */
    getAllUsers(req, res) {
        let user_instance = new User();
        user_instance.getUsers().then(users => {
            res.contentType('application/json');
            return res.status(201).send(JSON.stringify(users));
        }).catch(err => {
            return res.status(500).send(err);
        });
    }
    /**
     * [createSocket description]
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    createSocket(req, res) {
        let socketData = req.body;
        let socketId = req.body.socketId;
        let userId = req.params.userId;
        //1. Validate if user exists
        User.findUserById(userId).then(user => {
            return User.insertSocket(userId, socketId);
        }).then(user => {
            res.contentType('application/json');
            return res.status(201).send(JSON.stringify(user));
        }).catch(err => {
            return res.status(500).send(err);
        });
    }
    deleteSocket(req, res) {

        let socketData = req.body;
        let socketId = req.params.socketId;
        let userId = req.params.userId;

        //1. Validate if user exists
        User.findUserById(userId).then(user => {
            return User.removeSocket(userId, socketId);
        }).then(user => {
            res.contentType('application/json');
            return res.status(201).send(JSON.stringify(user));
        }).catch(err => {
            console.log("catch when socket id doesn't exist")
            return res.status(500).send(err);
        });
    }
}
module.exports = UsersController;