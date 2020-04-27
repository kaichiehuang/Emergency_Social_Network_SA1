module.exports = {
    async up(db) {
        await db.createCollection('reserved_names');
        const fs = require('fs').promises;
        const data = await fs.readFile('migrations/reserved_username_list.txt', 'utf-8');
        const nameArr = [];
        for (item of data.split('\n')) {
            if (item.length != 1) {
                const words = item.split(' ');
                for (word of words) {
                    nameArr.push({'name': word});
                }
            }
        }
        const collection = db.collection('reserved_names');
        collection.insertMany(nameArr);
    },

    async down(db) {
        await db.collection('reserved_names').deleteMany({});
        await db.collection('reserved_names').drop();
    }
};
