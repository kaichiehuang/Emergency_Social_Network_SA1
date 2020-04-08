const UserModel = require('./model').UserMongo;
const bcrypt = require('bcrypt');
const blacklist = require('the-big-username-blacklist');
const TokenServerClass = require('../middleware/TokenServer');
const constants = require('../constants');

class User {
    constructor(username, password, name, last_name) {
        this._id = null;
        this.username = username;
        this.password = password;
        this.name = name;
        this.last_name = last_name;
        this.acknowledgement = false;
        this.onLine = false;
        this.status = constants.UNDEFINED_STATUS;
    }

    /**
     * Validates structure of registered data, it doesn't validate is username and password match, this is done in isPasswordMatch
     * @return {[type]} [description]
     */
    validate() {
        return new Promise((resolve, reject) => {
            // validate username structure
            this.validateUserName(this.username).then((result) => {
                console.log('Username structure validated');
                // validate banned username
                return this.validateBannedUsername();
            }).then((result) => {
                console.log('Banned username validated');
                // validate password structure
                return this.validatePassword();
            }).then((result) => {
                console.log('All validations passed');
                // if no errors resolve promise with result obj
                resolve(true);
            }).catch(function(err) {
                console.log('validations not passed');
                // if errors reject the promise
                console.log(err);
                reject(err);
            });
        });
    }

    // WITH PROMISES
    /**
     * [isPasswordMatch description]
     * @param  {[type]}  password [description]
     * @return {Boolean}          [description]
     */
    isPasswordMatch() {
        return new Promise((resolve, reject) => {
            UserModel.find({
                username: this.username
            }).exec().then((userFind) => {
                if (userFind.length !== 0) {
                    if (bcrypt.compareSync(this.password, userFind[0].password)) {
                        resolve(userFind[0]);
                    } else {
                        reject('Invalid username / password.');
                    }
                } else {
                    reject('Invalid username / password.');
                }
            }).catch((err) => {
                /* istanbul ignore next */
                reject(err);
            });
        });
    }

    // VALIDATE USER NAMES LENGTH
    /**
     * [validateUserName description]
     * @return {[type]} [description]
     */
    validateUserName() {
        return new Promise((resolve, reject) => {
            if (this.username.length < 3) {
                reject('Invalid username, please enter a longer username (min 3 characters)');
            }
            resolve(true);
        });
    }

    // VALIDATE PASSWORD  LENGTH
    /**
     * [validatePassword description]
     * @return {[type]} [description]
     */
    validatePassword() {
        return new Promise((resolve, reject) => {
            if (this.password.length < 4) {
                reject('Invalid password, please enter a longer username (min 4 characters)');
            } else {
                resolve(true);
            }
        });
    }

    /**
     * Register a username in DB. it hashes the password
     * @return {[type]} [description]
     */
    registerUser() {
        const hash = this.hashPassword(this.password);
        const newUser = new UserModel({
            username: this.username,
            password: hash,
            name: this.name,
            last_name: this.last_name,
            acknowledgement: false,
            onLine: false,
            status: constants.UNDEFINED_STATUS
        });
        return newUser.save();
    }

    /**
     * Updates the acknowledgement for a user
     * @param  {[type]} userId          [description]
     * @param  {[type]} acknowledgement [description]
     * @param  {[type]} status          [description]
     * @return {[type]}                 [description]
     */
    updateUser(userId, acknowledgement, onLine, status) {
        return UserModel.findByIdAndUpdate(userId, {
            $set: {
                acknowledgement: acknowledgement,
                onLine: onLine,
                status: status
            }
        }, {
            new: true
        });
    }

    /**
     * Update the user status field
     * @param userId
     * @param acknowledgement
     * @param onLine
     * @param status
     * @return {*}
     */
    updateUserStatus(userId, status) {
        return UserModel.findByIdAndUpdate(userId, {
            $set: {
                status: status,
                status_timestamp: new Date()
            }
        }, {
            new: true
        });
    }

    /**
     * Finds a user by username
     * @param  {[type]} userId [description]
     * @return {[type]}        [description]
     */
    static findUserByUsername(username) {
        return new Promise((resolve, reject) => {
            UserModel.findOne({
                username: username
            }).exec().then((user) => {
                resolve(user);
            }).catch((err) => {
                /* istanbul ignore next */
                reject(err);
            });
        });
    }

    /**
     * hashes a user password
     * @param  {[type]} password [description]
     * @return {[type]}          [description]
     */
    hashPassword(password) {
        return bcrypt.hashSync(password, 10);
    }

    /**
     * Validates if a username is banned
     * @return {[type]} [description]
     */
    validateBannedUsername() {
        return new Promise((resolve, reject) => {
            // 3. Validate BlackListUser\
            const black = blacklist.validate(this.username);
            if (!black) {
                reject('Invalid username, this username is reserved for the platform. Please enter a different username.');
            } else {
                resolve(true);
            }
        });
    }

