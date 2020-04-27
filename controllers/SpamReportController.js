const constants = require('../constants');
const SpamReport = require('../model/spamReport');
const ChatMessage = require('../model/chatMessage');
const User = require('../model/user');
const SocketIO = require('../utils/SocketIO.js');

/**
 * spam report controller
 */
class SpamReportController {
    /**
     * Create a spam report
     * @param req
     * @param res
     */
    async createSpamReport(req, res) {
        const requestData = req.body;
        const level = requestData['level'] === 'message' ? constants.MESSAGE_LEVEL_SPAM: constants.USER_LEVEL_SPAM;
        const type = requestData['type'];
        const description = requestData['description'];
        const newReport = new SpamReport(level, type, description);
        if (level === constants.USER_LEVEL_SPAM) {
            await SpamReportController.handleUserlevel(requestData, newReport, res);
        } else {
            await SpamReportController.handleMsgLevel(requestData, newReport, res);
        }
    }

    /**
     * handle user level spam
     * @param requestData
     * @param newReport
     */
    static async handleUserlevel(requestData, newReport, res) {
        const reportedUserId = requestData['reported_user_id'];
        const user = await User.setReportSpam(reportedUserId, requestData['current_user_id']);
        const spamUser = user.spam;
        const spamUserReportedTimes = user.reported_spams.size;
        const report = await newReport.saveSpamReport();
        const spamData ={
            'user': {
                'user_id': reportedUserId,
                'spam': spamUser,
                'number': spamUserReportedTimes
            }
        };
        const socketIO = new SocketIO(res.io);
        socketIO.emitMessage('spam-report-number', spamData);
        res.contentType('application/json');
        res.status(201).send(report);
    };

    /**
     * handle msg level
     * @param requestData
     * @param newReport
     * @param res
     * @returns {Promise<void>}
     */
    static async handleMsgLevel(requestData, newReport, res) {
        const reportMessageId = requestData['message_id'];
        const msg = await ChatMessage.setReportSpam(reportMessageId, requestData['current_user_id']);
        const spamMessage = msg.spam;
        const spamMessageReportedTimes = msg.reported_spams.sizes;
        const report = await newReport.saveSpamReport();
        const spamData = {
            'message': {
                'message_id': reportMessageId,
                'spam': spamMessage,
                'number': spamMessageReportedTimes
            }
        };
        const socketIO = new SocketIO(res.io);
        socketIO.emitMessage('spam-report-number', spamData);
        res.contentType('application/json');
        res.status(201).send(report);
    }
}
module.exports = SpamReportController;
