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
    };

    /**
     * [updateKnowledge description]
     * @param  {[type]} userId          [description]
     * @param  {[type]} acknowledgement [description]
     * @return {[type]}                 [description]
     */
    updateKnowledge(userId,acknowledgement){

        return UserModel.findByIdAndUpdate(userId,{$set:{acknowledgement:acknowledgement}},{new:true});

    };

    /**
     * [findUserById description]
     * @param  {[type]} userId [description]
     * @return {[type]}        [description]
     */
    findUserById(userId){
        UserModel.findById(userId)
            .then(res =>{
               return res;
            })
            .catch(err =>{
                return err;
            })
    };

    /**
     * [hashPassword description]
     * @param  {[type]} password [description]
     * @return {[type]}          [description]
     */
    hashPassword(password){
        return bcrypt.hashSync(password,10);
    };

    /**
     * [userExist description]
     * @param  {[type]} userId [description]
     * @return {[type]}        [description]
     */
    async userExist(userId){

        console.log("before calling findbyId");
        let userInfo =  await UserModel.findById(userId);
        return userInfo._id;
    };


}

module.exports = User;