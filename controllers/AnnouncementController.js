const Announcement = require('../model/announcement');
class AnnouncementController {
    /**
     * Create an annoucement
     * @param req
     * @param res
     */
    createAnnouncement(req, res) {
        let requestData = req.body;
        let message = requestData['message'];
        let user_id = requestData['user_id'];
        let newAnnouncement = new Announcement(message, user_id, 'OK');

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
            /* istanbul ignore next */
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
    getAnnouncements(req, res) {
        const keywords = req.query.q;
        const index = req.query.page;
        let limit = req.query.limit;
        const last = req.query.last;
        let sort_type = -1;

        if (keywords === undefined || keywords.length == 0 || index === undefined || last === true) {
            if (last != undefined && last) {
                /* istanbul ignore next */
                limit = parseInt('1');
                sort_type = -1;
            }

            Announcement.getAnnouncements(sort_type, limit).then((announcements) => {
                res.contentType('application/json');
                res.status(201).send(JSON.stringify(announcements));
            }).catch((err) => {
                /* istanbul ignore next */
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
                /* istanbul ignore next */
                return res.status(422).send(JSON.stringify({
                    'error': err.message
                }));
            });
        }
    }
}
module.exports = AnnouncementController;
