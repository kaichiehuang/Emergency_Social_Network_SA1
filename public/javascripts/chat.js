//************************************************
//************************************************
var public_wall_container = document.getElementById('public-msg_area');
var private_wall_container = document.getElementById('private-msg_area');
var announcements_container = document.getElementById('announcement-msg_area');
$(function() {
    //socket for chat messages management
    const socket = io("");
    let socketSynced = false;
    /**
     * [description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    socket.on('connect', data => {
        let oldSocketId = Cookies.get('user-socket-id');
        // delete old socket from db
        if (oldSocketId != undefined && oldSocketId != '') {
            if (oldSocketId !== socket.id) {
                syncSocketId(oldSocketId, true);
            }
        }
        // register new socket in db
        syncSocketId(socket.id, false);
        //store new socket on cookie for future reference
        Cookies.set('user-socket-id', socket.id);
    });

    // listen for public chat events
    socket.on('new-chat-message', data => {
        drawMessageItem(data);
        public_wall_container.scrollTop = public_wall_container.scrollHeight;
    });

    // listen for public chat events
    socket.on('new-announcement', data => {
        alert(data);
        drawLastAnnouncement(data);
        getMessages('announcement');
        announcements_container.scrollTop = announcements_container.scrollHeight;
    });

    //init public chat messages and announcements
    getMessages('public');


    // listen for private chat events
    socket.on('new-private-chat-message', data => {
        // only draw elements received from the user I am speaking with
        if (data.sender_user_id._id == Cookies.get('receiver_user_id') || data.sender_user_id._id == Cookies.get('user-id')) {
            drawPrivateMessageItem(data);
            private_wall_container.scrollTop = private_wall_container.scrollHeight;
        } else {
            //refreshes user list to update the unseen messages counter for other
            updateUserListView();
        }
    });
    /**
     * on window unload
     * @param  {[type]} ) {                   let oldSocketId [description]
     * @return {[type]}   [description]
     */
    $(window).on('unload', function() {
        let oldSocketId = Cookies.get('user-socket-id');
        Cookies.set('user-socket-id', "");
        syncSocketId(oldSocketId, true);
        setOnline(false);
    });
    /****** events declaration ********/
    $('#public-send-btn').click(function(e) {
        sendMessage('public');
    });
    $('#public-msg-form').on('submit', function(e) {
        e.preventDefault();
        sendMessage('public');
    });
    $('#private-send-btn').click(function(e) {
        sendMessage('private');
    });
    $('#private-msg-form').on('submit', function(e) {
        e.preventDefault();
        sendMessage('private');
    });
    $('#announcement-send-btn').click(function(e) {
        sendMessage('announcement');
    });
    $('#announcement-msg-form').on('submit', function(e) {
        e.preventDefault();
        sendMessage('announcement');
    });
    //capture event to load messages
    $('.content-changer').click(function(event) {
        event.preventDefault();
        let newID = $(this).data('view-id');
        if (newID === 'public-chat-content') {
            public_wall_container.scrollTop = public_wall_container.scrollHeight;
        }
        if (newID === 'announcement-chat-content') {
            getMessages('announcement');
            announcements_container.scrollTop = announcements_container.scrollHeight;
        }
    });
});

/**
 * [drawMessageItem description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function drawMessageItem(data) {
    let type = 'public';
    let list_length = $('ul#' + type + '-chat li').length;
    let new_li = $('ul#' + type + '-chat li#' + type + '-template').clone();
    let class_ori = new_li.attr('class');
    class_ori = class_ori.replace(' hide', '');
    if (list_length % 2 == 1) {
        new_li.attr('class', class_ori + ' user-post-odd');
    } else {
        new_li.attr('class', class_ori + ' user-post-even');
    }
    let user_id = Cookies.get('user-id');
    if (user_id === data.user_id._id) {
        new_li.attr('class', new_li.attr('class') + ' user-post-current');
    }
    new_li.removeAttr('id');
    let child = new_li.html();
    let indicatorStyle;
    if (data.status === 'OK') {
        indicatorStyle = "statusIndicator background-color-ok";
    } else if (data.status === 'HELP') {
        indicatorStyle = 'statusIndicator background-color-help';
    } else if (data.status === 'EMERGENCY') {
        indicatorStyle = 'statusIndicator background-color-emergency';
    } else if (data.status === 'UNDEFINED') {
        indicatorStyle = 'statusIndicator background-color-undefined';
    }
    let child_new = child.replace('%username_token%', data.user_id.username).replace('%timestamp_token%', new Date(data.created_at).toLocaleString()).replace('%message_token%', data.message).replace("statusIndicator", indicatorStyle);
    //child_new.find('.statusIndicator').className = indicatorStyle;
    new_li.html(child_new);
    $('#' + type + '-chat').append(new_li);
}

function drawAnnouncement(data) {
    let type = 'announcement';
    let list_length = $('ul#' + type + '-chat li').length;
    let new_li = $('ul#' + type + '-chat li#' + type + '-template').clone();
    let class_ori = new_li.attr('class');
    class_ori = class_ori.replace(' hide', '');
    if (list_length % 2 == 1) {
        new_li.attr('class', class_ori + ' user-post-odd');
    } else {
        new_li.attr('class', class_ori + ' user-post-even');
    }
    let user_id = Cookies.get('user-id');
    if (user_id === data.user_id._id) {
        new_li.attr('class', new_li.attr('class') + ' user-post-current');
    }
    new_li.removeAttr('id');
    let child = new_li.html();
    let indicatorStyle;

    let child_new = child.replace('%username_token%', data.user_id.username)
    .replace('%timestamp_token%', new Date(data.created_at).toLocaleString())
    .replace('%message_token%', data.announcement);
    //child_new.find('.statusIndicator').className = indicatorStyle;
    new_li.html(child_new);
    $('#' + type + '-chat').append(new_li);
}
/**
 * [drawPrivateMessageItem description]
 * @param  {[type]} data [description]
 * @return {[type]}      [description]
 */
