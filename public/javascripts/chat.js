var public_wall_container = document.getElementById('public-msg_area');
var private_wall_container = document.getElementById('private-msg_area');

$(function() {
    const socket = io('http://localhost:3000');
    let socketSynced = false;

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
    getMessages('public');

    // listen for private chat events
    socket.on('new-private-chat-message', data => {
        drawPrivateMessageItem(data);
        private_wall_container.scrollTop = private_wall_container.scrollHeight;
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

    //capture event to load messages
    $('.content-changer').click(function(event) {
        event.preventDefault();
        let newID = $(this).data('view-id');
        if (newID === 'public-chat-content') {
            public_wall_container.scrollTop =
                public_wall_container.scrollHeight;
        }
    });
});

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
    let child_new = child
        .replace('%username_token%', data.user_id.username)
        .replace(
            '%timestamp_token%',
            new Date(data.created_at).toLocaleString()
        )
        .replace('%message_token%', data.message);
    new_li.html(child_new);
    $('#' + type + '-chat').append(new_li);
}

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
    let child_new = child
        .replace('%username_token%', data.sender_user_id.username)
        .replace(
            '%timestamp_token%',
            new Date(data.created_at).toLocaleString()
        )
        .replace('%message_token%', data.message);
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
    if (type === 'private') {
        url = apiPath + '/private-chat-messages';
        message_content = '#private-send-message-content';
        data = {
            message: $(message_content).val(),
            sender_user_id: user_id,
            receiver_user_id: Cookies.get('receiver_user_id')
        }
    }
    $.ajax({
        url: url,
        type: 'post',
        data: data,
        headers: {
            Authorization: jwt
        }
    })
        .done(function(response) {
            $(message_content).val('');
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
 * Get all the messages prevoisly posted
 * (messages saved on the db)
 */
function getMessages(type) {
    let jwt = Cookies.get('user-jwt-esn');
    let url = apiPath + '/chat-messages';
    let data = {};
    if (type === 'private') {
        url = apiPath + '/private-chat-messages';
        data = {
            "sender_user_id": Cookies.get('user-id'),
            "receiver_user_id": Cookies.get('receiver_user_id')
        };
    }
    $.ajax({
        url: url,
        type: 'get',
        headers: {
            Authorization: jwt
        },
        data: data
    })
    .done(function(response) {
        //console.log(response);
        response.forEach(element => {
            if (type === 'private') {
                //
                drawPrivateMessageItem(element);
            } else if (type === 'public') {
                drawMessageItem(element);
            }
        });
        if (type === 'private') {
            private_wall_container.scrollTop =
                private_wall_container.scrollHeight;
        } else if (type === 'public'){
            public_wall_container.scrollTop =
                public_wall_container.scrollHeight;
        }
    })
    .fail(function(e) {
        $('#signup-error-alert').html(e);
        $('#signup-error-alert').show();
    })
    .always(function() {
        console.log('complete');
    });
}

function initiatePrivateChat(receiver_user_id) {
    Cookies.set('receiver_user_id', receiver_user_id);
    $("#private-chat .user-post").each(function(index, el) {
        if ($(this).attr("id") != "private-template") {
            $(this).remove();
        }
    });
    getMessages('private');
}
