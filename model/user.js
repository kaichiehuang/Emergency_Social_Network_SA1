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