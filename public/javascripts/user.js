// eslint-disable-next-line no-unused-vars
class User {
    constructor() {
    }

    /**
     * [getUserData description]
     * @param  {[type]} userId [description]
     * @return {[type]}        [description]
     */
    static async getUser(userId) {
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
    static async getPersonalMessage(userId, security_question_answer) {
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
                    reject(error.responseText);
                });
        });
    }

    /**
     * Returns a list of users from the API
     * @return {[type]} [description]
     */
    static async getUsers(keyword, status) {
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
    static async updateUser(userId, data) {
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
    static updateCurrentUser() {
        User.getCurrentUser()
            .then((user) => {
                currentUser = user;
            }).catch((err) => {

            });
    }

    /**
     * [initCurrentUser description]
     * @return {[type]} [description]
     */
    static initCurrentUser() {
        User.getCurrentUser()
            .then((user) => {
                const currentUser = user;
                if (currentUser.name === undefined ||
                    currentUser.name.length === 0) {
                    showElements('profile-update-invite');
                    User.initUpdateInvite();
                }
            }).catch((err) => {

            });
    }

    /**
     * [initCurrentUser description]
     * @return {[type]} [description]
     */
    static async getCurrentUser() {
        return await new Promise((resolve, reject) => {
            // init current user
            User.getUser(Cookies.get('user-id'))
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
    static initUpdateInvite() {
        window.setInterval(function() {
            showElements('profile-update-invite');
        }, 60000 * 5);
    }
}
