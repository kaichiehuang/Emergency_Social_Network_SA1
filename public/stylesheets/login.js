/**
 *  group class Users list      ---->  user-list-components
 *  group class Public chat     ---->  public-chat-components
 *  group class Private chat    ---->  private-chat-components
 *  group class Announcements   ---->  announcements-components
 *
 *
 */
let currentContentPageID = '';
let oldContentPageID = '';
let currentContentGroupClass = '';
let userJWT = null;
let user_id = null;
let user_acknowledgement = null;
const apiPath = '/api';
let currentUser = null;
let selectedStatus = null;
let socket = null;
/**
 * On load init
 * @param  {[type]} ) {               if (Cookies.get('username') ! [description]
 * @return {[type]}   [description]
 */
$(function() {
    if (Cookies.get('username') !== undefined) {
        $('.user-name-reference').html(Cookies.get('username'));
    }
    socket = io('/');
    // initialize current user
    currentUser = new User();
    currentUser._id = Cookies.get('user-id');
    // init events for content change
    menuContentChangerEvent();
    globalContentChangerEvent();
    showElementEvent();
    hideElementEvent();
    // init JWT token
    userJWT = Cookies.get('user-jwt-esn');
    // user is not logged in
    if (userJWT == null || userJWT == undefined || userJWT == '') {
        if (window.location.pathname !== '/') {
            window.location.replace('/');
        }
    }
    // user is logged in
    else {
        // TODO test if cookie is expired
        user_id = Cookies.get('user-id');
        user_name = Cookies.get('username');
        user_acknowledgement = Cookies.get('user-acknowledgement');
        if (window.location.pathname == '/') {
            if (user_acknowledgement === 'true') {
                window.location.replace('/app');
            } else {
                swapViewContent('acknowledgement-page-content', 'main-content-block');
            }
        }
        User.getInstance().initCurrentUser();
        $('.hideadble-menu-item a').click(function(event) {
            $('.menu-less').parent().addClass('hidden');
            $('.menu-more').parent().removeClass('hidden');
            $('.hideadble-menu-item').removeClass('active-hideadble-menu-item').addClass('hidden');
            $(this).parent().addClass('active-hideadble-menu-item').removeClass('hidden');
        });
        $('.menu-more').click(function(event) {
            $('.menu-more').parent().addClass('hidden');
            $('.menu-less').parent().removeClass('hidden');
            $('.hideadble-menu-item:not(.active-hideadble-menu-item)').removeClass('hidden');
        });
        $('.menu-less').click(function(event) {
            $('.menu-less').parent().addClass('hidden');
            $('.menu-more').parent().removeClass('hidden');
            $('.hideadble-menu-item:not(.active-hideadble-menu-item)').addClass('hidden');
        });
    }
});


/**
 * Event registration for menu content changer buttons
 * @return {[type]} [description]
 */
function menuContentChangerEvent() {
    $('.menu-content-changer').click(function(event) {
        $('.menu-content-changer').removeClass('active');
        $('#status-button').removeClass('active');
        $(this).addClass('active');
        event.preventDefault();
        executeSwapContent($(this));
    });
}

/**
 * Event registration for content changer buttons that dont
 * @return {[type]} [description]
 */
function globalContentChangerEvent() {
    $('.content-changer').click(function(event) {
        executeSwapContent($(this));
    });
}

/**
 * Swaps content following id to display of group class to display and classes to hide
 * @param  {[type]} element [description]
 * @return {[type]}         [description]
 */
function executeSwapContent(element) {
    const viewID = element.data('view-id');
    const subViewID = element.data('sub-view-id');
    const groupClass = element.data('view-group-class');
    let hideViewClass = element.data('hide-view-class');
    let hideSubViewClass = element.data('sub-view-hide-class');
    let hideGroupClass = element.data('group-hide-class');
    if (hideViewClass == undefined) {
        hideViewClass = 'main-content-block';
    }
    if (hideSubViewClass == undefined) {
        hideSubViewClass = 'hideable-group-component';
    }
    if (hideGroupClass == undefined) {
        hideGroupClass = 'hideable-group-component';
    }
    if (viewID != undefined && viewID != '') {
        swapViewContent(viewID, hideViewClass);
    }
    if (subViewID != undefined && subViewID != '') {
        swapViewContent(subViewID, hideSubViewClass);
    }
    if (groupClass != undefined && groupClass != '') {
        swapGroupContent(groupClass, hideGroupClass);
    }
}

