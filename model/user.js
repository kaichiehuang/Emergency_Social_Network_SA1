const mongoose = require('mongoose');
const UserSchema = require('./model').UserSchema;
const bcrypt = require('bcrypt');
const blacklist = require('the-big-username-blacklist');
const TokenServerClass = require('../middleware/TokenServer');
const constants = require('../constants');
/**
 * Our class for user model taht will be attached to the schema
 */
 class UserModel {
    /**
     * Sets registration data
     * @param {[type]} username [description]
     * @param {[type]} password [description]
     */
     setRegistrationData(username, password) {
        this.username = username;
        this.password = password;
        this.status = "UNDEFINED";
    }
    /*******************

        VALIDATIONS

        ******************/
    /**
     * Validates structure of registered data, it doesn't validate is username and password match, this is done in isPasswordMatch
     * @return {[type]} [description]
     */
     validateCreate() {
        return new Promise((resolve, reject) => {
            // validate username structure
            if (!this.validateUserName()) {
                return reject('Invalid username, please enter a longer username (min 3 characters)');
            }
            // validate banned users
            if (!this.validateBannedUsername()) {
                return reject('Invalid username, this username is reserved for the platform. Please enter a different username.');
            }
            // validate password structure
            if (!this.validatePassword()) {
                return reject('Invalid password, please enter a longer username (min 4 characters)');
            }
            return resolve(true);
        });
    }
    /**
     * [isPasswordMatch description]
     * @param  {[type]}  password [description]
     * @return {Boolean}          [description]
     */
     isPasswordMatch(inputPassword) {
        return new Promise((resolve, reject) => {
            if (bcrypt.compareSync(inputPassword, this.password)) {
                return resolve(true);
            } else {
                return reject('Invalid username / password.');
            }
        });
    }
    /**
     * VALIDATE USER NAMES LENGTH
     * [validateUserName description]
     * @return {[type]} [description]
     */
     validateUserName() {
        if (this.username.length < 3) {
            return false;
        }
        return true;
    }
    // VALIDATE PASSWORD  LENGTH
    /**
     * [validatePassword description]
     * @return {[type]} [description]
     */
     validatePassword() {
        if (this.password.length < 4) {
            return false;
        }
        return true;
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
            } else if (data.step != undefined && data.step == 2) {
                step = "medical";
            } else if (data.step != undefined && data.step == 3) {
                step = "other";
            }
            //not updating personal info
            if (step == null) {
                return resolve(true);
            } else {
                //validate medical information and personal information and emergency contact information
                this.validateRequiredFieldsUpdate(step, data).then((result) => {
                    console.log('Firsts validations passed');
                    return this.validateLengthFieldsUpdate(step, data);
                }).then((result) => {
                    console.log('All validations passed');
                    return resolve(true);
                }).catch(err => {
                    console.log('validations not passed');
                    // if errors reject the promise
                    console.log(err);
                    return reject(err);
                });
            }
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
                    return reject("Missing required fields. Every field in this step is mandatory.");
                } else if (data.privacy_terms_data_accepted == undefined || data.privacy_terms_data_accepted == '') {
                    return reject('Please accept the term and conditions for personal data treatment');
                } else {
                    if (data.name.length == 0 || data.last_name.length == 0 || data.birth_date.length == 0 || data.city.length == 0 || data.address.length == 0 || data.phone_number.length == 0 || data.emergency_contact == undefined || data.emergency_contact.name.length == 0 || data.emergency_contact.phone_number.length == 0 || data.emergency_contact.address.length == 0) {
                        return reject('Missing required fields. Every field in this step is mandatory.');
                    }
                }
            } else if (type == "medical") {
                if (data.medical_information == undefined || data.medical_information.blood_type == 0) {
                    return reject('Blood type is a mandatory field, please select a valid blood type');
                } else if (data.medical_information.privacy_terms_medical_accepted == undefined || data.medical_information.privacy_terms_medical_accepted == '') {
                    return reject('Please accept the term and conditions for medical data treatment');
                }
            } else if (type == "other") {
                if (data.personal_message != undefined) {
                    if (data.personal_message.security_question.length == 0 && data.personal_message.security_question_answer.length != 0) {
                        return reject('The security question and the answer to this cannot be empty if one of these is sent.');
                    }
                    if (data.personal_message.security_question.length != 0 && data.personal_message.security_question_answer.length == 0) {
                        return reject('The security question and the answer to this cannot be empty if one of these is sent.');
                    }
                }
            }
            return resolve(true);
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
                    return reject("City and address must have more than 4 characters.");
                } else if (data.phone_number.length < 7 || data.emergency_contact.phone_number.length < 7) {
                    return reject("Every phone number must have more than 7 characters.");
                }
            } else if (type == "medical") {
                if (data.medical_information.blood_type == 0) {
                    return reject('Blood type is a mandatory field, please select a valid blood type');
                } else if (data.medical_information.privacy_terms_medical_accepted == undefined || data.medical_information.privacy_terms_medical_accepted == '') {
                    return reject('Please accept the term and conditions for medical data treatment');
                }
            }
            return resolve(true);
        });
    }
    /**
     * Validates if a username is banned
     * @return {[type]} [description]
     */
     validateBannedUsername() {
        // 3. Validate BlackListUser\
        const black = blacklist.validate(this.username);
        if (!black) {
            return false;
        }
        return true;
    }
    /*******************

          OPERATIONS

          ******************/
    /**
     * Register a username in DB. it hashes the password
     * @return {[type]} [description]
     */
     registerUser() {
        return new Promise((resolve, reject) => {
            this.hashPassword(this.password);
            this.save().then(_ => {
                return resolve(true);
            }).catch(err => {
                return reject(err);
            })
        });
    }
    /**
     * Updates the  user
     * @param  {[type]} data            Array of data
     * @return {[type]}                 [description]
     */
     updateUser(data) {
        return new Promise((resolve, reject) => {
            this.validateUpdate(data).then(result => {
                if (data['status'] != undefined) {
                    this.status_timestamp = new Date()
                }
                this.set(data);
                return this.save();
            }).then(usr => {
                return resolve(true);
            }).catch((err) => {
                return reject(err);
            });
        });
    }
    /**
     * hashes a user password //
     * @param  {[type]} password [description]
     * @return {[type]}          [description]
     */
     hashPassword(password) {
        this.password = bcrypt.hashSync(password, 10);
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
                    return resolve(tokens);
                }).catch((err) => {
                    return reject(err);
                });
            }).catch((err) => {
                return reject(err);
            });
        });
    }
    /**
     * Inserts a socket to the sockets map attribute
     * @param  {[type]} userId   [description]
     * @param  {[type]} socketId [description]
     * @return {[type]}          [description]
     */
     insertSocket(socketId) {
        return new Promise((resolve, reject) => {
            if (this.sockets == undefined) {
                this.sockets = {};
            }
            this.save().then((result) => {
                if (this.sockets.has(socketId) == false) {
                    this.sockets.set(socketId, 1);
                }
                return this.save();
            }).then((result) => {
                return resolve(result);
            }).catch((err) => {
                return reject(err);
            });
        });
    }
    /**
     * Removes a socket from the sockets map attribute
     * @param  {[type]} userId   [description]
     * @param  {[type]} socketId [description]
     * @return {[type]}          [description]
     */
     removeSocket(socketId) {
        return new Promise((resolve, reject) => {
            if (this.sockets == undefined) {
                return reject('Socket does not exist');
            }
            if (this.sockets.has(socketId)) {
                this.sockets.delete(socketId);
            } else {
                return reject('Socket does not exist');
            }
            return this.save()
            .then((result) => {
                return resolve(result);
            }).catch((err) => {
                return reject(err);
            });
        });
    }
    /**
     * Change message count for all messages sent by the senderUserId to current user
     * @param  {[type]} senderUserId   [description]
     * @param  {[type]} increaseCount  [description]
     * @return  Returns the count after increasing
     */
     changeMessageCount(senderUserId, reset) {
        senderUserId = String(senderUserId);
        return new Promise((resolve, reject) => {
            if (this.unread_messages == undefined) {
                this.unread_messages = {};
            }
            this.save()
            .then((res) => {
                if (reset !== true && this.unread_messages.has(senderUserId) == false) {
                    this.unread_messages.set(senderUserId, 1);
                } else {
                    let count = this.unread_messages.get(senderUserId);
                    if(reset === true){
                        this.unread_messages.delete(senderUserId);
                    }
                    else if(reset !== true){
                        if(isNaN(count) || count <= 0){
                            count = 1;
                        }else{
                            count++;
                        }
                        this.unread_messages.set(senderUserId, count);
                    }
                }
                return this.save();
            }).then((res) => {
                if(reset === true){
                    return resolve(0);
                }
                return resolve(this.unread_messages.get(senderUserId));
            }).catch((err) => {
                return reject(err);
            });
        });
    }
    /**
     * Get the personal message for a user if the security question matches
     * @param  {[type]} security_question_answer [description]
     * @return {[type]}                          [description]
     */
     getPersonalMessage(security_question_answer) {
        return new Promise((resolve, reject) => {
            if (this.personal_message != undefined && this.personal_message.security_question_answer.length > 0 && this.personal_message.security_question_answer.localeCompare(security_question_answer) == 0) {
                return resolve(this.personal_message.message);
            } else {
                return reject("Invalid answer");
            }
        });
    }
    /******************************

          STATIC FIND FUNCTIONS

          *****************************/
    /**
     * Checks if a username exists
     * @param  {[type]} username [description]
     * @return boolean          return Resolves True if it exists / resolves False if it doesn't existe, rejects if error
     */
     static usernameExists(username) {
        return new Promise((resolve, reject) => {
            const userModel = new User();
            this.findUserByUsername(username).then((user) => {
                if (user !== null && user.username != undefined && user.username == username) {
                    return resolve(true);
                } else {
                    return resolve(false);
                }
            }).catch((err) => {
                return reject(err);
            });
        });
    }
    /**
     * username exists / true or false
     * @return {[type]} [description]
     */
     static userExist(id) {
        return new Promise((resolve, reject) => {
            User.findUserById(id).then((user) => {
                console.log(user);
                if (user !== null) {
                    return resolve(true);
                } else {
                    return resolve(false);
                }
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
     static findUserByUsername(username) {
        return new Promise((resolve, reject) => {
            let userModel = new User();
            this.findOne({
                username: username
            }).exec().then(user => {
                return resolve(user);
            }).catch((err) => {
                return reject(err);
            });
        });
    }
    /**
     * Finds a user by Id only if the user searching for it is authorized
     * @param  {[type]} userId [description]
     * @return {[type]}        [description]
     */
     static findUserByIdIfAuthorized(id, currentUserId) {
        return new Promise((resolve, reject) => {
            let searchingUser = null;
            User.findUserById(currentUserId).then((user) => {
                if (user == null) {
                    return reject("You are not authorized");
                }
                //same user no need to check if its an admin or authorized
                if (currentUserId.toString().localeCompare(id) == 0) {
                    return resolve(user);
                }
                //diff user, check if its an admin or authorized
                searchingUser = user;
                return User.findUserById(id);
            }).then((user) => {
                if (user == null) {
                    return reject("You are not authorized");
                }
                //diff user, check if its an admin or authorized
                if (currentUserId.toString().localeCompare(id) != 0) {
                    if (user.emergency_contact == undefined || user.emergency_contact.phone_number == undefined || searchingUser.phone_number == undefined || searchingUser.phone_number == '' || searchingUser.phone_number.localeCompare(user.emergency_contact.phone_number) != 0) {
                        return reject("You are not authorized");
                    }
                }
                return resolve(user);
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
            this.findOne({
                _id: id
            }).exec().then((user) => {
                return resolve(user);
            }).catch((err) => {
                return reject(err);
            });
        });
    }
    /**
     * [getUsers description]
     * @return {[type]} [description]
     */
     static getUsers() {
        return new Promise((resolve, reject) => {
            this.find({}).select('username onLine status').sort({
                onLine: -1,
                username: 'asc'
            }).then((users) => {
                return resolve(users);
            }).catch((err) => {
                return reject(err);
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
            this.find(data).select('username onLine status').sort({
                onLine: -1,
                username: 'asc'
            }).then((users) => {
                return resolve(users);
            }).catch((err) => {
                return reject(err);
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
            this.find({
                status: status
            }).select('username onLine status').sort({
                onLine: -1,
                username: 'asc'
            }).then((users) => {
                return resolve(users);
            }).catch((err) => {
                return reject(err);
            });
        });
    }
}
UserSchema.loadClass(UserModel);
const User = mongoose.model('User', UserSchema);
module.exports = User;