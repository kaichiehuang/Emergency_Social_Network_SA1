class PrivateChatMessage extends BaseMessage {
    constructor() {
        super();
        this.type = 'private';
    }

    /**
     * changes the receiver for the private chat
     * @param  {[type]} receiver_user_id [description]
     */
    static initiatePrivateChat(receiver_user_id) {
        Cookies.set('receiver_user_id', receiver_user_id);
        $("#private-chat > li").remove();
        let privateChatMessageModel = new PrivateChatMessage();
        privateChatMessageModel.updateMessageListView('private', "", 0);
    }

    /**
     * [registerEventsAfterDraw description]
     */
    static registerEventsAfterDraw() {
        /** **** events declaration ********/
        $('#private-send-btn').click(function(e) {
            privateChatMessageModel.sendMessage('private');
        });
        $('#private-msg-form').on('submit', function(e) {
            e.preventDefault();
            privateChatMessageModel.sendMessage('private');
        });
        // capture event to load messages
        $('.content-changer').click(function(event) {
            event.preventDefault();
            // eslint-disable-next-line no-invalid-this
            const newID = $(this).data('view-id');
            if (newID === 'private-chat-content') {
                page = 0;
                privateChatMessageModel.updateMessageListView('private', '', page);
                private_wall_container.scrollTop =
                    private_wall_container.scrollHeight;
            }
        });
        /**
         * form submit button event
         * triggered by submit and enter event by default
         */
        $('#search-private-chat__button').click(function(e) {
            e.preventDefault();
            const searchKeyword = $('#search-private-chat__input').val();
            page = 0;
            privateChatMessageModel.updateMessageListView('private', searchKeyword, page);
        });
        $('#search-private-chat__more-button').click(function(e) {
            e.preventDefault();
            const searchKeyword = $('#search-private-chat__input').val();
            page++;
            privateChatMessageModel.updateMessageListView('private', searchKeyword, page);
        });
    }
}

//* ***********************************************
//* ***********************************************
let private_wall_container = document.getElementById('private-msg_area');
const privateChatMessageModel = new PrivateChatMessage();
$(function() {
    // eslint-disable-next-line no-unused-vars
    let page = 0;
    // sync sockets
    socket.on('connect', (data) => {
        const oldSocketId = Cookies.get('user-socket-id');
        // delete old socket from db
        if (oldSocketId != undefined && oldSocketId != '') {
            if (oldSocketId !== socket.id) {
                syncSocketId(oldSocketId, true);
            }
        }
        // register new socket in db
        syncSocketId(socket.id, false);
        // store new socket on cookie for future reference
        Cookies.set('user-socket-id', socket.id);
    });
    // listen for private chat events
    socket.on('new-private-chat-message', (data) => {
        // only draw elements received from the user I am speaking with
        if (data.sender_user_id._id == Cookies.get('receiver_user_id') ||
            data.sender_user_id._id == Cookies.get('user-id')) {
            privateChatMessageModel.drawMessageItem('private', data);
            private_wall_container.scrollTop =
                private_wall_container.scrollHeight;
        } else {
            // refreshes user list to update the unseen messages
            // counter for other
            // updateUserListView();
        }
    });
    // init private chat messages and announcements
    privateChatMessageModel.updateMessageListView('private');
    PrivateChatMessage.registerEventsAfterDraw();
});
