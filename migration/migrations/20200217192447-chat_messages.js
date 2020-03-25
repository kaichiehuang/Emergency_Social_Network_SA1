module.exports = {
    async up(db, client) {
        await db.createCollection('chat_messages');
        db.collection('chat_messages').insertOne({
            user_id: 'user_id_in_users',
            message: 'I am Alive!!!',
            status: 'in danger or not'
        });
    },

    async down(db, client) {
        await db.collection('chat_messages').deleteMany({});
        await db.collection('chat_messages').drop();
    }
};
