// eslint-disable-next-line no-unused-vars
class BaseMessage {


    constructor() {
        this._id = null;
        this.message = '';
        this.user_id = null;
    }

    /**
     *
     * @param type
     * @param message
     */
    drawMessageItem(type, message) {
        if (message.sender_user_id != undefined) {
            message.user_id = message.sender_user_id;
        }
        if (message.user_id == null || message.user_id == undefined) {
            return;
        }
        // 1. find template
        const messagesTemplate = document
            .querySelector('template#' + type + '-template');
        // 2. find container
        const listContainer = document.getElementById(type + '-chat');

        if (listContainer != undefined) {
            const list_length = $('#'+type + '-chat > li').length;
            // 3. iterate over users list and draw using the
            // appropiate template based on online/offline state
            const template = messagesTemplate.content.cloneNode(true);
            if (template != undefined && template !=
                null && message != undefined) {
                if (list_length % 2 == 1) {
                    template.querySelector('.user-post')
                        .classList.add('user-post-odd');
                } else {
                    template.querySelector('.user-post')
                        .classList.add('user-post-even');
                }
                const user_id = Cookies.get('user-id');
                if (user_id === message.user_id._id) {
                    template.querySelector('.user-post')
                        .classList.add('user-post-current');
                }
                let indicatorStyle = '';
                console.log('mesage status = ', message.status);
                if (message.status != undefined && message.status != '') {
                    if (message.status === 'OK') {
                        indicatorStyle = 'background-color-ok';
                    } else if (message.status === 'HELP') {
                        indicatorStyle = 'background-color-help';
                    } else if (message.status === 'EMERGENCY') {
                        indicatorStyle = 'background-color-emergency';
                    } else if (message.status === 'UNDEFINED') {
                        indicatorStyle = 'background-color-undefined';
                    }

                    template.querySelector('.status-indicator-element')
                        .classList.add('statusIndicator');
                    if (indicatorStyle != '') {
                        template.querySelector('.status-indicator-element')
                            .classList.add(indicatorStyle);
                    }
                }
                if (!message.spam) {
                    template.querySelector('.msg').innerText = message.message;
                } else {
                    template.querySelector('.msg').classList.add('hidden');
                    template.querySelector('.report-msg-number')
                        .classList.add('hidden');
                    template.querySelector('.report-link')
                        .classList.add('hidden');
                    template.querySelector('.spam-msg')
                        .classList.remove('hidden');
                }
                template.querySelector('.timestamp').innerText =
                    new Date(message.created_at).toLocaleString();
                template.querySelector('.username').innerText =
                    message.user_id.username;
                let msgNumber = 0;
                if (message.reported_spams != undefined) {
                    msgNumber = Object
                        .getOwnPropertyNames(message.reported_spams).length;
                    if (message.reported_spams.hasOwnProperty(user_id)) {
                        template.querySelector('.report-link')
                            .classList.add('report-link-disable');
                    }
                }
                if (msgNumber != 0) {
                    template.querySelector('.report-msg-number')
                        .innerText = '(' + msgNumber + ')';
                }
                let userNumer = 0;
                if (message.user_id.reported_spams != undefined) {
                    userNumer = Object
                        .getOwnPropertyNames(message.user_id.reported_spams)
                        .length;
                }
                if (userNumer != 0) {
                    template.querySelector('.report-user-number')
                        .innerText = '<' + userNumer + '>';
                }
                template.querySelector('.report')
                    .setAttribute('msg_id', message._id);
                template.querySelector('.report')
                    .setAttribute('user_id', message.user_id._id);

                listContainer.appendChild(template);
            }
        }
    }

    /**
     *
     * @param type
     * @param messages
     * @param page
     */
    drawMessages(type, messages, page) {
        // only delete previous results if page is 0
        if (page == undefined || page == 0) {
            $('ul#' + type + '-chat li').remove();
        }

        messages.forEach((element) => {
            this.drawMessageItem(type, element);
        });

        $('#'+type+'-msg_area .no-results-message').addClass('hidden');
        if (messages.length == 0) {
            if (page == 0) {
                $('#'+type+'-msg_area .no-results-message')
                    .removeClass('hidden');
            }
            this.deactivateSearchButtonsLoadMore(type);
        }
    }

    /**
     * Sends and saves the message the user post.
     * @param type
     */
    sendMessage(type) {
        const user_id = Cookies.get('user-id');

        let url = '/chat-messages';
        let message_content = '#public-send-message-content';
        let data = {
            message: $(message_content).val(),
            user_id: user_id
        };
        // for private messages
        if (type === 'private') {
            url = '/private-chat-messages';
            message_content = '#private-send-message-content';
            data = {
                message: $(message_content).val(),
                sender_user_id: user_id,
                receiver_user_id: Cookies.get('receiver_user_id')
            };
        }
        // for announcements
        if (type === 'announcement') {
            url = '/announcements';
            message_content = '#announcement-send-message-content';
            data = {
                message: $(message_content).val(),
                user_id: user_id,
            };
        }
        // ajax calls
        APIHandler.getInstance()
            .sendRequest(url, 'post', data, true, null)
            .then((response) => {
                $(message_content).val('');
                if (type === 'public' && response.spam) {
                    $('#user-spam-modal').modal('show');
                }
            })
            .catch((error) => {
                const errorAlert = $('#signup-error-alert');
                errorAlert.html(error);
                errorAlert.show();
            });
    }

    /**
     * Get all the messages previously posted
     * @param type
     * @param keywords
     * @param page
     * @returns {Promise<unknown>}
     */
    getMessages(type, keywords, page) {
        let url = '/chat-messages';
        let data = {
            'page': page,
            'q': keywords
        };

        if (keywords != undefined && keywords.length > 0) {
            this.activateSearchButtonsLoadMore(type);
        }

        return new Promise((resolve, reject) => {
            // data for private chat
            if (type === 'private') {
                url = '/private-chat-messages';
                data = {
                    'page': page,
                    'q': keywords,
                    'sender_user_id': Cookies.get('user-id'),
                    'receiver_user_id': Cookies.get('receiver_user_id')
                };
            }
            // data for announcements
            if (type === 'announcement') {
                url = '/announcements';
                data = {
                    'page': page,
                    'q': keywords
                };
            }

            APIHandler.getInstance()
                .sendRequest(url, 'get', data, true, null)
                .then((response)=>{
                    resolve(response);
                })
                .catch((error) =>{
                    reject(error.message);
                });
        });
    }
    /**
     * [updateMessageListView description]
     * @param  {string} type          [description]
     * @param  {[type]} searchKeyword [description]
     * @param  {number} page          [description]
     */
    updateMessageListView(type, searchKeyword, page) {
        let self = this;
        if (searchKeyword == undefined || searchKeyword.length == 0) {
            this.deactivateSearchButtonsLoadMore(type);
        }
        // get user data and then get messages to
        // paint and to check for unread messages
        this.getMessages(type, searchKeyword, page).then((results) => {
            self.drawMessages(type, results, page);
        }).catch((err) => {
            console.log(err);
        });
    }

    /**
     * [activateSearchButtonsLoadMore description]
     * @param  {[type]} type [description]
     */
    activateSearchButtonsLoadMore(type) {
        this.deactivateSearchButtonsLoadMore(type);
        $('#search-'+type+'-chat__more').removeClass('hidden');
    }

    /**
     * [activateSearchButtonsLoadMore description]
     * @param  {[type]} type [description]
     * @return {[type]}      [description]
     */
    deactivateSearchButtonsLoadMore(type) {
        $('.more-results-button-container').addClass('hidden');
    }
}
