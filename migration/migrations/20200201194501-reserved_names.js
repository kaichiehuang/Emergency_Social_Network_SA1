module.exports = {
    //TODO Bo will learn promise and await
    async up(db) {
        db.createCollection('reserved_names');
        const fs = require('fs');
        console.log(fs);
        fs.readFile('migrations/reserved_username_list.txt', 'utf-8',function read(err, data) {
            console.log(data);
            const name_arr = [];
            for (item of data.split('\n')) {
                if (item.length != 1) {
                    var words = item.split(' ');
                    for (word of words) {
                        name_arr.push({
                            'name': word
                        });
                    }
                }
            }
            const collection = db.collection('reserved_names');
            collection.insertMany(name_arr);
        });
    },
    async down(db) {
        await db.collection('reserved_names').deleteMany({});
        await db.collection('reserved_names').drop();
    }
};