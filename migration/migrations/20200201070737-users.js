module.exports = {
  async up(db) {
    await db.createCollection('users');
    db.collection('users').insertOne({
      username: "username",
      password: "encrypted password",
      name: "NAME",
      last_name: "family name",
      acknowledgement: false,
      onLine : false
    });
  },

  async down(db) {
    await db.collection('users').deleteMany({});
    await db.collection('users').drop();
  }
};
