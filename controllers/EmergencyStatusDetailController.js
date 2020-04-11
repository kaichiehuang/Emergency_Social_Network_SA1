const EmergencyStatusDetail = require('../model/emergencyStatusDetail.js')

const User = require('../model/user.js');

class EmergencyStatusDetailController {

    getEmergencyStatusDetail(req, res) {
        console.log("I am here!");
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

    addPictureAndDescription(req, res) {
        console.log(req.file);
        const userId = req.params.userId;
        const picturePath = req.file.path;
        const pictureName = req.file.filename;
        const pictureDescription = req.body.pictureDescription;

        EmergencyStatusDetail.addPictureAndDescription(userId, picturePath, pictureName, pictureDescription)
            .then((picAndDes) => {
                res.contentType('application/json');
                return res.status(201).send(JSON.stringify(picAndDes));
            }).catch((err) => {
                return res.status(500).send(err);
            });

    }

    updatePictureDescription(req, res) {
        const pictureId = req.params.pictureId;
        const pictureDescription = req.body.pictureDescription;
        
        EmergencyStatusDetail.updatePictureDescription(pictureId, pictureDescription)
            .then((updatedPicAndDes) => {
                res.contentType('application/json');
                return res.status(201).send(JSON.stringify(updatedPicAndDes));
            }).catch((err) => {
                return res.status(500).send(err);
            });
    }

    removePictureAndDescription(req, res) {
        const pictureId = req.params.pictureId;
        EmergencyStatusDetail.removePictureAndDescription(pictureId)
            .then((result) => {
                res.contentType('application/json');
                return res.status(201).send(JSON.stringify(result));
            }).catch((err) => {
                return res.status(500).send(err);
            });
    }


}

module.exports = EmergencyStatusDetailController;