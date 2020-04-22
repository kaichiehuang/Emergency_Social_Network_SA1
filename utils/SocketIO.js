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
    emitMessage(emitEvent, message) {
        console.log('Emiting event:' + emitEvent);
        this.socketIO.emit(emitEvent, message);
    }
}

module.exports = SocketIO;
