class Announcement extends BaseMessage {

    static instance = undefined;

    constructor() {
        super();
        this.type = 'announcement';
    }
    /**
     * Singleton instance element
     * @return {[type]} [description]
     */
    static getInstance(){
        if(this.instance === undefined) {
            this.instance = new Announcement();
        }
        return this.instance;
    }

    /**
     * [initiateAnnouncementsList description]
     * @return {[type]} [description]
     */
    static initiateAnnouncementsList() {
        const announcement = Announcement.getInstance();
        announcement.updateMessageListView('announcements');
    }

    /**
     * Draws the last announcement
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    drawLastAnnouncement(data) {
        const lastAnnouncementContainer = $('#last-announcement-container');
        lastAnnouncementContainer.html(data.message);
    }

    /**
     * Gets the last announcement
     * @return {[type]} [description]
     */
    getLastAnnouncement() {
        const url = '/announcements';
        const data = {
            last: true,
            limit: 1
        };
        APIHandler.getInstance()
            .sendRequest(url, 'get', data, true, null)
            .then((response) => {
                if (response.length > 0) {
                    Announcement.getInstance()
                        .drawLastAnnouncement(response[0]);
                }
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
        // announcement submit form
        $('#announcement-msg-form').on('submit', function(e) {
            e.preventDefault();
            announcementModel.sendMessage('announcement');
        });
        /**
         * form submit button event // triggered by submit and enter event by default
         */
        $('#search-announcements__button').click(function(e) {
            e.preventDefault();
            const searchKeyword = $('#search-announcements__input').val();
            page = 0;
            announcementModel.updateMessageListView('announcement', searchKeyword, page);
        });
        // announcement search more elements
        $('#search-announcement-chat__more-button').click(function(e) {
            e.preventDefault();
            const searchKeyword = $('#search-announcements__input').val();
            page++;
            announcementModel.updateMessageListView('announcement', searchKeyword, page);
        });
        // announcement button header
        $('#announcement-button').click(function(event) {
            event.preventDefault();
            announcementModel.updateMessageListView('announcement');
            announcement_wall_container.scrollTop = 0;
        });
    }
}

//* ***********************************************
//* ***********************************************
let announcement_wall_container = document.getElementById('announcement-msg_area');
const announcementModel =  Announcement.getInstance();
let page = 0;
$(function() {
    // listen for public chat events
    socket.on('new-announcement', (data) => {
        Announcement.getInstance().drawLastAnnouncement(data);
        announcementModel.updateMessageListView('announcement');
        announcement_wall_container.scrollTop = 0;
    });
    // init announcement chat messages and announcements
    Announcement.getInstance().getLastAnnouncement();
    announcementModel.initFormEvents();
});
