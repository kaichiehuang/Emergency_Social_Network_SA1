const AnnouncementModel = require('./model').AnnouncementsMongo;
const StopWords = require('../utils/StopWords');
const constants = require('../constants');

// Create index on mongodb
// db.announcements.createIndex({"message":"text"})
/**
 * announcement model
 */
class Announcement {
    // eslint-disable-next-line require-jsdoc
    constructor(message, userId, userStatus) {
        this._id = null;
        this.message = message;
        this.user_id = userId;
        this.status = userStatus;
    }

    /**
     * Create Announcement
     * @returns {Promise<unknown>}
     */
    saveAnnouncement() {
        return new Promise((resolve, reject) => {
            // validate for empty announcement
            if (this.message.toString() === '') {
                // eslint-disable-next-line prefer-promise-reject-errors
                reject('Invalid announcement, please enter the message that you want to send');
            }
            // save new announcement
            const newAnnouncement = new AnnouncementModel({
                message: this.message,
                user_id: this.user_id,
                status: this.status
            });
            newAnnouncement.save()
                .then((result) => {
                    this._id = result.id;
                    resolve(result);
                })
                .catch((err) => {
                    /* istanbul ignore next */
                    reject(err);
                });
        });
    }


    /**
     * Get all the announcements with the username of
     * the user that post the announcement
     * @returns {Promise<unknown>}
     */
    static getAnnouncements(sort_type, limit, isAdmin) {
        return new Promise((resolve, reject) => {
            const populateQuery = {
                path: 'user_id',
                select: '_id username',
                match: {}
            };

            if (!isAdmin) {
                populateQuery['match']['active'] =true;
            }
            AnnouncementModel.find({})
                .populate(populateQuery)
                .sort({
                    created_at: sort_type
                }).limit(parseInt(limit))
                .then((result) => {
                    resolve(result);
                })
                .catch((err) => {
                    /* istanbul ignore next */
                    reject('Error getting Announcements: ' + err.message);
                });
        });
    }

    /**
     * Search announcements by keywords with pagination
     * @param keywords
     * @param index
     * @param sortType
     * @param isAdmin
     * @returns {Promise<unknown>}
     */
    static findAnnouncements(keywords, index, sortType, isAdmin) {
        return new Promise((resolve, reject) => {
            const populateQuery = {
                path: 'user_id',
                select: '_id username',
                match: {}
            };
            if (!isAdmin) {
                populateQuery['match']['active'] =true;
            }
            const totalSkip = index * constants.PAGINATION_NUMBER;
            StopWords.removeStopWords(keywords).then((filteredKeyWords) => {
                console.log('after clean keywords: ' + filteredKeyWords);
                AnnouncementModel.find(
                    {$text: {$search: filteredKeyWords}})
                    .populate(populateQuery)
                    .sort({
                        created_at: sortType
                    })
                    .skip(totalSkip)
                    .limit(constants.PAGINATION_NUMBER)
                    .then((result) => {
                        resolve(result);
                    })
                    .catch(function(err) {
                        /* istanbul ignore next */
                        reject(err);
                    });
            });
        });
    }
}


module.exports = Announcement;
