let currentContentPageID = '';
let userJWT = null;
let user_id = null;
let user_name = null;
let user_acknowledgement = null;
let apiPath = '/api';

/**
 * Swaps visible content. It receives an ID to show and hides everything with the class  main-content-block
 * @param  {[type]} newID [description]
 * @return {[type]}       [description]
 */
function swapContent(newID) {
    $('.main-content-block').addClass('hidden-main-content-block');
    $('#' + newID).removeClass('hidden-main-content-block');
    currentContentPageID = newID;
}

$(function() {
    if (Cookies.get('username') !== undefined) {
        $('.user-name-reference').html(Cookies.get('username'));
    }

    //events
    $('.content-changer').click(function(event) {
        $('.content-changer').removeClass('active');
        $(this).addClass('active');
        event.preventDefault();
        let newID = $(this).data('view-id');
        if (newID != undefined && newID != '') {
            swapContent(newID);
        }
    });

    userJWT = Cookies.get('user-jwt-esn');
    //user is not logged in
    if (userJWT == null || userJWT == undefined || userJWT == '') {
        console.log('no token found ... user is not logged in');
        if (window.location.pathname != '/') {
            window.location.replace('/');
        }
    }
    //user is logged in
    else {
        //TODO test if cookie is expired
        user_id = Cookies.get('user-id');
        user_name = Cookies.get('username');
        user_acknowledgement = Cookies.get('user-acknowledgement');
        if (window.location.pathname == '/') {
            if (user_acknowledgement === 'true') {
                window.location.replace('/app');
            } else {
                swapContent('acknowledgement-page-content');
            }
        }
        console.log('found cookie = ' + userJWT);
    }
});

/**
 * Updates de status online of the user
 * @param status
 */
function setOnline(online_status, socketId) {
    let user_id = Cookies.get('user-id');
    let jwt = Cookies.get('user-jwt-esn');
    let acknowledgement = Cookies.get('user-acknowledgement');
    let status = Cookies.get('user-status');

    $.ajax({
        url: apiPath + '/users/' + user_id,
        type: 'put',
        data: {
            onLine: online_status,
            acknowledgement: acknowledgement,
            status: status
        },
        headers: {
            Authorization: jwt
        }
    })
        .done(function(response) {
            Cookies.set('online-status', online_status);
            console.log(response);
        })
        .fail(function(e) {
            $('#signup-error-alert').html(e);
            $('#signup-error-alert').show();
        })
        .always(function() {
            console.log('complete');
        });
}

/**
 * Syncs socket ids to the users data in the backend. It can delete old socket connections and it can create new ones.
 * @param status
 */
function syncSocketId(socketId, deleteSocket) {
    let user_id = Cookies.get('user-id');
    let jwt = Cookies.get('user-jwt-esn');
    let url = apiPath + '/users/' + user_id + "/socket";
    let method = "post";
    let data = {
        "socketId": socketId
    }

    //delete scenario
    if(deleteSocket){
        url = apiPath + '/users/' + user_id + "/socket/" + socketId;
        method = "delete";
        data  = {};
    }

    $.ajax({
        url: url,
        type: method,
        data: data,
        headers: {
            Authorization: jwt
        }
    })
    .done(function(response) {
    })
    .fail(function(e) {
        $('#signup-error-alert').html(e);
        $('#signup-error-alert').show();
    })
    .always(function() {
        console.log('complete');
    });
}
