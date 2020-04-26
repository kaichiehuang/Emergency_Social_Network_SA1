class PublicChatMessage extends BaseMessage {

    static instance = undefined;

    constructor(containerWall) {
        super(containerWall);
        this.type = 'public';
    }
    /**
     * Singleton instance element
     * @return {[type]} [description]
     */
    static getInstance(){
        if (this.instance === undefined) {
            let containerWall = document.getElementById('public-msg_area');
            this.instance = new PublicChatMessage(containerWall);
        }
        return this.instance;
    }

    /**
     * [registerEventsAfterDraw description]
     * @return {[type]} [description]
     */
     registerEventsAfterDraw() {
        /** **** events declaration ********/
        super.registerEventsAfterDraw();

        $('.list-group').on('click', '.report-link', function(e) {
            e.preventDefault();
            console.log(e.target);
            $('#spam_user_id').val(e.toElement.getAttribute('user_id'));
            $('#spam_msg_id').val(e.toElement.getAttribute('msg_id'));
        });
    }
}

let public_wall_container = document.getElementById('public-msg_area');
let publicChatMessageModel =  PublicChatMessage.getInstance();
$(function() {
    // eslint-disable-next-line no-unused-vars
    let page = 0;
    // listen for public chat events
    socket.on('new-chat-message', (data) => {
        publicChatMessageModel.reactToNewMessage(data);
    });

    // listen for spam number update (user/message) events
    socket.on('spam-report-number', (data) => {
        console.log(data);
        $('#public-chat li').remove();
        publicChatMessageModel.updateMessageListView();
    });

    // init public chat messages
    publicChatMessageModel.updateMessageListView();
    publicChatMessageModel.registerEventsAfterDraw();
});
