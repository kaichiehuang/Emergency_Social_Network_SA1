const UserModel = require('./model').UserMongo;
const ReservedNamesModel = require('./model').ReservedNamesMongo;
const bcrypt = require('bcrypt');

class User {
    constructor(username, password, name, last_name) {
        this.username = username;
        this.password = password;
        this.name = name;
        this.last_name = last_name;
        this.acknowledgement = false;
    }

    validate() {
        let usrRes = this.validateUserName(this.username);
        let pwdRes = this.validatePassword(this.password);
        if (usrRes != undefined) {
            if (!usrRes.res) {
                return usrRes;
            } else if (!pwdRes.res) {
                return pwdRes;
            } else {
                return usrRes;
            }
        } else {

            //insert reserved name npm plugin


            // this.validateReservedNames().
            // then( res => {
            //     if(res){
            //         return {
            //             res: "invalid username 99",
            //             msg: ''
            //         };
            //     }else{
            //         return {
            //             res: true,
            //             msg: ''
            //         };
            //     }
            // }).
            // catch( err => {
            //     return {
            //         res: "invalid username 990000",
            //         msg: ''
            //     };
            // });

        }
    }

    validateReservedNames() {
            //check reserved name
            let resObj = {
                res: true,
                msg: ''
            };
            console.log("username = ");
            console.log(this.username);
            //check reserved name
            return ReservedNamesModel.findOne( { name: this.username });


    }

    validateUserName() {
        //result object
        let resObj = {
            res: true,
            msg: ''
        };

        if (this.username.length < 3) {
            resObj.res = false;
            resObj.msg = 'user name too short';
            return resObj;
        }
        return resObj;
    }

    validatePassword() {
        let resObj = {
            res: true,
            msg: ''
        };
        if (this.password.length < 4) {
            resObj.res = false;
            resObj.msg = 'pwd is too short';
        } else {
            resObj.res = true;
            resObj.msg = '';
        }
        return resObj;
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
        UserModel.findOne(
            {
                _id: userId
            },
            function(err, user) {
                if (err) {
                    res.send(500, {
                        error: err
                    });
                }
                user.acknowledgement = acknowledgement;
                user.save();
            }
        );
    }

    /**
     * [findUserById description]
     * @param  {[type]} userId [description]
     * @return {[type]}        [description]
     */
    findUserById(userId) {
        UserModel.findById(userId)
            .then(res => {
                return res;
            })
            .catch(err => {
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
     * [userExist description]
     * @param  {[type]} userId [description]
     * @return {[type]}        [description]
     */
    userExist(userId) {
        console.log('before calling findbyId');
        UserModel.findById(userId)
            .then(res => {
                console.log(res);
                return true;
            })
            .catch(err => {
                return false;
            });
    }
}

module.exports = User;
