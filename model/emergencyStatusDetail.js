const EmergencyStatusDetailModel = require('./model').EmergencyStatusDetailMongo;
const PictureAndDescriptionModel = require('./model').PictureAndDescriptionMongo;

/**
 * emergency status detail
 */
class EmergencyStatusDetail {
    // eslint-disable-next-line require-jsdoc
    constructor(userId) {
        this._id = null;
        this.user_id = userId;
        this.status_description = null;
        this.share_location = null;
    }

    /**
     * create status
     * @returns {Promise<unknown>}
     */
    createEmergencyStatusDetail() {
        return new Promise((resolve, reject) => {
            const newEmergencyStatusDetail = new EmergencyStatusDetailModel({
                user_id: this.user_id,
                status_description: this.status_description,
                share_location: this.share_location,

            });
            newEmergencyStatusDetail.save()
                .then((result) => {
                    console.log('initial emergency detail created');
                    this.id = result.id;
                    resolve(newEmergencyStatusDetail);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    /**
     * get status detail
     * @param userId
     * @returns {Promise<unknown>}
     */
    static getEmergencyStatusDetail(userId) {
        return new Promise((resolve, reject) => {
            EmergencyStatusDetailModel.findOne({
                user_id: userId
            }).exec().then((statusDetail) => {
                resolve(statusDetail);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    /**
     * udpate emergency status
     * @param userId
     * @param description
     * @param type
     * @returns {Promise<unknown>}
     */
    static updateEmergencyStatusDetail(userId, description, type) {
        return new Promise((resolve, reject) => {
            const filter = {user_id: userId};
            let update;
            if (type === 'situation') {
                update = {status_description: description};
            } else {
                update = {share_location: description};
            }
            EmergencyStatusDetailModel.findOneAndUpdate(filter, update, {
                new: true
            }).exec().then((updatedStatusDetail) => {
                resolve(updatedStatusDetail);
            }).catch((err)=> {
                reject(err);
            });
        });
    }

    /**
     * get all picture
     * @param userId
     * @returns {Promise<unknown>}
     */
    static getAllPictureAndDescription(userId) {
        return new Promise((resolve, reject) => {
            PictureAndDescriptionModel.find({user_id: userId})
                .then((result) => {
                    console.log('find all picture and description successful');
                    this.id = result.id;
                    resolve(result);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    /**
     * add picture
     * @param userId
     * @param picturePath
     * @param pictureName
     * @param pictureDescription
     * @returns {Promise<unknown>}
     */
    static addPictureAndDescription(userId, picturePath, pictureName, pictureDescription) {
        return new Promise((resolve, reject) => {
            const newPictureAndDescription = new PictureAndDescriptionModel({
                user_id: userId,
                picture_description: pictureDescription,
                picture_path: picturePath,
                picture_name: pictureName
            });
            newPictureAndDescription.save()
                .then((result) => {
                    console.log('add picture and description successful');
                    this.id = result.id;
                    resolve(newPictureAndDescription);
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

    /**
     * update picture
     * @param pictureId
     * @param pictureDiscription
     * @returns {Promise<unknown>}
     */
    static updatePictureDescription(pictureId, pictureDiscription) {
        return new Promise((resolve, reject) => {
            const update = {picture_description: pictureDiscription};
            PictureAndDescriptionModel.findByIdAndUpdate(pictureId, update, {
                new: true
            }).exec().then((updatedStatusDetail) => {
                resolve(updatedStatusDetail);
            }).catch((err)=> {
                reject(err);
            });
        });
    }

    /**
     * remove picture
     * @param pictureId
     * @returns {Promise<unknown>}
     */
    static removePictureAndDescription(pictureId) {
        return new Promise((resolve, reject) => {
            PictureAndDescriptionModel.findByIdAndRemove(pictureId)
                .exec().then((result) => {
                    resolve(result);
                }).catch((err)=> {
                    reject(err);
                });
        });
    }
}

module.exports = EmergencyStatusDetail;
