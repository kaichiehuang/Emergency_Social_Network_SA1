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
        if (userId != null) {
            return new Promise((resolve, reject) => {
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
            });
        }
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
                if(e.responseJSON != undefined){
                    reject(e.responseJSON.msg)
                }else{
                    reject(e)
                }
            }).always(function() {
                console.log("complete");
            });
        });
    }
}
