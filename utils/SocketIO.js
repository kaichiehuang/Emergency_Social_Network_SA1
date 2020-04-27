/**
 * socket io
 */
class SocketIO {
    // eslint-disable-next-line require-jsdoc
    constructor(io) {
        this.socketIO = io;
    }

    /**
     * emit message
     * @param emitEvent
     * @param message
     */
    emitMessage(emitEvent, message, socketId) {
        if (socketId == undefined) {
            this.socketIO.emit(emitEvent, message);
        } else {
            this.socketIO.to(socketId).emit(emitEvent, message);
        }
    }
}

module.exports = SocketIO;
