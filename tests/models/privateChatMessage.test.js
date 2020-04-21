const TestDatabase = require('../services/testDataBase');
const PrivateChatMessage = require('../../model/privateChatMessage');
const testDatabase = new TestDatabase();
require('../../model/user');

beforeAll(async () => {
    await testDatabase.start();
});

afterAll(async () => {
    await testDatabase.stop();
});

afterEach(async () => {
    await testDatabase.cleanup();
});

describe('principal', () => {
    describe('Creating Private Messages', () => {
        test('Create a new private chat message in the database', async () => {
            const chatMessage = new PrivateChatMessage('This a test message', '507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012');
            await chatMessage.createNewMessage().then((msg) => {
                expect(msg.message).toBe('This a test message');
                expect(String(msg.sender_user_id)).toBe('507f1f77bcf86cd799439011');
            });
        });

    // afterEach(async () => {
    //   await mongoose.connection.db.dropDatabase();
    // });
    });

    describe('Getting Messages', () => {
        let messsageId;
        beforeEach(async () => {
            const chatMessage = new PrivateChatMessage('This a test message', '507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012');
            await chatMessage.createNewMessage().then((msg) => {
                messsageId = msg;
            });
        });

        test('getting private  messages from  the database', async () => {
            const chatMessage = new PrivateChatMessage();
            await chatMessage.getChatMessages(messsageId.sender_user_id, messsageId.receiver_user_id).then( (msg) => {
                return expect(String(msg[0]._id)).toBe(String(messsageId._id));
            });
        });
    });

    describe('Search Messages', () => {
        let messsageId;
        beforeEach(async () => {
            const chatMessage = new PrivateChatMessage('This a test message', '507f1f77bcf86cd799439011', '507f1f77bcf86cd799439012');
            await chatMessage.createNewMessage().then((msg) => {
                messsageId = msg;
            });
        });

        test('getting private  messages from  the database', async () => {
            const chatMessage = new PrivateChatMessage();
            await chatMessage.searchChatMessages(messsageId.sender_user_id, messsageId.receiver_user_id, 'test', 0, 10).then( (msg) => {
                return expect(String(msg[0]._id)).toBe(String(messsageId._id));
            });
        });
    });
});
