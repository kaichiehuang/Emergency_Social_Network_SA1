const AnnouncementModel = require('./model').AnnouncementsMongo;
const StopWords = require('../utils/StopWords');
const constants = require('../constants');

//Create index on mongodb
//db.announcements.createIndex({"message":"text"})

class Announcement {
    constructor(message, user_id, user_status) {
        this._id = null;
        this.message = message;
        this.user_id = user_id;
        this.status = user_status;
    }

    /**
     * Create Announcement
     * @returns {Promise<unknown>}
     */
    saveAnnouncement() {
        return new Promise((resolve, reject) => {
            //validate for empty announcement
            if (new String(this.message) == "") {
                reject("Invalid announcement, please enter the message that you want to send");
            }
            //save new announcement
            let newAnnouncement = new AnnouncementModel({
                message: this.message,
                user_id: this.user_id,
                status: this.status
            });
            newAnnouncement.save()
                .then(result => {
                    this._id = result.id;
                    resolve(result);
                })
                .catch(err => {
                    /* istanbul ignore next */
                    console.log("Error creating announcement:" + err)
                    reject(err);
                })
        })
    }


    /**
     * Get all the announcements with the username of
     * the user that post the announcement
     * @returns {Promise<unknown>}
     */
    static getAnnouncements(sort_type, limit) {
        return new Promise((resolve, reject) => {
            const populateQuery = {
                path: 'user_id',
                select: '_id username',
                match: {}
            };
            //TODO: GET user role
            if (true) {
                populateQuery['match']['active'] =true;
            }
            AnnouncementModel.find({})
                .populate(populateQuery)
                .sort({
                    created_at: sort_type
                }).limit(parseInt(limit))
                .then(result => {
                    resolve(result);
                })
                .catch((err) => {
                    /* istanbul ignore next */
                    console.log("Error getting Announcements: " + err);
                    //throw err.message;
                    reject("Error getting Announcements: " + err.message);
                });
        })
    }

    /**
     * Search announcements by keywords with pagination
     * @param keywords
     * @returns {Promise<unknown>}
     */
    static findAnnouncements(keywords, index, sort_type) {
        return new Promise((resolve, reject) => {
            const populateQuery = {
                path: 'user_id',
                select: '_id username',
                match: {}
            };
            //TODO: GET user role
            if (true) {
                populateQuery['match']['active'] =true;
            }
            let totalSkip = index * constants.PAGINATION_NUMBER;
            StopWords.removeStopWords(keywords).then(filteredKeyWords => {
                console.log("after clean keywords: " + filteredKeyWords);
                AnnouncementModel.find(
                    {$text: {$search: filteredKeyWords}})
                    .populate(populateQuery)
                    .sort({
                        created_at: sort_type
                    })
                    .skip(totalSkip)
                    .limit(constants.PAGINATION_NUMBER)
                    .then(result => {
                        resolve(result);
                    })
                    .catch(function(err) {
                        /* istanbul ignore next */
                        console.log("Error getting Announcements by keyword: " + err);
                        reject(err);
                    });
            })
        })
    }

}


module.exports = Announcement;
