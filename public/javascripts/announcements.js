class Announcement extends BaseMessage {
    constructor() {
        super();
        this.type = "announcement";
    }

    static drawLastAnnouncement(data) {
        let lastAnnouncementContainer = $("#last-announcement-container");
        lastAnnouncementContainer.html(data.message);
    }

    static getLastAnnouncement() {
        let jwt = Cookies.get('user-jwt-esn');
        let url = apiPath + '/announcements';
        let data = {
            last: true,
            limit: 1
        };
        $.ajax({
            url: url,
            type: 'get',
            headers: {
                Authorization: jwt
            },
            data: data
        }).done(function(response) {
            //console.log(response);
            let i = 0;
            if (response.length > 0) {
                Announcement.drawLastAnnouncement(response[0]);
            }
        }).fail(function(e) {})
        .always(function() {
            console.log('complete');
        });
    }
}
//************************************************
//************************************************
var announcement_wall_container = document.getElementById('announcement-msg_area');
let announcementModel = new Announcement();
$(function() {
    //socket for chat messages management
    const socket = io("");
    // listen for announcement chat events
    socket.on('new-chat-message', data => {
        announcementModel.drawMessageItem('announcement', data);
        announcement_wall_container.scrollTop = announcement_wall_container.scrollHeight;
    });
    // listen for public chat events
    socket.on('new-announcement', data => {
        Announcement.drawLastAnnouncement(data);
        announcementModel.updateMessageListView("announcement")
        announcements_container.scrollTop = announcements_container.scrollHeight;
    });


    //init announcement chat messages and announcements
    Announcement.getLastAnnouncement();

    /****** events declaration ********/
    $('#announcement-send-btn').click(function(e) {
        announcementModel.sendMessage('announcement');
    });
    $('#announcement-msg-form').on('submit', function(e) {
        e.preventDefault();
        announcementModel.sendMessage('announcement');
    });
    //capture event to load messages
    $('.content-changer').click(function(event) {
        event.preventDefault();
        let newID = $(this).data('view-id');
        if (newID === 'announcement-chat-content') {
            announcementModel.updateMessageListView('announcement');
            announcement_wall_container.scrollTop = announcement_wall_container.scrollHeight;
        }
    });
    /**
     * form submit button event // triggered by submit and enter event by default
     */
    $("#search-announcements__button").click(function(e) {
        e.preventDefault();
        let searchKeyword = $("#search-announcements__input").val();
        announcementModel.updateMessageListView('announcement', searchKeyword, 0);
    });
});