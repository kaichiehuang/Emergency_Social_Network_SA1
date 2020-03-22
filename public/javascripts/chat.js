class PublicChatMessage extends BaseMessage {
    constructor() {
        super();
        this.type = "public";
    }
}


//************************************************
//************************************************
var public_wall_container = document.getElementById('public-msg_area');
let publicChatMessageModel = new PublicChatMessage();
$(function() {
    //socket for chat messages management
    const socket = io("");

    // listen for public chat events
    socket.on('new-chat-message', data => {
        publicChatMessageModel.drawMessageItem('public', data);
        public_wall_container.scrollTop = public_wall_container.scrollHeight;
    });

    //init public chat messages and announcements
    publicChatMessageModel.getMessages('public');

     /****** events declaration ********/
     $('#public-send-btn').click(function(e) {
        publicChatMessageModel.sendMessage('public');
    });
     $('#public-msg-form').on('submit', function(e) {
        e.preventDefault();
        publicChatMessageModel.sendMessage('public');
    });

    //capture event to load messages
    $('.content-changer').click(function(event) {
        event.preventDefault();
        let newID = $(this).data('view-id');
        if (newID === 'public-chat-content') {
            public_wall_container.scrollTop = public_wall_container.scrollHeight;
        }
    });
});
