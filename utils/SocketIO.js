class SocketIO {
    constructor(io) {
        this.socketIO = io;
    }
    emitMessage(emitEvent, message) {
        console.log("Emiting event:" + emitEvent);
        this.socketIO.emit(emitEvent, message);
    }
}

module.exports = SocketIO;