function drawPrivateMessageItem(data) {
    let type = 'private';
    let list_length = $('ul#' + type + '-chat li').length;
    let new_li = $('ul#' + type + '-chat li#' + type + '-template').clone();
    let class_ori = new_li.attr('class');
    class_ori = class_ori.replace(' hide', '');
    if (list_length % 2 == 1) {
        new_li.attr('class', class_ori + ' user-post-odd');
    } else {
        new_li.attr('class', class_ori + ' user-post-even');
    }
    let user_id = Cookies.get('user-id');
    if (user_id === data.sender_user_id._id) {
        new_li.attr('class', new_li.attr('class') + ' user-post-current');
    }
    new_li.removeAttr('id');
    let child = new_li.html();
    let indicatorStyle;
    if (data.status === 'OK') {
        indicatorStyle = "statusIndicator background-color-ok";
    } else if (data.status === 'HELP') {
        indicatorStyle = 'statusIndicator background-color-help';
    } else if (data.status === 'EMERGENCY') {
        indicatorStyle = 'statusIndicator background-color-emergency';
    } else if (data.status === 'UNDEFINED') {
        indicatorStyle = 'statusIndicator background-color-undefined';
    }
    let child_new = child.replace('%username_token%', data.sender_user_id.username).replace('%timestamp_token%', new Date(data.created_at).toLocaleString()).replace('%message_token%', data.message).replace("statusIndicator", indicatorStyle);
    new_li.html(child_new);
    $('#' + type + '-chat').append(new_li);
}
/**
 * Sends and saves the message the user post.
 */
function sendMessage(type) {
    let user_id = Cookies.get('user-id');
    let jwt = Cookies.get('user-jwt-esn');
    let url = apiPath + '/chat-messages';
    let message_content = '#public-send-message-content';
    let data = {
        message: $(message_content).val(),
        user_id: user_id
    };
    //for private messages
    if (type === 'private') {
        url = apiPath + '/private-chat-messages';
        message_content = '#private-send-message-content';
        data = {
            message: $(message_content).val(),
            sender_user_id: user_id,
            receiver_user_id: Cookies.get('receiver_user_id')
        }
    }
    //for announcements
    if (type === 'announcement') {
        url = apiPath + '/announcements';
        message_content = '#announcement-send-message-content';
        data = {
            message: $(message_content).val(),
            user_id: user_id,
        }
    }
    //ajax calls
    $.ajax({
        url: url,
        type: 'post',
        data: data,
        headers: {
            Authorization: jwt
        }
    }).done(function(response) {
        $(message_content).val('');
        console.log(response);
    }).fail(function(e) {
        $('#signup-error-alert').html(e);
        $('#signup-error-alert').show();
    }).always(function() {
        console.log('complete');
    });
}
/**
 * Get all the messages prevoisly posted
 * (messages saved on the db)
 */
function getMessages(type) {
    let jwt = Cookies.get('user-jwt-esn');
    let url = apiPath + '/chat-messages';
    let data = {};
    //data for private chat
    if (type === 'private') {
        url = apiPath + '/private-chat-messages';
        data = {
            "sender_user_id": Cookies.get('user-id'),
            "receiver_user_id": Cookies.get('receiver_user_id')
        };
    }
    //data for announcements
    if (type === 'announcement') {
        url = apiPath + '/announcements';
        data = {};
    }
    $.ajax({
        url: url,
        type: 'get',
        headers: {
            Authorization: jwt
        },
        data: data
    }).done(function(response) {
        //console.log(response);
        response.forEach(element => {
            if (type === 'private') {
                drawPrivateMessageItem(element);
            } else if (type === 'public') {
                drawMessageItem(element);
            } else if (type === 'announcement') {
                drawAnnouncement(element);
            }
        });
        if (type === 'private') {
            private_wall_container.scrollTop = private_wall_container.scrollHeight;
        } else if (type === 'public') {
            public_wall_container.scrollTop = public_wall_container.scrollHeight;
        }
        else if (type === 'announcement') {
            announcements_container.scrollTop = announcements_container.scrollHeight;
        }
    }).fail(function(e) {
        $('#signup-error-alert').html(e);
        $('#signup-error-alert').show();
    }).always(function() {
        console.log('complete');
    });
}
/**
 * changes the receiver for the private chat
 * @param  {[type]} receiver_user_id [description]
 * @return {[type]}                  [description]
 */
function initiatePrivateChat(receiver_user_id) {
    Cookies.set('receiver_user_id', receiver_user_id);
    $("#private-chat .user-post").each(function(index, el) {
        if ($(this).attr("id") != "private-template") {
            $(this).remove();
        }
    });
    getMessages('private');
}