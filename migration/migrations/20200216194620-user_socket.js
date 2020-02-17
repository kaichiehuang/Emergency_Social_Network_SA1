module.exports = {
  async up(db, client) {
    await db.createCollection('user_socket');
    db.collection('user_socket').insertOne({
      user_id: "user_id",
      socket_id: "socket_id"
    });
  },

  async down(db, client) {
    await db.collection('user_socket').deleteMany({});
    await db.collection('user_socket').drop();
  }
};
