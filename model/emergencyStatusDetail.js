const EmergencyStatusDetailModel = require('./model').EmergencyStatusDetailMongo;

class EmergencyStatusDetail {
    constructor(user_id) {
        this._id = null;
        this.user_id = user_id;
        this.statusDescription = null;
        this.shareLocation = false;
        
    }

    createEmergencyStatusDetail() {
        return new Promise ((resolve, reject) => {
            const newEmergencyStatusDetail = new EmergencyStatusDetailModel ({
                user_id: this.user_id,
                statusDescription: this.statusDescription,
                shareLocation: this.shareLocation,
                
            });
            newEmergencyStatusDetail.save()
                .then((result) => {
                    console.log('initial emergency detail created');
                    this.id = result.id;
                    resolve(newEmergencyStatusDetail);
                })
                .catch(function(err) {
                    console.log('initial emergency detail creation failed');
                    console.log(err);
                    reject(err);
                });
        });
    }

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

    static updateEmergencyStatusDetail(userId, statusDescription, shareLocation) {
         
    }

    static addPictureAndDesciption () {

    }

    static updatePictureDescription(pictureId) {

    }




}

module.exports = EmergencyStatusDetail; 