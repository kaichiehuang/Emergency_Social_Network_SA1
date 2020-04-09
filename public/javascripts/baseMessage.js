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
     drawMessageItem(type, message) {
        if(message.sender_user_id != undefined){
            message.user_id = message.sender_user_id;
        }
        if (message.user_id == null || message.user_id == undefined) {
            return;
        }
        //1. find template
        const messagesTemplate = document.querySelector('template#' + type + '-template');
        //2. find container
        let listContainer = document.getElementById(type + '-chat');

        if (listContainer != undefined) {
            const list_length = $("#"+type + '-chat > li').length;
            //3. iterate over users list and draw using the appropiate template based on online/offline state
            var template = messagesTemplate.content.cloneNode(true);;
            if (template != undefined && template != null && message != undefined) {
                let new_li = $('ul#' + type + '-chat li#' + type + '-template').clone();
                if (list_length % 2 == 1) {
                    template.querySelector(".user-post").classList.add('user-post-odd');
                } else {
                    template.querySelector(".user-post").classList.add('user-post-even');
                }
                let user_id = Cookies.get('user-id');
                if (user_id === message.user_id._id) {
                    template.querySelector(".user-post").classList.add('user-post-current');
                }
                let indicatorStyle = '';
                if(message.status != undefined && message.status != ""){
                    if (message.status === 'OK') {
                        indicatorStyle = "background-color-ok";
                    } else if (message.status === 'HELP') {
                        indicatorStyle = 'background-color-help';
                    } else if (message.status === 'EMERGENCY') {
                        indicatorStyle = 'background-color-emergency';
                    } else if (message.status === 'UNDEFINED') {
                        indicatorStyle = 'background-color-undefined';
                    }

                    template.querySelector('.status-indicator-element').classList.add("statusIndicator");
                    if(indicatorStyle != ''){
                        template.querySelector('.status-indicator-element').classList.add(indicatorStyle);
                    }
                }

                template.querySelector('.msg').innerText = message.message;
                template.querySelector('.timestamp').innerText = new Date(message.created_at).toLocaleString();
                template.querySelector('.username').innerText = message.user_id.username;

                listContainer.appendChild(template);
            }
        }
    }
    /**
     * [drawMessage description]
     * @param  {[type]} type     [description]
     * @param  {[type]} messages [description]
     * @return {[type]}          [description]
     */
     drawMessages(type, messages, page) {
        let i = 0;
        //only delete previous results if page is 0
        if(page ==  undefined || page == 0){
            $('ul#' + type + '-chat li').remove();
        }

        messages.forEach(element => {
            this.drawMessageItem(type, element);
            i++;
        });

        $("#"+type+"-msg_area .no-results-message").addClass("hidden");
        if(messages.length == 0){
            if(page == 0){
                $("#"+type+"-msg_area .no-results-message").removeClass("hidden");
            }
            this.deactivateSearchButtonsLoadMore(type);
        }
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
     getMessages(type, keywords, page) {
        let jwt = Cookies.get('user-jwt-esn');
        let url = apiPath + '/chat-messages';
        let data = {
            'page': page,
            'q': keywords
        };

        if(keywords != undefined && keywords.length > 0){
            this.activateSearchButtonsLoadMore(type);
        }

        return new Promise((resolve, reject) => {
            //data for private chat
            if (type === 'private') {
                url = apiPath + '/private-chat-messages';
                data = {
                    'page': page,
                    'q': keywords,
                    "sender_user_id": Cookies.get('user-id'),
                    "receiver_user_id": Cookies.get('receiver_user_id')
                };
            }
            //data for announcements
            if (type === 'announcement') {
                url = apiPath + '/announcements';
                data = {
                    'page': page,
                    'q': keywords
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
                resolve(response);
            }).fail(function(e) {
                reject(e.message)
            }).always(function() {
                console.log("complete");
            });
        });
    }
    /**
     * [updateMessageListView description]
     * @param  {[type]} type          [description]
     * @param  {[type]} searchKeyword [description]
     * @param  {[type]} page          [description]
     * @return {[type]}               [description]
     */
     updateMessageListView(type, searchKeyword, page) {
        let self = this;
        if(searchKeyword == undefined || searchKeyword.length == 0){
            this.deactivateSearchButtonsLoadMore(type);
        }
        //get user data and then get messages to paint and to check for unread messages
        this.getMessages(type, searchKeyword, page).then(results => {
            self.drawMessages(type, results, page);
        }).catch(err => {
            console.log(err)
        });
    }

    /**
     * [activateSearchButtonsLoadMore description]
     * @param  {[type]} type [description]
     * @return {[type]}      [description]
     */
    activateSearchButtonsLoadMore(type){
        this.deactivateSearchButtonsLoadMore(type);
        $("#search-"+type+"-chat__more").removeClass("hidden");
    }

    /**
     * [activateSearchButtonsLoadMore description]
     * @param  {[type]} type [description]
     * @return {[type]}      [description]
     */
    deactivateSearchButtonsLoadMore(type){
        $(".more-results-button-container").addClass("hidden");
    }
}