/**
 * Private chat component, inherits form baseChat
 */
class PrivateChatMessage extends BaseMessage {
    /**
     * [constructor description]
     * @param  {[type]} containerWall [description]
     * @return {[type]}               [description]
     */
    constructor(containerWall) {
        super(containerWall);
        this.type = 'private';
    }

    /**
     * Singleton instance element
     * @return {[type]} [description]
     */
    static getInstance() {
        if (this.instance === undefined) {
            let containerWall = document.getElementById('private-msg_area');
            this.instance = new PrivateChatMessage(containerWall);
        }
        return this.instance;
    }

    /**
     * changes the receiver for the private chat
     * @param  {[type]} receiver_user_id [description]
     */
    initiatePrivateChat(receiver_user_id, username) {
        Cookies.set('receiver_user_id', receiver_user_id);
        $('#private-chat > li').remove();
        $('#receiver-username').html(username);
        let privateChatMessageModel = PrivateChatMessage.getInstance();
        privateChatMessageModel.updateMessageListView('', 0);
    }

    /**
     * Reacts and draw received new messages
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    reactToNewMessage(data){
        // only draw elements received from the user I am speaking with
        if (data.sender_user_id._id == Cookies.get('receiver_user_id') ||
            data.sender_user_id._id == Cookies.get('user-id')) {
            this.drawMessageItem(data);
            private_wall_container.scrollTop =
                private_wall_container.scrollHeight;
        }
    }
}

//* ***********************************************
//* ***********************************************
const privateChatMessageModel =  PrivateChatMessage.getInstance();
$(function() {
    // eslint-disable-next-line no-unused-vars
    const page = 0;
    // sync sockets
    socket.on('connect', (data) => {
        const oldSocketId = Cookies.get('user-socket-id');
        // delete old socket from db
        if (oldSocketId != undefined && oldSocketId != '') {
            if (oldSocketId !== socket.id) {
                User.getInstance().syncSocketId(oldSocketId, true);
            }
        }
        // register new socket in db
        User.getInstance().syncSocketId(socket.id, false);
        // store new socket on cookie for future reference
        Cookies.set('user-socket-id', socket.id);
    });

    // listen for private chat events
    socket.on('new-private-chat-message', (data) => {
        privateChatMessageModel.reactToNewMessage(data);
    });

    // init private chat messages events
    privateChatMessageModel.registerEventsAfterDraw();
});
