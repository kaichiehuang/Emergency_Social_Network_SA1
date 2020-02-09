const UserModel = require('./model').UserMongo;
const ReservedNamesModel = require('./model').ReservedNamesMongo;
const bcrypt = require('bcrypt');
const blacklist = require('the-big-username-blacklist');

class User {
    constructor(username, password, name, last_name) {
        this._id = null;
        this.username = username;
        this.password = password;
        this.name = name;
        this.last_name = last_name;
        this.acknowledgement = false;
    }
    /**
     * Validates structure of registered data, it doesn't validate is username and password match, this is done in isPasswordMatch
     * @return {[type]} [description]
     */
    validate() {
        return new Promise((resolve, reject) => {
            //validate username structure
            this.validateUserName(this.username).then(result => {
                console.log('Username structure validated');
                //validate banned username
                return this.validateBannerUsername();
            }).then(result => {
                console.log('Banned username validated');
                //validate password structure
                return this.validatePassword();
            }).then(result => {
                console.log('Username and password validated vs DB ---- All validations passed');
                //if no errors resolve promise with result obj
                resolve(result);
            }).catch(function(err) {
                console.log('validations not passed');
                //if errors reject the promise
                console.log(err);
                reject(err);
            });
        });
    }
    //WITH PROMISES
    /**
     * [isPasswordMatch description]
     * @param  {[type]}  password [description]
     * @return {Boolean}          [description]
     */
    isPasswordMatch(password) {
        return new Promise((resolve, reject) => {
            let msg = '';
            UserModel.find({
                username: this.username
            }).exec().then(userFind => {
                if (userFind.length !== 0) {
                    if (bcrypt.compareSync(this.password, userFind[0].password)) {
                        resolve(userFind[0]);
                    } else {
                        reject('password/username not matched ');
                    }
                } else {
                    reject('password/username not matched ');
                }
            }).catch(err => reject(err));
        });
    }
    //VALIDATE USER NAMES LENGTH
    /**
     * [validateUserName description]
     * @return {[type]} [description]
     */
    validateUserName() {
        return new Promise((resolve, reject) => {
            if (this.username.length < 3) {
                reject('Invalid username, please enter a longer username');
            }
            resolve(true);
        });
    }
    //VALIDATE PASSWORD  LENGTH
    /**
     * [validatePassword description]
     * @return {[type]} [description]
     */
    validatePassword() {
        return new Promise((resolve, reject) => {
            if (this.password.length < 4) {
                reject('pwd is too short');
            } else {
                resolve(true);
            }
        });
    }
    /**
     * [registerUser description]
     * @return {[type]} [description]
     */
    registerUser() {
        let hash = this.hashPassword(this.password);
        let newUser = new UserModel({
            username: this.username,
            password: hash,
            name: this.name,
            last_name: this.last_name,
            acknowledgement: false
        });
        return newUser.save();
    }
    /**
     * [updateKnowledge description]
     * @param  {[type]} userId          [description]
     * @param  {[type]} acknowledgement [description]
     * @return {[type]}                 [description]
     */
    updateKnowledge(userId, acknowledgement) {
        return UserModel.findByIdAndUpdate(userId, {
            $set: {
                acknowledgement: acknowledgement
            }
        }, {
            new: true
        });
    }
    /**
     * [findUserById description]
     * @param  {[type]} userId [description]
     * @return {[type]}        [description]
     */
    findUserById(userId) {
        UserModel.findById(userId).then(res => {
            return res;
        }).catch(err => {
            return err;
        });
    }
    /**
     * [findUserByUsername description]
     * @param  {[type]} userId [description]
     * @return {[type]}        [description]
     */
    static findUserByUsername(username) {
        return new Promise((resolve, reject) => {
            console.log(username);
            UserModel.findOne({
                username: username
            }).exec().then(user => {
                resolve(user);
            }).catch(err => {
                reject(err);
            });
        });
    }
    /**
     * [hashPassword description]
     * @param  {[type]} password [description]
     * @return {[type]}          [description]
     */
    hashPassword(password) {
        return bcrypt.hashSync(password, 10);
    }
    /**
     * [validateBannerUsername description]
     * @return {[type]} [description]
     */
    validateBannerUsername() {
        return new Promise((resolve, reject) => {
            var resObj = {};
            //3. Validate BlackListUser\
            let black = blacklist.validate(this.username);
            if (!black) {
                reject('Invalid username, this username is reserved for the platform. Please enter a different username.');
            } else {
                resolve(true);
            }
        });
    }
    /**
     * [usernameExists description]
     * @param  {[type]} username [description]
     * @return {[type]}          [description]
     */
    static usernameExists(username) {
        return new Promise((resolve, reject) => {
            console.log(username);
            User.findUserByUsername(username).then(user => {
                console.log('user found = ', user);
                if (user.username != undefined && user.username == username) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }).catch(err => {
                reject(err);
            });
        });
    }
    /**
     * [generateTokens description]
     * @return {[type]} [description]
     */
    generateTokens() {
        return new Promise((resolve, reject) => {
            let token = '';
            tokenMiddleWare.generateToken(this._id, false).then(generatedToken => {
                token = generatedToken;
                return tokenMiddleWare.generateToken(this._id, true);
            }).then(genRefToken => {
                let tokens = {
                    token: token,
                    ex_token: genRefToken
                };
                resolve(tokens);
            }).catch(err => {
                reject(err);
            });
        });
    }
}
module.exports = User;