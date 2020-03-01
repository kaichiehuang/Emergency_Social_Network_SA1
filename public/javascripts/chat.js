var public_wall_container = document.getElementById('public-msg_area');
$(function() {
    const socket = io('http://localhost:3000');
    socket.on("new-chat-message", data => {
        drawMessageItem(data);
        public_wall_container.scrollTop = public_wall_container.scrollHeight;
    });
    //
    //setOnline(true);
    //TODO UI of the messsages previously sended with the information returned in the next method
    getMessages();
    $(window).on('unload', function() {
        setOnline(false);
    });
    /****** events declaration ********/
    $('#public-send-btn').click(function(e) {
        sendMessage();
    });
    $("#public-msg-form").on("submit", function(e) {
        e.preventDefault();
        sendMessage();
    });

    //capture event to load messages
    $(".content-changer").click(function(event) {
        event.preventDefault();
        let newID = $(this).data('view-id');
        if (newID === "public-chat-content") {
            public_wall_container.scrollTop = public_wall_container.scrollHeight;
        }
    });
});

function drawMessageItem(data) {
    let list_length = $('ul#public-chat li').length;
    let new_li = $('ul#public-chat li#public-template').clone();
    let class_ori = new_li.attr("class");
    class_ori = class_ori.replace(' hide', '');
    if (list_length % 2 == 1) {
        new_li.attr("class", class_ori + ' user-post-odd');
    } else {
        new_li.attr("class", class_ori + ' user-post-even');
    }
    let user_id = Cookies.get('user-id');
    if (user_id === data.user_id._id) {
        new_li.attr("class", new_li.attr("class") + ' user-post-current');
    }
    new_li.removeAttr('id');
    let child = new_li.html();
    let child_new = child.replace('%username_token%', data.user_id.username).replace('%timestamp_token%', new Date(data.created_at).toLocaleString()).replace('%message_token%', data.message);
    new_li.html(child_new);
    $('#public-chat').append(new_li);
}

/**
 * Sends and saves the message the user post.
 */
function sendMessage() {
    let user_id = Cookies.get('user-id');
    let jwt = Cookies.get('user-jwt-esn');
    $.ajax({
        url: apiPath + '/chat-messages',
        type: 'post',
        data: {
            'message': $("#public-send-message-content").val(),
            "user_id": user_id
        },
        headers: {
            "Authorization": jwt
        }
    }).done(function(response) {
        $("#public-send-message-content").val("");
        console.log(response);
    }).fail(function(e) {
        $("#signup-error-alert").html(e);
        $("#signup-error-alert").show();
        alert(e);
    }).always(function() {
        console.log("complete");
    });
}
/**
 * Get all the messages prevoisly posted
 * (messages saved on the db)
 */
function getMessages() {
    let jwt = Cookies.get('user-jwt-esn');
    $.ajax({
        url: apiPath + '/chat-messages',
        type: 'get',
        headers: {
            "Authorization": jwt
        }
    }).done(function(response) {
        //console.log(response);
        response.forEach(element => {
            drawMessageItem(element);
        });
        public_wall_container.scrollTop = public_wall_container.scrollHeight;
    }).fail(function(e) {
        $("#signup-error-alert").html(e);
        $("#signup-error-alert").show();
        alert(e);
    }).always(function() {
        console.log("complete");
    });
}