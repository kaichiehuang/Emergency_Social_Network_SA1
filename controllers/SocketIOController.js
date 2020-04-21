class SocketIOController{
    static socketIO = undefined;

    constructor(io) {
        this.socketIO = io;
    }

    emitMessage(message){
        this.socketIO.emit('new-chat-message', message);
    }


    emitAnnouncement(announcement){
        this.socketIO.emit('new-announcement', {
            'id': announcement._id,
            'message': announcement.message,
            'created_at': announcement.created_at,
        });
    }

    emitSpamReport(spam){
        this.socketIO.emit('spam-report-number', spam);
    }

    emitUserList(){
        this.socketIO.emit('user-list-update')
    }

    emitPrivateChat(socketId,privateMessage){
        this.socketIO.emit('new-private-chat-message',
            privateMessage
        )
    }

    emitLogOutUser(){
        this.socketIO.emit('logout-user');
    }



}
module.exports = SocketIOController