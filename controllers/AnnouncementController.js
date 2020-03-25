const Announcement = require('../model/announcement');
class AnnouncementController {
    /**
     * Create an annoucement
     * @param req
     * @param res
     */
    createAnnouncement(req, res) {
        const requestData = req.body;
        const message = requestData['message'];
        const user_id = requestData['user_id'];
        console.log('message' + message);
        console.log('announcement id' + user_id);
        const newAnnouncement = new Announcement(message, user_id, 'OK');

        // save new announcement
        newAnnouncement.saveAnnouncement().then((newAnnouncement) => {
            res.io.emit('new-announcement', {
                'id': newAnnouncement._id,
                'message': newAnnouncement.message,
                'created_at': newAnnouncement.created_at,
            });

            res.contentType('application/json');
            res.status(201).send(JSON.stringify(newAnnouncement));
        }).catch((err) => {
            return res.status(422).send(JSON.stringify({
                'error': err.message
            }));
        });
    }

    /**
     * Get announcement, if there's not parameters (keywords or index)
     *  the method returns all the announcements, if the filters exist
     *  the method return the announcment filtered by the keywords
     *  with pagination.
     * @param req
     * @param res
     */
    getAnnouncement(req, res) {
        const keywords = req.query.q;
        const index = req.query.page;
        let limit = req.query.limit;
        const last = req.query.last;
        let sort_type = -1;

        console.log('keywords = ' + keywords);
        console.log('limit=' + limit);
        console.log('page=' + index);

        if (keywords === undefined || keywords == '' || index === undefined || last === true) {
            if (last != undefined && last) {
                limit = parseInt('1');
                sort_type = -1;
            }

            Announcement.getAnnouncements(sort_type, limit).then((announcements) => {
                res.contentType('application/json');
                res.status(201).send(JSON.stringify(announcements));
            }).catch((err) => {
                return res.status(422).send(JSON.stringify({
                    'error': err.message
                }));
            });
        } else {
            sort_type = -1;
            Announcement.findAnnouncements(keywords, index, sort_type).then((announcements) => {
                res.contentType('application/json');
                res.status(201).send(JSON.stringify(announcements));
            }).catch((err) => {
                return res.status(422).send(JSON.stringify({
                    'error': err.message
                }));
            });
        }
    }
}
module.exports = AnnouncementController;