/**
 * [showElementEvent description]
 * @return {[type]} [description]
 */
function showElementEvent() {
    $('.visible-controller').change(function(e) {
        const idToDisplay = $(this).data('id-to-display');
        const classToDisplay = $(this).data('class-to-display');
        showElements(idToDisplay, classToDisplay);
    });
    $('.visible-controller').click(function(e) {
        const idToDisplay = $(this).data('id-to-display');
        const classToDisplay = $(this).data('class-to-display');
        showElements(idToDisplay, classToDisplay);
    });
}

/**
 * [showElementEvent description]
 * @return {[type]} [description]
 */
function hideElementEvent() {
    $('.hide-controller').change(function(e) {
        const idToHide = $(this).data('id-to-hide');
        const classToHide = $(this).data('class-to-hide');
        hideElements(idToHide, classToHide);
    });
    $('.hide-controller').click(function(e) {
        const idToHide = $(this).data('id-to-hide');
        const classToHide = $(this).data('class-to-hide');
        hideElements(idToHide, classToHide);
    });
}

/**
 * hide and show actions
 */
/**
 * Swaps visible content. It receives an ID to show and hides everything with the class  main-content-block
 * @param  {[type]} viewID [description]
 * @return {[type]}       [description]
 */
function swapViewContent(viewID, classToHide) {
    if (classToHide == undefined) {
        classToHide = 'main-content-block';
    }
    $('.' + classToHide).addClass('hidden');
    $('#' + viewID).removeClass('hidden');
    $('.' + classToHide).addClass('hidden-main-content-block');
    $('#' + viewID).removeClass('hidden-main-content-block');
    oldContentPageID = currentContentPageID;
    currentContentPageID = viewID;
}

/**
 * [swapGroupContent description]
 * @param  {[type]} newGroupClass [description]
 * @return {[type]}               [description]
 */
function swapGroupContent(newGroupClass, classToHide) {
    $('.' + classToHide).addClass('hidden');
    $('.' + newGroupClass).removeClass('hidden');
    currentContentGroupClass = newGroupClass;
}
/**
 * Shows elements with a matching class or ID
 * @param  {[type]} idToDisplay    [description]
 * @param  {[type]} classToDisplay [description]
 * @return {[type]}                [description]
 */
function showElements(idToDisplay, classToDisplay) {
    if ($('#' + idToDisplay).length > 0) {
        $('#' + idToDisplay).removeClass('hidden');
    }
    if ($('.' + classToDisplay).length > 0) {
        $('.' + classToDisplay).removeClass('hidden');
    }
}
/**
 * Hides elements with a matching class or ID
 * @param  {[type]} idToHide    [description]
 * @param  {[type]} classToHide [description]
 * @return {[type]}             [description]
 */
function hideElements(idToHide, classToHide) {
    if ($('#' + idToHide).length > 0) {
        $('#' + idToHide).addClass('hidden');
    }
    if ($('.' + classToHide).length > 0) {
        $('.' + classToHide).addClass('hidden');
    }
}

// eslint-disable-next-line no-unused-vars
class GlobalEventDispatcher {
    /**
     * Call the API to notify that every user device should update the user list
     * @return {[type]} [description]
     */
    static updateAllUserLists() {
        APIHandler.getInstance().sendRequest('/usersList/', 'get', {}, true, null)
        .then( (res) => {})
        .catch( (err) => {});
    }
}
/**
 * Class that manages all API Requests
 */
