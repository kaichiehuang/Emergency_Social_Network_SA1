class PublicChatMessage extends BaseMessage {
    constructor() {
        super();
        this.type = "public";
    }
}

//************************************************
//************************************************
let public_wall_container = document.getElementById('public-msg_area');
let publicChatMessageModel = new PublicChatMessage();

$(function() {
    //socket for chat messages management
    const socket = io("");
    let page = 0;

    // listen for public chat events
    socket.on('new-chat-message', data => {
        publicChatMessageModel.drawMessageItem('public', data);
        public_wall_container.scrollTop = public_wall_container.scrollHeight;
    });

    // listen for spam events
    socket.on('spam-report-number', data => {
        console.log(data);
    });

    //init public chat messages and announcements
    publicChatMessageModel.updateMessageListView('public');

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

    $('.list-group').on('click', ".report-link", function(e) {
        e.preventDefault();
        console.log(e.target);
        $("#spam_user_id").val(e.toElement.getAttribute('user_id'));
        $("#spam_msg_id").val(e.toElement.getAttribute('msg_id'));
    });

    /**
     * form submit button event // triggered by submit and enter event by default
     */
    $("#search-public-chat__button").click(function (e) {
        e.preventDefault();
        let searchKeyword = $("#search-public-chat__input").val();
        page = 0;
        publicChatMessageModel.updateMessageListView('public', searchKeyword, page);
    });

    $("#search-public-chat__more-button").click(function (e) {
        e.preventDefault();
        let searchKeyword = $("#search-public-chat__input").val();
        page++;
        publicChatMessageModel.updateMessageListView('public', searchKeyword, page);
    });
});