    /**
     * Checks if a username exists
     * @param  {[type]} username [description]
     * @return boolean          Resolves True if it exists / resolves False if it doesn't existe, rejects if error
     */
    static usernameExists(username) {
        return new Promise((resolve, reject) => {
            User.findUserByUsername(username).then((user) => {
                if (user!== null && user.username != undefined && user.username == username) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch((err) => {
                /* istanbul ignore next */
                reject(err);
            });
        });
    }

    /**
     * Generates a token for a user
     * @return {[type]} [description]
     */
    generateTokens() {
        return new Promise((resolve, reject) => {
            let token = '';
            TokenServerClass.generateToken(this._id, false)
                .then((generatedToken) => {
                    token = generatedToken;
                    TokenServerClass.generateToken(this._id, true)
                        .then((genRefToken) => {
                            const tokens = {
                                token: token,
                                ex_token: genRefToken
                            };
                            resolve(tokens);
                        })
                        .catch((err) => {
                            /* istanbul ignore next */
                            reject(err);
                        });
                })
                .catch((err) => {
                    /* istanbul ignore next */
                    reject(err);
                });
        });
    }

    /**
     * username exists / true or false
     * @return {[type]} [description]
     */
    static userExist(id) {
        return new Promise((resolve, reject) => {
            this.findUserById(id).then((result) => {
                if (result !== null && result.id == id) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch((err) => {
                /* istanbul ignore next */
                reject(err);
            });
        });
    }

    /**
     * Finds a user by username
     * @param  {[type]} userId [description]
     * @return {[type]}        [description]
     */
    static findUserById(id) {
        return new Promise((resolve, reject) => {
            UserModel.findOne({
                _id: id
            }).exec().then((user) => {
                resolve(user);
            }).catch((err) => {
                /* istanbul ignore next */
                reject(err);
            });
        });
    }

    /**
     * [getUsers description]
     * @return {[type]} [description]
     */
    static getUsers() {
        return new Promise((resolve, reject) => {
            UserModel.find({}).select('username onLine status').sort({
                onLine: -1,
                username: 'asc'
            }).then((users) => {
                resolve(users);
            }).catch((err) => {
                /* istanbul ignore next */
                reject(err);
            });
        });
    }

    /**
     * Find users by user name (contains)
     * @param username
     * @return {Promise<unknown>}
     */
    static findUsersByParams(params) {
        return new Promise((resolve, reject) => {
            const data = {};
            if (params.username != undefined && params.username.length > 0) {
                data.username = {$regex: params.username};
            }
            if (params.status != undefined && params.status.length > 0) {
                data.status = params.status;
            }
            console.log(data);
            UserModel.find(data)
                .select('username onLine status')
                .sort({
                    onLine: -1,
                    username: 'asc'
                }).then((users) => {
                    resolve(users);
                }).catch((err) => {
                    /* istanbul ignore next */
                    reject(err);
                });
        });
    }

    /**
     * Find user by user status
     * @param status
     * @return {Promise<unknown>}
     */
    static findUsersByStatus(status) {
        return new Promise((resolve, reject) => {
            UserModel.find({status: status})
                .select('username onLine status')
                .sort({
                    onLine: -1,
                    username: 'asc'
                }).then((users) => {
                    resolve(users);
                }).catch((err) => {
                    /* istanbul ignore next */
                    reject(err);
                });
        });
    }


    /**
     * Inserts a socket to the sockets map attribute
     * @param  {[type]} userId   [description]
     * @param  {[type]} socketId [description]
     * @return {[type]}          [description]
     */
    static insertSocket(userId, socketId) {
        return new Promise((resolve, reject) => {
            User.findUserById(userId).then((user) => {
                if (user.sockets == undefined) {
                    user.sockets = {};
                }
                return user.save();
            }).then((user) => {
                if (user.sockets.has(socketId) == false) {
                    user.sockets.set(socketId, 1);
                }
                return user.save();
            }).then((user) => {
                resolve(user);
            }).catch((err) => {
                /* istanbul ignore next */
                reject(err);
            });
        });
    }

    /**
     * Removes a socket from the sockets map attribute
     * @param  {[type]} userId   [description]
     * @param  {[type]} socketId [description]
     * @return {[type]}          [description]
     */
    static removeSocket(userId, socketId) {
        return new Promise((resolve, reject) => {
            User.findUserById(userId).then((user) => {
                if (user.sockets == undefined) {
                    user.sockets = {};
                }
                return user.save();
            }).then((user) => {
                if (user.sockets.has(socketId)) {
                    user.sockets.delete(socketId);
                } else {
                    reject('Socket does not exist');
                }
                return user.save();
            }).then((user) => {
                resolve(user);
            }).catch((err) => {
                /* istanbul ignore next */
                reject(err);
            });
        });
    }

    /**
     * [changeMessageCount description]
     * @param  {[type]} senderUserId   [description]
     * @param  {[type]} receiverUserId [description]
     * @param  {[type]} increaseCount  [description]
     * @return {[type]}                [description]
     */
    static changeMessageCount(senderUserId, receiverUserId, increaseCount) {
        return new Promise((resolve, reject) => {
            User.findUserById(receiverUserId).then((user) => {
                if (user.unread_messages == undefined) {
                    user.unread_messages = {};
                }
                return user.save();
            }).then((user) => {
                if (user.unread_messages.has(senderUserId) == false) {
                    user.unread_messages.set(senderUserId, 1);
                } else {
                    let count = user.unread_messages.get(senderUserId);
                    if (increaseCount) {
                        count++;
                    } else {
                        count = 0;
                    }
                    user.unread_messages.set(senderUserId, count);
                }
                return user.save();
            }).then((user) => {
                resolve(user);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    /**
     * set report spam reporter for current user
     * @param userId
     * @param reporterUserId
     *
     */
    static setReportSpam(userId, reporterUserId) {
        return new Promise((resolve, reject) => {
            User.findUserById(userId)
                .then((user) => {
                    if (user.reported_spams == undefined) {
                        user.reported_spams = {};
                    }
                    user.reported_spams.set(reporterUserId, true);
                    user.spam = (user.reported_spams.size >= constants.USER_SPAM_REPORTED_LIMIT);
                    return user.save();
                }).then((user) => {
                    resolve(user);
                }).catch((err) => {
                    /* istanbul ignore next */
                    reject(err);
                });
        });
    }
}

module.exports = User;
