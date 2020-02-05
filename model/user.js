const UserModel = require('./model').UserMongo;
const ReservedNamesModel = require('./model').ReservedNamesMongo;
const bcrypt = require("bcrypt");


class User {
    constructor(username,password,name,last_name) {
        this.username= username;
        this.password=password;
        this.name =name;
        this.last_name=last_name;
        this.acknowledgement=false;
    }

    validate() {
        var usrRes = this.validateUserName(this.username);
        var pwdRes = this.validatePassword(this.password);

        if (!usrRes.res) {
            return usrRes;
        } else if (!pwdRes.res) {
            return pwdRes;
        } else {
            return usrRes;
        }
    }

    validateUserName() {
        //check lenth
        resObj = {
            res: true,
            msg: ""
        };

        if (this.username.length < 3) {
            resObj.res = false;
            resObj.msg = "user name too short"
            return resObj;
        } else {
            //check reserved name
            ReservedNamesModel.findOne({username: this.username}, function(err, res) {
                if (err) {
                    resObj.res = false;
                    resObj.msg = "db query error";
                    return resObj;
                }

                if (res) {
                    resObj.res = false;
                    resObj.msg = "name is reserved";
                } else {
                    resObj.res = true;
                    resObj.msg = ""; 
                }
                return resObj;
            });

        }
    }

    validatePassword() {
        if (this.password.length < 4) {
            resObj.res = false;
            resObj.msg = "pwd is too short"; 
        } else {
            resObj.res = true;
            resObj.msg = ""; 
        }
        return resObj;
    }


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

        // newUser.save()
        //     .then( res =>{
        //         console.log(res);
        //         return res;
        //
        //     })
        //     .catch(err =>{
        //         console.error(err);
        //     });

    };

    updateKnowledge(userId,acknowledgement){
        UserModel.findOne({
            _id: userId
        }, function(err, user) {
            if (err) {
                console.log(err);
                res.send(500, {
                    error: err
                });
            }
            console.log(user);
            user.acknowledgement = acknowledgement;
            user.save();
        });

    };

    validateUserName(userName){
        UserModel.find({
            "username":userName})
            .then(res =>{
                console.log(res);
            })
            .catch(err =>{
                console.error(err);
            })
    }


    hashPassword(password){
        return bcrypt.hashSync(password,10);
    }

}

module.exports = User;