// eslint-disable-next-line no-unused-vars
/**
 * Parent class for message drawing and sycing (private, public and announcements)
 */
class BaseMessage {

    /**
     * [constructor description]
     * @return {[type]} [description]
     */
    constructor(containerWall) {
        this._id = null;
        this.message = '';
        this.type = '';
        this.user_id = null;
        this.containerWall = containerWall;
        this.page = 0;
    }

    /**
     *
     * @param type
     * @param message
     */
    drawMessageItem(message) {
        if (message.sender_user_id != undefined) {
            message.user_id = message.sender_user_id;
        }
        if (message.user_id == null || message.user_id == undefined) {
            return;
        }
        // 1. find template
        const messagesTemplate = document
            .querySelector('template#' + this.type + '-template');
        // 2. find container
        const listContainer = document.getElementById(this.type + '-chat');

        if (listContainer != undefined) {
            const listLength = $('#'+this.type + '-chat > li').length;
            // 3. iterate over users list and draw using the
            // appropiate template based on online/offline state
            const template = messagesTemplate.content.cloneNode(true);
            if (template != undefined && template !=
                null && message != undefined) {
                let rowType = 'even';
                if (listLength % 2 == 1) {
                    rowType = 'odd';
                }
                template.querySelector('.user-post')
                    .classList.add('user-post-' + rowType);

                const user_id = Cookies.get('user-id');
                if (user_id === message.user_id._id) {
                    template.querySelector('.user-post')
                        .classList.add('user-post-current');
                }
                let indicatorStyle = '';
                if (message.status != undefined && message.status != '') {
                    const userStatusLC = message.status.toLowerCase();
                    indicatorStyle = 'background-color-' + userStatusLC;

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
     * @param messages
     * @param page
     */
    drawMessages(messages) {
        // only delete previous results if page is 0
        if (this.page == undefined || this.page == 0) {
            $('ul#' + this.type + '-chat li').remove();
        }

        messages.forEach((element) => {
            this.drawMessageItem(element);
        });

        $('#'+this.type+'-msg_area .no-results-message').addClass('hidden');
        if (messages.length == 0) {
            if (this.page == 0) {
                $('#'+this.type+'-msg_area .no-results-message')
                    .removeClass('hidden');
            }
            this.deactivateSearchButtonsLoadMore();
        }
    }

    /**
     * Sends and saves the message the user post.
     * @param type
     */
    sendMessage() {
        const user_id = Cookies.get('user-id');

        let url = '/chat-messages';
        let messageContent = '#public-send-message-content';
        let data = {
            message: $(messageContent).val(),
            user_id: user_id
        };
        // for private messages
        if (this.type === 'private') {
            url = '/private-chat-messages';
            messageContent = '#private-send-message-content';
            data = {
                message: $(messageContent).val(),
                sender_user_id: user_id,
                receiver_user_id: Cookies.get('receiver_user_id')
            };
        }
        // for announcements
        if (this.type === 'announcement') {
            url = '/announcements';
            messageContent = '#announcement-send-message-content';
            data = {
                message: $(messageContent).val(),
                user_id: user_id,
            };
        }
        // ajax calls
        APIHandler.getInstance()
            .sendRequest(url, 'post', data, true, null)
            .then((response) => {
                $(messageContent).val('');
                if (this.type === 'public' && response.spam) {
                    $('#user-spam-modal').modal('show');
                }
            })
            .catch((error) => {
                if (error.responseJSON.msg != undefined) {
                    alert(error.responseJSON.msg);
                }

            });
    }

    /**
     * Get all the messages previously posted
     * @param type
     * @param keywords
     * @param page
     * @returns {Promise<unknown>}
     */
    getMessages(keywords) {
        let url = '/chat-messages';
        let data = {
            'page': this.page,
            'q': keywords
        };

        if (keywords != undefined && keywords.length > 0) {
            this.activateSearchButtonsLoadMore();
        }

        return new Promise((resolve, reject) => {
            // data for private chat
            if (this.type === 'private') {
                url = '/private-chat-messages';
                data = {
                    'page': this.page,
                    'q': keywords,
                    'sender_user_id': Cookies.get('user-id'),
                    'receiver_user_id': Cookies.get('receiver_user_id')
                };
            }
            // data for announcements
            if (this.type === 'announcement') {
                url = '/announcements';
                data = {
                    'page': this.page,
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
    updateMessageListView(searchKeyword, page) {
        this.page = page;
        const self = this;
        if (searchKeyword == undefined || searchKeyword.length == 0) {
            this.deactivateSearchButtonsLoadMore();
        }
        // get user data and then get messages to
        // paint and to check for unread messages
        this.getMessages(searchKeyword).then((results) => {
            self.drawMessages(results);
            $('.main-content-loggedin').animate({scrollTop: self.containerWall.scrollHeight}, 100);
        }).catch((err) => {});
    }

    /**
     * [activateSearchButtonsLoadMore description]
     * @param  {[type]} type [description]
     */
    activateSearchButtonsLoadMore() {
        this.deactivateSearchButtonsLoadMore();
        $('#search-'+this.type+'-chat__more').removeClass('hidden');
    }

    /**
     * [activateSearchButtonsLoadMore description]
     * @param  {[type]} type [description]
     * @return {[type]}      [description]
     */
    deactivateSearchButtonsLoadMore() {
        $('.more-results-button-container').addClass('hidden');
    }

    /**
     * [registerEventsAfterDraw description]
     */
    registerEventsAfterDraw() {
        const modelElement = this;
        let stringType = this.type + '-chat';
        if (this.type == 'announcement') {
            stringType = this.type;
        }
        /** **** events declaration ********/
        $('#'+this.type+'-msg-form').on('submit', function(e) {
            e.preventDefault();
            modelElement.sendMessage();
        });
        $('#'+this.type+'-send-btn').click(function(e) {
            modelElement.sendMessage();
        });
        // capture event to load messages and display view
        $('.content-changer, .menu-content-changer').click(function(event) {
            event.preventDefault();
            // eslint-disable-next-line no-invalid-this
            const newID = $(this).data('view-id');
            if (newID === stringType+'-content') {
                modelElement.updateMessageListView('', 0);
                $('.main-content-loggedin').animate({scrollTop: modelElement.containerWall.scrollHeight}, 100);
            }
        });
        /**
         * search form submit and load more
         */
        let page = this.page;
        $('#search-'+stringType+'__button').click(function(e) {
            e.preventDefault();
            const searchKeyword = $('#search-'+stringType+'__input').val();
            modelElement.updateMessageListView(searchKeyword, 0);
        });
        $('#search-'+stringType+'__more-button').click(function(e) {
            e.preventDefault();
            const searchKeyword = $('#search-'+stringType+'__input').val();
            page++;
            modelElement.updateMessageListView(searchKeyword, page);
        });
    }

    /**
     * Reacts and draw received new messages
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    reactToNewMessage(data) {
        this.drawMessageItem(data);
        this.containerWall.scrollTop = this.containerWall.scrollHeight;
    }
}
