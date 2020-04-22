// eslint-disable-next-line no-unused-vars
class User {
    static instance;
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
                        reject(error.message);
                    });
            } else {
                // eslint-disable-next-line prefer-promise-reject-errors
                reject();
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
                    reject(error.message);
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
                    showElements('profile-update-invite');
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
        }, 60000 * 5);
    }
}
