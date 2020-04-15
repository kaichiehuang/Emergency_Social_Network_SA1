class User {
    constructor() {
        this._id = null;
        this.username = null;
        this.password = null;
        this.name = null;
        this.last_name = null;
        this.acknowledgement = false;
        this.onLine = false;
        this.status = null;
        this.emergency_contact = {};
        this.medical_information = {};
    }
    /**
     * [getUserData description]
     * @param  {[type]} userId [description]
     * @return {[type]}        [description]
     */
    static getUser(userId) {
        return new Promise((resolve, reject) => {
            if (userId != null) {
                let jwt = Cookies.get('user-jwt-esn');
                $.ajax({
                    url: apiPath + '/users/' + userId,
                    type: 'get',
                    headers: {
                        "Authorization": jwt
                    }
                }).done(function(response) {
                    resolve(response);
                }).fail(function(e) {
                    reject(e.message)
                }).always(function() {
                    console.log("complete");
                });
            } else {
                reject();
            }
        });
    }
    /**
     * Returns a list of users from the API
     * @return {[type]} [description]
     */
    static getPersonalMessage(userId, security_question_answer) {
        let data = {
            "security_question_answer": security_question_answer,
        };
        return new Promise((resolve, reject) => {
            let jwt = Cookies.get('user-jwt-esn');
            $.ajax({
                "url": apiPath + '/users/' + userId + "/personal-message",
                "type": 'get',
                "headers": {
                    "Authorization": jwt
                },
                "data": data
            }).done(function(response) {
                resolve(response);
            }).fail(function(e) {
                reject(e.responseText)
            }).always(function() {
                console.log("complete");
            });
        });
    }
    /**
     * Returns a list of users from the API
     * @return {[type]} [description]
     */
    static getUsers(keyword, status) {
        let data = {
            "username": keyword,
            "status": status
        };
        return new Promise((resolve, reject) => {
            let jwt = Cookies.get('user-jwt-esn');
            $.ajax({
                "url": apiPath + '/users',
                "type": 'get',
                "headers": {
                    "Authorization": jwt
                },
                "data": data
            }).done(function(response) {
                resolve(response);
            }).fail(function(e) {
                reject(e.message)
            }).always(function() {
                console.log("complete");
            });
        });
    }
    /**
     * Returns a list of users from the API
     * @return {[type]} [description]
     */
    static updateUser(userId, data) {
        return new Promise((resolve, reject) => {
            let jwt = Cookies.get('user-jwt-esn');
            $.ajax({
                "url": apiPath + '/users/' + userId,
                "type": 'put',
                "headers": {
                    "Authorization": jwt
                },
                "data": JSON.stringify(data),
                'contentType': "application/json",
            }).done(function(response) {
                resolve(response);
            }).fail(function(e) {
                if (e.responseJSON != undefined) {
                    reject(e.responseJSON.msg)
                } else {
                    reject(e)
                }
            }).always(function() {
                console.log("complete");
            });
        });
    }

    /**
     * [initCurrentUser description]
     * @return {[type]} [description]
     */
    static updateCurrentUser(){
        User.getCurrentUser()
        .then(user => {
            currentUser = user;
        }).catch(err => {

        });
    }
    /**
     * [initCurrentUser description]
     * @return {[type]} [description]
     */
    static initCurrentUser(){
        User.getCurrentUser()
        .then(user => {
            currentUser = user;
            if(currentUser.name == undefined || currentUser.name.length == 0 ){
                showElements("profile-update-invite");
                User.initUpdateInvite();
            }
        }).catch(err => {

        });
    }

    /**
     * [initCurrentUser description]
     * @return {[type]} [description]
     */
    static getCurrentUser() {
        return new Promise((resolve, reject) => {
            //init current user
            User.getUser(Cookies.get('user-id')).then(user => {
                resolve(user);
            }).catch(err => {
                reject(err);
            });
        });
    }
    /**
     * [initUpdateInvite description]
     * @return {[type]} [description]
     */
    static initUpdateInvite() {
        window.setInterval(function() {
            showElements("profile-update-invite");
        }, 60000 * 5);
    }
}