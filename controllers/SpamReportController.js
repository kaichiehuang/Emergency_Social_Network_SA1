const constants = require('../constants');
const SpamReport = require('../model/spamReport');

class SpamReportController {
    /**
     * Create a spam report
     * @param req
     * @param res
     */
    createSpamReport(req, res) {
        let requestData = req.body;
        let level = requestData['level'] === 'message' ?
            constants.MESSAGE_LEVEL_SPAM: constants.USER_LEVEL_SPAM;
        let type = requestData['type'];
        let description = requestData['description'];
        let newReport = new SpamReport(level, type, description);

        newReport.saveSpamReport().then((newReport) => {
            res.contentType('application/json');
            res.status(201).send(newReport);
        }).catch((err) => {
            return res.status(422).send({
                'error': err.message
            });
        });
    }
}
module.exports = SpamReportController;
