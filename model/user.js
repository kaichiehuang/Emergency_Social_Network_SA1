const UserModel = require('./model').UserMongo;
const bcrypt = require("bcrypt");


class User {
    constructor(username,password,name,last_name) {
        this.username= username;
        this.password=password;
        this.name =name;
        this.last_name=last_name;
        this.acknowledgement=false;
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
    };

    updateKnowledge(userId,acknowledgement){

        return UserModel.findByIdAndUpdate(userId,{$set:{acknowledgement:acknowledgement}},{new:true});

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
    };

    findUserById(userId){
        UserModel.findById(userId)
            .then(res =>{
               return res;
            })
            .catch(err =>{
                return err;
            })
    };


    hashPassword(password){
        return bcrypt.hashSync(password,10);
    };


    async userExist(userId){
        console.log("before calling findbyId");
        let userInfo =  await UserModel.findById(userId);
        return userInfo._id;
    };

    // userExist(userId) {
    //     console.log("before calling findbyId");
    //     UserModel.findById(userId).then(function (userInfo) {
    //         return userInfo._doc._id.id;
    //     });
    // }

}

module.exports = User;