const Announcement = require("../model/announcement")
class AnnouncementController {
    /**
     * Create an annoucement
     * @param req
     * @param res
     */
    createAnnouncement(req, res) {
        let requestData = req.body;
        let announcement = requestData['announcement'];
        let user_id = requestData['user_id'];
        console.log("announcement" + announcement);
        console.log("announcement" + user_id);
        let newAnnouncement = new Announcement(announcement, user_id, 'OK');

        //save new announcement
        newAnnouncement.saveAnnouncement().then(newAnnouncement => {
            res.io.emit('new-announcement', {
                "id": newAnnouncement._id,
                "announcement": newAnnouncement.announcement,
                "created_at": newAnnouncement.created_at,
            });

            res.contentType('application/json');
            res.status(201).send(JSON.stringify(newAnnouncement));
        }).catch(err => {
            return res.status(422).send(JSON.stringify({
                "error": err.message
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
        let keywords = req.query.q;
        let index = req.query.limit;
        console.log("keywords" + keywords);
        console.log("limit" + index);
        if (keywords === undefined || index === undefined) {
            Announcement.getAnnouncements().then(announcements => {
                res.contentType('application/json');
                res.status(201).send(JSON.stringify(announcements));
            }).catch(err => {
                return res.status(422).send(JSON.stringify({
                    "error": err.message
                }));
            });
        } else {
            Announcement.findAnnouncements(keywords, index).then(announcements => {
                res.contentType('application/json');
                res.status(201).send(JSON.stringify(announcements));
            }).catch(err => {
                return res.status(422).send(JSON.stringify({
                    "error": err.message
                }));
            });
        }
    }
}
module.exports = AnnouncementController