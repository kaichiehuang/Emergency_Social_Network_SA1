const constants = require('../constants');
const SpamReport = require('../model/spamReport');
const ChatMessage = require('../model/chatMessage');
const User = require('../model/user');

class SpamReportController {
    /**
     * Create a spam report
     * @param req
     * @param res
     */
    createSpamReport(req, res) {
        console.log(req.body);
        const requestData = req.body;
        const level = requestData['level'] === 'message' ?
            constants.MESSAGE_LEVEL_SPAM: constants.USER_LEVEL_SPAM;
        const type = requestData['type'];
        const description = requestData['description'];
        const newReport = new SpamReport(level, type, description);
        const currentUserId = requestData['current_user_id'];

        if (level === constants.USER_LEVEL_SPAM) {
            const reportedUserId = requestData['reported_user_id'];
            let spamUser = false;
            let spamUserReportedTimes;
            User.setReportSpam(reportedUserId, currentUserId)
                .then(user => {
                    spamUser = user.spam;
                    spamUserReportedTimes = user.reported_spams.size;
                    return newReport.saveSpamReport();
                })
                .then((newReport) => {
                    res.io.emit('spam-report-number', {
                        'user': {
                            'user_id': reportedUserId,
                            'spam': spamUser,
                            'number': spamUserReportedTimes
                        }
                    });
                    res.contentType('application/json');
                    res.status(201).send(newReport);
                })
                .catch((err) => {
                    console.log('-------' + err);
                    return res.status(422).send({
                        'error': err.message
                    });
                });
        } else {
            const reportMessageId = requestData['message_id'];
            let spamMessage = false;
            let spamMessageReportedTimes;
            ChatMessage.setReportSpam(reportMessageId, currentUserId)
                .then(message => {
                    spamMessage = message.spam;
                    spamMessageReportedTimes = message.reported_spams.size;
                    return newReport.saveSpamReport();
                })
                .then((newReport) => {
                    res.io.emit('spam-report-number', {
                        'message': {
                            'message_id': reportMessageId,
                            'spam': spamMessage,
                            'number': spamMessageReportedTimes
                        }
                    });
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
