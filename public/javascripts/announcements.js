class Announcement extends BaseMessage {
    constructor() {
        super();
        this.type = "announcement";
    }
    /**
     * [initiateAnnouncementsList description]
     * @return {[type]} [description]
     */
    static initiateAnnouncementsList() {
        let announcement = new Announcement();
        announcement.updateMessageListView('announcements');
    }
    /**
     * Draws the last announcement
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    static drawLastAnnouncement(data) {
        let lastAnnouncementContainer = $("#last-announcement-container");
        lastAnnouncementContainer.html(data.message);
    }
    /**
     * Gets the last announcement
     * @return {[type]} [description]
     */
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
        }).fail(function(e) {}).always(function() {
            console.log('complete');
        });
    }
    /**
     * Events declarations
     * @return {[type]} [description]
     */
    initFormEvents() {
        $('#announcement-send-btn').click(function(e) {
            announcementModel.sendMessage('announcement');
        });
        //announcement submit form
        $('#announcement-msg-form').on('submit', function(e) {
            e.preventDefault();
            announcementModel.sendMessage('announcement');
        });
        /**
         * form submit button event // triggered by submit and enter event by default
         */
        $("#search-announcements__button").click(function(e) {
            e.preventDefault();
            let searchKeyword = $("#search-announcements__input").val();
            page = 0;
            announcementModel.updateMessageListView('announcement', searchKeyword, page);
        });
        //announcement search more elements
        $("#search-announcement-chat__more-button").click(function(e) {
            e.preventDefault();
            let searchKeyword = $("#search-announcements__input").val();
            page++;
            announcementModel.updateMessageListView('announcement', searchKeyword, page);
        });
        //announcement button header
        $('#announcement-button').click(function(event) {
            event.preventDefault();
            announcementModel.updateMessageListView('announcement');
            announcement_wall_container.scrollTop = 0;
        });
    }
}
//************************************************
//************************************************
var announcement_wall_container = document.getElementById('announcement-msg_area');
let announcementModel = new Announcement();
let page = 0;
$(function() {

    // listen for public chat events
    socket.on('new-announcement', data => {
        Announcement.drawLastAnnouncement(data);
        announcementModel.updateMessageListView("announcement")
        announcement_wall_container.scrollTop = 0;
    });
    //init announcement chat messages and announcements
    Announcement.getLastAnnouncement();
    announcementModel.initFormEvents();
});