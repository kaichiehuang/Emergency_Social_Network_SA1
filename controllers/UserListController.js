const SocketIOController = require('../controllers/SocketIOController.js');

class UserListController {
    /* istanbul ignore next */
    updateUserList(req, res) {
        const socketIO = new SocketIOController(res.io);
        socketIO.emitUserList();
        // res.io.emit('user-list-update');
        // res.status(201).send("Updating Users Lists");
    }
}
module.exports = UserListController;
