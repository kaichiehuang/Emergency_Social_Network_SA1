/**
 * Announcements class, inherits from base message
 */
class Announcement extends BaseMessage {
    /**
     * [constructor description]
     * @param  {[type]} containerWall [description]
     * @return {[type]}               [description]
     */
    constructor(containerWall) {
        super(containerWall);
        this.type = 'announcement';
    }
    /**
     * Singleton instance element
     * @return {[type]} [description]
     */
    static getInstance(){
        if(this.instance === undefined) {
            let containerWall = document.getElementById('announcement-msg_area');
            this.instance = new Announcement(containerWall);
        }
        return this.instance;
    }

    /**
     * [initiateAnnouncementsList description]
     * @return {[type]} [description]
     */
    initiateAnnouncementsList() {
        this.updateMessageListView();
        this.containerWall.scrollTop = 0;
        //hide input area for citizen
        if (currentUser.role === 'citizen') {
            $('#announcement-chat-content .type_area').addClass('hidden');
        }
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
     * Initial events declarations - only fired once
     * @return {[type]} [description]
     */
    initEvents() {
        const announcementModel = this;
        // announcement button header
        $('#announcement-button').click(function(event) {
            event.preventDefault();
            announcementModel.initiateAnnouncementsList();
        });
    }


    /**
     * Reacts and draw received new messages
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    reactToNewMessage(data) {
        this.drawLastAnnouncement(data);
        super.reactToNewMessage(data);
        this.containerWall.scrollTop = 0;
    }
}

//* ***********************************************
//* ***********************************************

const announcementModel = Announcement.getInstance();
const page = 0;
$(function() {
    // listen for public chat events
    socket.on('new-announcement', (data) => {
        announcementModel.reactToNewMessage(data);
    });
    // init announcement chat messages and announcements
    announcementModel.getLastAnnouncement();
    announcementModel.initEvents();
    announcementModel.registerEventsAfterDraw();
});