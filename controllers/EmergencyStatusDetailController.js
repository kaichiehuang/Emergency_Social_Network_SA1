const EmergencyStatusDetail = require('../model/emergencyStatusDetail.js');
const fs = require('fs');

/**
 * emergency status detail controller
 */
class EmergencyStatusDetailController {
    /**
     * get status detail
     * @param req
     * @param res
     */
    getEmergencyStatusDetail(req, res) {
        const userId = req.params.userId;
        EmergencyStatusDetail.getEmergencyStatusDetail(userId)
            .then((statusDetail) => {
                if (statusDetail == null) {
                    const emergencyStatusDetail = new EmergencyStatusDetail(userId);
                    return emergencyStatusDetail.createEmergencyStatusDetail()
                        .then(this.getEmergencyStatusDetail(req, res));
                }
                res.contentType('application/json');
                return res.status(201).send(JSON.stringify(statusDetail));
                /* istanbul ignore next */
            }).catch((err) => {
                return res.status(500).send(err);
            });
    }

    /**
     * update status detail
     * @param req
     * @param res
     */
    updateEmergencyStatusDetail(req, res) {
        const userId = req.params.userId;
        const description = req.body.description;
        const detailType = req.body.detailType;

        EmergencyStatusDetail.updateEmergencyStatusDetail(userId, description, detailType)
            .then((statusDetail) => {
                res.contentType('application/json');
                return res.status(201).send(JSON.stringify(statusDetail));
                /* istanbul ignore next */
            }).catch((err) => {
                return res.status(500).send(err);
            });
    }

    /**
     * get pictures
     * @param req
     * @param res
     */
    getAllPictureAndDescription(req, res) {
        const userId = req.params.userId;

        EmergencyStatusDetail.getAllPictureAndDescription(userId)
            .then((allPicAndDes) => {
                res.contentType('application/json');
                return res.status(201).send(JSON.stringify(allPicAndDes));
                /* istanbul ignore next */
            }).catch((err) => {
                return res.status(500).send(err);
            });
    }

    /**
     * add picture
     * @param req
     * @param res
     */
    addPictureAndDescription(req, res) {
        const userId = req.params.userId;
        const picturePath = req.file.path;
        const pictureName = req.file.filename;
        const pictureDescription = req.body.pictureDescription;

        EmergencyStatusDetail.addPictureAndDescription(userId, picturePath, pictureName, pictureDescription)
            .then((picAndDes) => {
                res.contentType('application/json');
                return res.status(201).send(JSON.stringify(picAndDes));
                /* istanbul ignore next */
            }).catch((err) => {
                return res.status(500).send(err);
            });
    }

    /**
     * update picture description
     * @param req
     * @param res
     */
    updatePictureDescription(req, res) {
        const pictureId = req.params.pictureId;
        const pictureDescription = req.body.pictureDescription;

        EmergencyStatusDetail.updatePictureDescription(pictureId, pictureDescription)
            .then((updatedPicAndDes) => {
                res.contentType('application/json');
                return res.status(201).send(JSON.stringify(updatedPicAndDes));
                /* istanbul ignore next */
            }).catch((err) => {
                return res.status(500).send(err);
            });
    }

    /**
     * remove pricture and desc
     * @param req
     * @param res
     */
    removePictureAndDescription(req, res) {
        const pictureId = req.params.pictureId;
        EmergencyStatusDetail.removePictureAndDescription(pictureId)
            .then((result) => {
                const path = result.picture_path;
                fs.unlink(path, (err) => {
                    /* istanbul ignore next */
                    if (err) {
                        console.error(err);
                    }
                });
                res.contentType('application/json');
                return res.status(201).send(JSON.stringify(result));
                /* istanbul ignore next */
            }).catch((err) => {
                return res.status(500).send(err);
            });
    }
}

module.exports = EmergencyStatusDetailController;
