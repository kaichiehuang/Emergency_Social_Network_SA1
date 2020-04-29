// eslint-disable-next-line no-unused-vars
/**
 * User class, makes requests to api
 */
class User {
    /**
     * Singleton instance element
     * @return {[type]} [description]
     */
    static getInstance() {
        if (this.instance === undefined) {
            this.instance = new User();
        }
        return this.instance;
    }

    /**
     * [getUserData description]
     * @param  {[type]} userId [description]
     * @return {[type]}        [description]
     */
     async getUser(userId) {
        return await new Promise((resolve, reject) => {
            if (userId != null) {
                APIHandler.getInstance()
                    .sendRequest('/users/' + userId, 'get',
                        null, true, null)
                    .then((response) => {
                        resolve(response);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            } else {
                // eslint-disable-next-line prefer-promise-reject-errors
                reject("ERROR");
            }
        });
    }

    /**
     * Returns a list of users from the API
     * @return {[type]} [description]
     */
     async getPersonalMessage(userId, security_question_answer) {
        const data = {
            'security_question_answer': security_question_answer,
        };
        return await new Promise((resolve, reject) => {
            APIHandler.getInstance()
                .sendRequest('/users/' + userId + '/personal-message', 'get',
                    data, true, null)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error.responseJSON.msg);
                });
        });
    }

    /**
     * Returns a list of users from the API
     * @return {[type]} [description]
     */
     async getUsers(keyword, status) {
        const data = {
            'username': keyword,
            'status': status
        };
        return await new Promise((resolve, reject) => {
            APIHandler.getInstance()
                .sendRequest('/users', 'get', data,
                    true, null)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    /**
     * Update user information
     * @return {[type]} [description]
     */
     async updateUser(userId, data) {
        return await new Promise((resolve, reject) => {
            APIHandler.getInstance()
                .sendRequest('/users/' + userId, 'put',
                    JSON.stringify(data), true, 'application/json')
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    if (error.responseJSON != undefined) {
                        reject(error.responseJSON.msg);
                    } else {
                        reject(error);
                    }
                });
        });
    }

    /**
     * [initCurrentUser description]
     * @return {[type]} [description]
     */
     updateCurrentUser() {
        User.getInstance().getCurrentUser()
            .then((user) => {
                currentUser = user;
            }).catch((err) => {

            });
    }

    /**
     * [initCurrentUser description]
     * @return {[type]} [description]
     */
     initCurrentUser() {
        User.getInstance().getCurrentUser()
            .then((user) => {
                currentUser = user;
                if (currentUser.name === undefined ||
                    currentUser.name.length === 0) {
                    setTimeout(function(){
                        showElements('profile-update-invite')
                    }, 30000 * 12);
                    User.getInstance().initUpdateInvite();
                }
            }).catch((err) => {

            });
    }

    /**
     * [initCurrentUser description]
     * @return {[type]} [description]
     */
     async getCurrentUser() {
        return await new Promise((resolve, reject) => {
            // init current user
            User.getInstance().getUser(Cookies.get('user-id'))
                .then((user) => {
                    resolve(user);
                }).catch((err) => {
                    reject(err);
                });
        });
    }

    /**
     * [initUpdateInvite description]
     * @return {[type]} [description]
     */
     initUpdateInvite() {
        window.setInterval(function() {
            showElements('profile-update-invite');
        }, 30000 * 24);
    }


    /**
     * Updates de status online of the user
     * @param status
     */
    setOnline(online_status, socketId) {
        const userId = Cookies.get('user-id');
        const data = {
            onLine: online_status,
            acknowledgement: Cookies.get('user-acknowledgement'),
            status: Cookies.get('user-status')
        }
        APIHandler.getInstance()
            .sendRequest('/users/' + userId, 'put',
                JSON.stringify(data), true, 'application/json')
            .then((response) => {
                Cookies.set('online-status', online_status);
            })
            .catch((error) => {});
    }

    /**
     * Syncs socket ids to the users data in the backend. It can delete old socket connections and it can create new ones.
     * @param status
     */
    syncSocketId(socketId, deleteSocket) {
        const user_id = Cookies.get('user-id');
        const jwt = Cookies.get('user-jwt-esn');
        let url = '/users/' + user_id + '/sockets';
        let method = 'post';
        let timeout = 0;
        let data = {
            'socketId': socketId
        };
        // delete scenario
        if (deleteSocket) {
            url = '/users/' + user_id + '/sockets/' + socketId;
            method = 'delete';
            data = {};
            timeout = 1900;
        }
        setTimeout(function(){
            APIHandler.getInstance()
                .sendRequest(url, method,
                    JSON.stringify(data), true, 'application/json')
                .then((response) => {})
                .catch((error) => {});
            }, timeout);

    }

}
