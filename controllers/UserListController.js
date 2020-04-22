const SocketIO = require('../utils/SocketIO.js');

class UserListController {
    /* istanbul ignore next */
    updateUserList(req, res) {
        const socketIO = new SocketIO(res.io);
        socketIO.emitMessage('user-list-update', '');
        res.status(201).send('Updating Users Lists');
    }
}
module.exports = UserListController;
