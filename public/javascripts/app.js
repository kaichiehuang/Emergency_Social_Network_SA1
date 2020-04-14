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
let user_name = null;
let user_acknowledgement = null;
let apiPath = '/api';
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
    //initialize current user
    currentUser = new User();
    currentUser._id = Cookies.get('user-id');
    //init events for content change
    menuContentChangerEvent();
    globalContentChangerEvent();
    showElementEvent();
    hideElementEvent();
    //init JWT token
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
                swapViewContent('acknowledgement-page-content', 'main-content-block');
            }
        }
        User.initCurrentUser();
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
    }).done(function(response) {
        Cookies.set('online-status', online_status);
        console.log(response);
    }).fail(function(e) {
        $('#signup-error-alert').html(e);
        $('#signup-error-alert').show();
    }).always(function() {
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
    if (deleteSocket) {
        url = apiPath + '/users/' + user_id + "/socket/" + socketId;
        method = "delete";
        data = {};
    }
    $.ajax({
        url: url,
        type: method,
        data: data,
        headers: {
            Authorization: jwt
        }
    }).done(function(response) {}).fail(function(e) {
        $('#signup-error-alert').html(e);
        $('#signup-error-alert').show();
    }).always(function() {
        console.log('complete');
    });
}
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
    let viewID = element.data('view-id');
    let subViewID = element.data('sub-view-id');
    let groupClass = element.data('view-group-class');
    let hideViewClass = element.data('hide-view-class');
    let hideSubViewClass = element.data('sub-view-hide-class');
    let hideGroupClass = element.data('group-hide-class');
    if (viewID != undefined && viewID != '') {
        if (hideViewClass == undefined) {
            hideViewClass = 'main-content-block';
        }
        swapViewContent(viewID, hideViewClass);
    }
    if (subViewID != undefined && subViewID != '') {
        if (hideSubViewClass == undefined) {
            hideSubViewClass = 'hideable-group-component';
        }
        swapViewContent(subViewID, hideSubViewClass);
    }
    if (groupClass != undefined && groupClass != '') {
        if (hideGroupClass == undefined) {
            hideGroupClass = 'hideable-group-component';
        }
        swapGroupContent(groupClass, hideGroupClass);
    }
}
/**
 * [showElementEvent description]
 * @return {[type]} [description]
 */
function showElementEvent() {
    $(".visible-controller").change(function(e) {
        let idToDisplay = $(this).data('id-to-display');
        let classToDisplay = $(this).data('class-to-display');
        showElements(idToDisplay, classToDisplay);
    });
    $(".visible-controller").click(function(e) {
        let idToDisplay = $(this).data('id-to-display');
        let classToDisplay = $(this).data('class-to-display');
        showElements(idToDisplay, classToDisplay);
    });
}
/**
 * [showElementEvent description]
 * @return {[type]} [description]
 */
function hideElementEvent() {
    $(".hide-controller").change(function(e) {
        let idToHide = $(this).data('id-to-hide');
        let classToHide = $(this).data('class-to-hide');
        hideElements(idToHide, classToHide);
    });
    $(".hide-controller").click(function(e) {
        let idToHide = $(this).data('id-to-hide');
        let classToHide = $(this).data('class-to-hide');
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
    $("." + classToHide).addClass('hidden');
    $('#' + viewID).removeClass('hidden');
    oldContentPageID = currentContentPageID;
    currentContentPageID = viewID;
}
/**
 * [swapGroupContent description]
 * @param  {[type]} newGroupClass [description]
 * @return {[type]}               [description]
 */
function swapGroupContent(newGroupClass, classToHide) {
    $("." + classToHide).addClass('hidden');
    $('.' + newGroupClass).removeClass('hidden');
    currentContentGroupClass = newGroupClass;
}

function showElements(idToDisplay, classToDisplay) {
    if ($("#" + idToDisplay).length > 0) {
        $("#" + idToDisplay).removeClass('hidden');
    }
    if ($("." + classToDisplay).length > 0) {
        $("." + classToDisplay).removeClass('hidden');
    }
}

function hideElements(idToHide, classToHide) {
    if ($("#" + idToHide).length > 0) {
        $("#" + idToHide).addClass('hidden');
    }
    if ($("." + classToHide).length > 0) {
        $("." + classToHide).addClass('hidden');
    }
}