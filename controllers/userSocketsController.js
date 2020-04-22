const User = require('../model/user.js');
/**
 * user controller
 */
class UserSocketsController {
    /**
     * [createSocket description]
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    createSocket(req, res) {
        const socketId = req.body.socketId;
        const userId = req.params.userId;
        // 1. Validate if user exists
        User.findUserById(userId).then((user) => {
            return user.insertSocket(socketId);
        }).then((result) => {
            res.contentType('application/json');
            return res.status(201).send(JSON.stringify({'result': true}));
        }).catch((err) => {
            /* istanbul ignore next */
            return res.status(500).send(err);
        });
    }
    /**
     * Delete user sockets
     * @param  {[type]} req [description]
     * @param  {[type]} res [description]
     * @return {[type]}     [description]
     */
    deleteSocket(req, res) {
        const socketId = req.params.socketId;
        const userId = req.params.userId;
        // 1. Validate if user exists
        User.findUserById(userId).then((user) => {
            return user.removeSocket(socketId);
        }).then((result) => {
            res.contentType('application/json');
            return res.status(201).send(JSON.stringify({'result': true}));
        }).catch((err) => {
            /* istanbul ignore next */
            return res.status(500).send(err);
        });
    }
}
module.exports = UserSocketsController;
