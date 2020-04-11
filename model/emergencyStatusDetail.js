const EmergencyStatusDetailModel = require('./model').EmergencyStatusDetailMongo;

class EmergencyStatusDetail {
    constructor(user_id) {
        this._id = null;
        this.user_id = user_id;
        this.status_description = null;
        this.share_location = false;
        
    }

    createEmergencyStatusDetail() {
        return new Promise ((resolve, reject) => {
            const newEmergencyStatusDetail = new EmergencyStatusDetailModel ({
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
         return new Promise((resolve, reject) => {
            const filter = {user_id: userId};
            const update = 
                {
                    status_description: statusDescription,
                    share_location: shareLocation 
                };
            EmergencyStatusDetailModel.findOneAndUpdate(filter, update, {
                new: true
              }).exec().then((updatedStatusDetail) => {
                resolve(updatedStatusDetail);
              }).catch((err)=> {
                  reject(err);
              });

         });
    }

    static addPictureAndDesciption () {

    }

    static updatePictureDescription(pictureId) {

    }




}

module.exports = EmergencyStatusDetail; 