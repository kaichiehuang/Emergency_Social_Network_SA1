class BaseMessage {
    constructor() {
        this._id = null;
        this.message = "";
        this.user_id = null;
    }
    /**
     * [drawMessageItem description]
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    drawMessageItem(type, data) {
        if(data.user_id == null || data.user_id == undefined){
            return;
        }

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
    /**
     * Sends and saves the message the user post.
     */
    sendMessage(type) {
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
    getMessages(type, limit) {
        let jwt = Cookies.get('user-jwt-esn');
        let url = apiPath + '/chat-messages';
        let data = {};
        let self = this;
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
            data = {
                limit: 0
            };
        }
        $.ajax({
            url: url,
            type: 'get',
            headers: {
                Authorization: jwt
            },
            data: data
        }).done(function(response) {
            let i = 0;
            response.forEach(element => {
                self.drawMessageItem(type, element);
                i++;
            });
        }).fail(function(e) {
            $('#signup-error-alert').html(e);
            $('#signup-error-alert').show();
        }).always(function() {
            console.log('complete');
        });
    }
}