class APIHandler {
    /**
     * Sends requests to API for every component or object using Jquery
     * @param  {[type]} url         [description]
     * @param  {[type]} operation   [description]
     * @param  {[type]} data        [description]
     * @param  {[type]} token       [description]
     * @param  {[type]} contentType [description]
     * @return {[type]}             [description]
     */
    sendRequest(url, operation, data, token, contentType) {
        $('#boxloader').show();
        const jwt = Cookies.get('user-jwt-esn');
        const contentTypeOption = contentType ?
            contentType : 'application/x-www-form-urlencoded; charset=UTF-8';
        const headers = token ? {
            Authorization: jwt
        } : {};
        const dataSend = data ? data : {};
        const options = {
            url: apiPath + url,
            type: operation,
            data: dataSend,
            headers: headers,
            contentType: contentTypeOption
        };

        return new Promise((resolve, reject) => {
            $.ajax(options)
                .done(function(response) {
                    resolve(response);
                })
                .fail(function(e) {
                    if (e.responseText === 'jwt expired' || e.responseText === 'invalid algorithm' || e.responseText === 'invalid token' ||
                        e.responseText === 'jwt malformed' || e.responseText === 'Too many requests from this IP') {
                        SignoutComponent.getInstance().removeCookies();
                        SignoutComponent.getInstance().signout();
                        return reject(false);
                    } else {
                        return reject(e);
                    }
                })
                .always(function() {
                    $('#boxloader').hide();
                });
        });
    }

    /**
     * Singleton instance element
     * @return {[type]} [description]
     */
    static getInstance() {
        if (this.instance == null) {
            this.instance = new APIHandler();
        }
        return this.instance;
    }
}

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
                    }, 30000 * 6);
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
        }, 60000 * 20);
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
        let data = {
            'socketId': socketId
        };
        // delete scenario
        if (deleteSocket) {
            url = '/users/' + user_id + '/sockets/' + socketId;
            method = 'delete';
            data = {};
        }

        APIHandler.getInstance()
            .sendRequest(url, method,
                JSON.stringify(data), true, 'application/json')
            .then((response) => {})
            .catch((error) => {});
    }

}

$(function() {
    /**
     * [postMessage description]
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    function signup() {
        const name = $('#name').val();
        const last_name = $('#last_name').val();
        let username = $('#username').val();
        const password = $('#password').val();


        const data = {
            'name': name,
            'last_name': last_name,
            'username': username,
            'password': password
        };

        APIHandler.getInstance()
            .sendRequest('/users/', 'post', data,
                false, null).then((response) => {
                if (response.user != undefined &&
                    response.tokens != undefined) {
                    user_id = response.user.userId;
                    username = response.user.username;
                    userJWT = response.tokens.token;
                    user_acknowledgement = response.user.acknowledgement;
                    user_status = response.user.status;
                    // set token in cookies since it is more secure
                    Cookies.set('user-jwt-esn', userJWT);
                    Cookies.set('user-jwt-refresh-esn',
                        response.tokens.ex_token);
                    Cookies.set('user-id', user_id);
                    Cookies.set('username', username);
                    Cookies.set('user-acknowledgement', user_acknowledgement);
                    Cookies.set('user-status', user_status);
                    Cookies.set('online-status', response.user.onLine);

                    $('.user-name-placeholder').html(username);
                    if (user_acknowledgement) {
                        User.getInstance().setOnline(true);
                        GlobalEventDispatcher.updateAllUserLists();
                        window.location.replace('/app');
                    } else {
                        swapViewContent('acknowledgement-page-content',
                            'main-content-block');
                    }
                }
                $('#signup-error-alert').hide();
            })
            .catch((error) => {
                $('#signup-error-alert').html(error.responseJSON.msg);
                $('#signup-error-alert').show();
            });
    }

    /**
     * [submitAcknowledgment description]
     * @return {[type]} [description]
     */
    function submitAcknowledgment() {
        if ($('#signup-acknowledgement').is(':checked')) {
            const user_id = Cookies.get('user-id');
            // //validations
            $.ajax({
                url: apiPath + '/users/' + user_id,
                type: 'put',
                data: {
                    'acknowledgement': true,
                    'status': 'UNDEFINED',
                    'onLine': true
                },
                headers: {'Authorization': userJWT}
            }).done(function(response) {
                user_acknowledgement = response.acknowledgement;
                Cookies.set('user-acknowledgement', user_acknowledgement);
                User.getInstance().setOnline(true);
                GlobalEventDispatcher.updateAllUserLists();
                window.location.replace('/app');
            }).fail(function() {
                $('#signup-error-alert').html();
                $('#signup-error-alert').show();
            }).always(function() {});
        }
    }


    /** **** events declaration ********/

    $('#signup-submit-button').click(function(e) {
        e.preventDefault();
        signup();
    });
    $('#acknowledgement-submit-button').click(function(e) {
        e.preventDefault();
        submitAcknowledgment();
    });
});

