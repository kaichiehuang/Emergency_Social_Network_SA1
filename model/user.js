const UserModel = require('./model').UserMongo;
const ReservedNamesModel = require('./model').ReservedNamesMongo;
const bcrypt = require('bcrypt');
const blacklist = require("the-big-username-blacklist");
class User {
    constructor(username, password, name, last_name) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.last_name = last_name;
        this.acknowledgement = false;
    }
    /**
     * [validate description]
     * @return {[type]} [description]
     */
    validate() {
        return new Promise((resolve, reject) => {
            //validate username structure
            this.validateUserName(this.username).then(result => {
                console.log("Username structure validated");
                //validate banned username
                return this.validateBannerUsername();
            }).then(result => {
                console.log("Banned username validated");
                //validate password structure
                return this.validatePassword();
            }).then(result => {
                console.log("Password structure validated");
                //validate user vs DB
                return this.isPasswordMatch();
            }).then(result => {
                console.log("Username and password validated vs DB ---- All validations passed");
                //if no errors resolve promise with result obj
                resolve(result);
            }).catch(function(err) {
                console.log("validations not passed");
                //if errors reject the promise
                console.log(err);
                reject(err);
            });
        })
    }
    //WITH PROMISES
    /**
     * [isPasswordMatch description]
     * @param  {[type]}  password [description]
     * @return {Boolean}          [description]
     */
    isPasswordMatch(password) {
        return new Promise((resolve, reject) => {
            let resObj = {
                res: true,
                msg: ''
            };
            UserModel.find({
                'username': this.username
            }).exec().then(userFind => {
                if (userFind.length !== 0) {
                    bcrypt.compare(this.password, userFind[0].password, function(err, res) {
                        if (res) {
                            resolve(userFind[0]);
                        } else {
                            resObj.res = false;
                            resObj.msg = 'password/username not matched ';
                        }
                    });
                } else {
                    resObj.res = true;
                    resolve(resObj);
                }
            }).catch(err => reject(err));
        })
    }
    /**
     * [isReservedNames description]
     * @return {Boolean} [description]
     */
    isReservedNames() {
        //check reserved name
        let resObj = {
            res: true,
            msg: ''
        };
        ReservedNamesModel.find({
            'name': this.username
        }).then(names => {
            if (names.length != 0) {
                resObj.res = false;
                resObj.msg = 'Invalid username, is in the list of reserved usernames.';
            }
            return resObj;
        }).catch().catch(err => {
            res.send(500, {
                error: err
            });
        });
    }
    //VALIDATE USER NAMES LENGTH
    /**
     * [validateUserName description]
     * @return {[type]} [description]
     */
    validateUserName() {
        return new Promise((resolve, reject) => {
            let resObj = {
                res: true,
                msg: ''
            };
            if (this.username.length < 3) {
                resObj.res = false;
                resObj.msg = 'Invalid username, please enter a longer username';
                reject(resObj);
            }
            resolve(resObj);
        })
    }
    //VALIDATE PASSWORD  LENGTH
    /**
     * [validatePassword description]
     * @return {[type]} [description]
     */
    validatePassword() {
        return new Promise((resolve, reject) => {
            let resObj = {
                res: true,
                msg: ''
            };
            if (this.password.length < 4) {
                resObj.res = false;
                resObj.msg = 'pwd is too short';
                reject(resObj);
            } else {
                resObj.res = true;
                resObj.msg = '';
                resolve(resObj);
            }
        })
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
    };
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
                resObj.res = false;
                resObj.msg = 'Invalid username, this username is reserved for the platform. Please enter a different username.';
                reject(resObj);
            } else {
                resObj.res = true;
                resObj.msg = '';
                resolve(resObj);
            }
        });
    }
    /**
     * [userExist description]
     * @param  {[type]} userId [description]
     * @return {[type]}        [description]
     */
    async userExist(userId) {
        console.log("before calling findbyId");
        let userInfo = await UserModel.findById(userId);
        return userInfo._id;
    };
}
module.exports = User;