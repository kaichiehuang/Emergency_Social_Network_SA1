const constants = require('../constants');
const SpamReport = require('../model/spamReport');
const ChatMessage = require('../model/chatMessage');

class SpamReportController {
    /**
     * Create a spam report
     * @param req
     * @param res
     */
    createSpamReport(req, res) {
        const requestData = req.body;
        const level = requestData['level'] === 'message' ?
            constants.MESSAGE_LEVEL_SPAM: constants.USER_LEVEL_SPAM;
        const type = requestData['type'];
        const description = requestData['description'];
        const newReport = new SpamReport(level, type, description);
        const currentUserId = requestData['current_user_id'];
        const reportedUserId = requestData['reported_user_id'];
        const reportMessageId = requestData['message_id'];
        let spamUser = false;
        let spamMessage = false;

        if (level === constants.USER_LEVEL_SPAM) {
            User.setReportSpam(reportedUserId, currentUserId)
                .then(user => {
                    spamUser = user.spam;
                })
                .then(() => {
                    return newReport.saveSpamReport();
                })
                .then((newReport) => {
                    // emit user count
                    res.contentType('application/json');
                    res.status(201).send(newReport);
                })
                .catch((err) => {
                    return res.status(422).send({
                        'error': err.message
                    });
                });
        } else {
            ChatMessage.setReportSpam(reportMessageId, currentUserId)
                .then(message => {
                    spamMessage = message.spam;
                })
                .then(() => {
                    return newReport.saveSpamReport();
                })
                .then((newReport) => {
                    // emit message count
                    res.contentType('application/json');
                    res.status(201).send(newReport);
                })
                .catch((err) => {
                    return res.status(422).send({
                        'error': err.message
                    });
                });
        }
    }
}
module.exports = SpamReportController;
