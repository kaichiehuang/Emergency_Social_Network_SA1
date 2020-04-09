const UserModel = require('./model').UserMongo;
const bcrypt = require('bcrypt');
const blacklist = require('the-big-username-blacklist');
const TokenServerClass = require('../middleware/TokenServer');
const constants = require('../constants');
class User {
    constructor() {
        this._id = null;
        this.username = null;
        this.password = null;
        this.name = null;
        this.last_name = null;
        this.phone_number = null;
        this.acknowledgement = false;
        this.onLine = false;
        this.status = constants.UNDEFINED_STATUS;
    }
    /**
     * Sets registration data
     * @param {[type]} username [description]
     * @param {[type]} password [description]
     */
    setRegistrationData(username, password) {
        this.username = username;
        this.password = password;
    }
    /**
     * Validates structure of registered data, it doesn't validate is username and password match, this is done in isPasswordMatch
     * @return {[type]} [description]
     */
    validateCreate() {
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
            }).catch((err) => reject(err));
        });
    }
    /**
     * VALIDATE USER NAMES LENGTH
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
     * Validates structure of registered data, it doesn't validate is username and password match, this is done in isPasswordMatch
     * @return {[type]} [description]
     */
    validateUpdate(data) {
        return new Promise((resolve, reject) => {
            let step = null;
            if (data.step != undefined && data.step == 1) {
                step = "personal";
            }
            if (data.step != undefined && data.step == 2) {
                step = "medical";
            }
            else if (data.step != undefined && data.step == 3) {
                step = "other";
            }

            //not updating personal info
            if(step == null){
                resolve(true);
            }

            //validate medical information and personal information and emergency contact information
            this.validateRequiredFieldsUpdate(step, data).then((result) => {
                console.log('Firsts validations passed');
                return this.validateLengthFieldsUpdate(step, data);
            }).then((result) => {
                console.log('All validations passed');
                // if no errors resolve promise with result obj
                resolve(true);
            }).catch(err => {
                console.log('validations not passed');
                // if errors reject the promise
                console.log(err);
                reject(err);
            });
        });
    }
    /**
     * VALIDATE USER NAMES LENGTH
     * [validateUserName description]
     * @return {[type]} [description]
     */
    validateRequiredFieldsUpdate(type, data) {
        return new Promise((resolve, reject) => {
            if (type == "personal") {
                if (data.name == undefined || data.last_name == undefined || data.birth_date == undefined || data.city == undefined || data.address == undefined || data.phone_number == 0 || data.emergency_contact == undefined || data.emergency_contact.name == undefined || data.emergency_contact.phone_number == undefined || data.emergency_contact.address == 0) {
                    reject("Missing required fields. Every field in this step is mandatory.");
                } else if (data.privacy_terms_data_accepted == undefined || data.privacy_terms_data_accepted == '') {
                    reject('Please accept the term and conditions for personal data treatment');
                } else {
                    if (data.name.length == 0 || data.last_name.length == 0 || data.birth_date.length == 0 || data.city.length == 0 || data.address.length == 0 || data.phone_number.length == 0 || data.emergency_contact == undefined || data.emergency_contact.name.length == 0 || data.emergency_contact.phone_number.length == 0 || data.emergency_contact.address.length == 0) {
                        reject('Missing required fields. Every field in this step is mandatory.');
                    }
                }
            } else if (type == "medical") {
                if (data.medical_information == undefined || data.medical_information.blood_type == 0) {
                    reject('Blood type is a mandatory field, please select a valid blood type');
                } else if (data.medical_information.privacy_terms_medical_accepted == undefined || data.medical_information.privacy_terms_medical_accepted == '') {
                    reject('Please accept the term and conditions for medical data treatment');
                }
            } else if (type == "other") {

                if (data.personal_message != undefined) {
                    console.log(data.personal_message, data.personal_message);
                    if(data.personal_message.security_question.length == 0 && data.personal_message.security_question_answer.length != 0){
                        reject('The security question and the answer to this cannot be empty if one of these is sent.');
                    }
                    if(data.personal_message.security_question.length != 0 && data.personal_message.security_question_answer.length == 0){
                        reject('The security question and the answer to this cannot be empty if one of these is sent.');
                    }
                }
            }
            resolve(true);
        });
    }
    /**
     * VALIDATE USER NAMES LENGTH
     * [validateUserName description]
     * @return {[type]} [description]
     */
    validateLengthFieldsUpdate(type, data) {
        return new Promise((resolve, reject) => {
            if (type == "personal") {
                if (data.city.length < 4 || data.address.length < 4) {
                    reject("City and address must have more than 4 characters.");
                } else if (data.phone_number.length < 7 || data.emergency_contact.phone_number.length < 7) {
                    reject("Every phone number must have more than 7 characters.");
                }
            } else if (type == "medical") {
                if (data.medical_information.blood_type == 0) {
                    reject('Blood type is a mandatory field, please select a valid blood type');
                } else if (data.medical_information.privacy_terms_medical_accepted == undefined || data.medical_information.privacy_terms_medical_accepted == '') {
                    reject('Please accept the term and conditions for medical data treatment');
                }
            }
            resolve(true);
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
    updateUser(userId, data) {
        return new Promise((resolve, reject) => {
            this.validateUpdate(data)
            .then(result => {
                return UserModel.findByIdAndUpdate(userId, {
                    $set: data
                }, {
                    new: true
                });
            })
            .then(usr => {
                resolve(usr);
            }).catch((err) => {
                reject(err);
            });
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
                if (user !== null && user.username != undefined && user.username == username) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch((err) => {
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
            TokenServerClass.generateToken(this._id, false).then((generatedToken) => {
                token = generatedToken;
                TokenServerClass.generateToken(this._id, true).then((genRefToken) => {
                    const tokens = {
                        token: token,
                        ex_token: genRefToken
                    };
                    resolve(tokens);
                }).catch((err) => {
                    reject(err);
                });
            }).catch((err) => {
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
                reject(err);
            });
        });
    }
    /**
     * Finds a user by username
     * @param  {[type]} userId [description]
     * @return {[type]}        [description]
     */
    static findUserByIdIfAuthorized(id, currentUserId) {
        return new Promise((resolve, reject) => {
            let tokenUser = null;
            User.findUserById(currentUserId).then((user) => {
                tokenUser = user;
                //same user no need to check if its an admin or authorized
                if (currentUserId.toString().localeCompare(id) == 0) {
                    resolve(user);
                }
                //diff user, check if its an admin or authorized
                else {
                    return User.findUserById(id);
                }
            }).then((user) => {
                //diff user, check if its an admin or authorized
                if (currentUserId.toString().localeCompare(id) != 0) {
                    if (user.emergency_contact == undefined || tokenUser.phone_number == undefined || tokenUser.phone_number == '' || tokenUser.phone_number.localeCompare(user.emergency_contact.phone_number) != 0) {
                        reject("You are not authorized");
                    }
                }
                resolve(user);
            }).catch((err) => {
                return reject(err);
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
                data.username = {
                    $regex: params.username
                };
            }
            if (params.status != undefined && params.status.length > 0) {
                data.status = params.status;
            }
            console.log(data);
            UserModel.find(data).select('username onLine status').sort({
                onLine: -1,
                username: 'asc'
            }).then((users) => {
                resolve(users);
            }).catch((err) => {
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
            UserModel.find({
                status: status
            }).select('username onLine status').sort({
                onLine: -1,
                username: 'asc'
            }).then((users) => {
                resolve(users);
            }).catch((err) => {
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
}
module.exports = User;