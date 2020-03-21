const AnnouncementModel= require('./model').AnnouncementsMongo;
const stopwords = require('n-stopwords')(['en']);

//Number of maximum values returned in the announcement search by keyword
const PAGINATION_NUMBER = 10;

//Create index on mongodb
//db.announcements.createIndex({"message":"text"})

class Announcement{
    constructor(message,user_id,user_status ){
        this._id = null;
        this.message = message;
        this.user_id = user_id;
        this.status = user_status;
    }


    /**
     * Create Announcement
     * @returns {Promise<unknown>}
     */
    saveAnnouncement(){
        return new Promise((resolve, reject) =>{
            //validate for empty announcement
            if( new String(this.announcement) == ""){
                reject("Invalid announcement, please enter the message that you want to send");
            }
            //save new announcement
            let newAnnouncement = new AnnouncementModel({
                message: this.message,
                user_id : this.user_id,
                status : this.status
            });
            newAnnouncement.save()
                .then(result => {
                    this._id = result.id;
                    resolve(newAnnouncement);
                })
                .catch(err =>{
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
        return new Promise((resolve,reject) =>{
            let query = AnnouncementModel.find({})
                .populate("user_id", ["_id", "username"])
                .sort({
                    created_at: sort_type
                }).limit(parseInt(limit))

                query.then(result => {
                    resolve(result);
                })
                .catch(function(err) {
                    console.log("Error getting Announcements: " + err);
                    reject(err);
                });
        })
    }

    /**
     * Search announcements by keywords with pagination
     * @param keywords
     * @returns {Promise<unknown>}
     */
    static findAnnouncements(keywords,index, sort_type){
        return new Promise( (resolve,reject) =>{

            let totalSkip = index * PAGINATION_NUMBER;
            console.log("before clean keywords: " + keywords);
            let filterKeyWords = stopwords.cleanText(keywords);
            console.log("after clean keywords: " + filterKeyWords);

            AnnouncementModel.find(
                {$text: {$search:filterKeyWords}})
                .populate("user_id", ["_id", "username"])
                .sort({
                    created_at: sort_type
                })
                .skip(totalSkip)
                .limit(PAGINATION_NUMBER)
                .then(result => {
                    resolve(result);
                })
                .catch(function(err) {
                    console.log("Error getting Announcements by keyword: " + err);
                    reject(err);
                });
        })
    }

}


module.exports = Announcement
