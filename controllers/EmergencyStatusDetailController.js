const EmergencyStatusDetail = require('../model/emergencyStatusDetail.js')
const User = require('../model/user.js');

class EmergencyStatusDetailController {

    getEmergencyStatusDetail(req, res) {
        const userId = req.params.userId;
        EmergencyStatusDetail.getEmergencyStatusDetail(userId)
            .then((statusDetail) => {
                res.contentType('application/json');
                return res.status(201).send(JSON.stringify(statusDetail));
            }).catch((err) => {
                return res.status(500).send(err);
            });
    }

    updateEmergencyStatusDetail(req, res) {
        const userId = req.params.userId;
        const statusDescription = req.body.statusDescription;
        const shareLocation = req.body.shareLocation;
        
        EmergencyStatusDetail.updateEmergencyStatusDetail(userId, statusDescription, shareLocation)
            .then((statusDetail) => {
                res.contentType('application/json');
                return res.status(201).send(JSON.stringify(statusDetail));
            }).catch((err) => {
                return res.status(500).send(err);
            });
    }

    addPictureAndDesciption(req, res) {
        const userId = req.params.userId;

    }

    updatePictureDescription(req, res) {
        const userId = req.params.userId;


    }


}

module.exports = EmergencyStatusDetailController;