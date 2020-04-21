const TestDatabase = require('../services/testDataBase');
const ChatMessage = require('../../model/chatMessage');
const testDatabase = new TestDatabase();

beforeAll(async () => {
    await testDatabase.start();
});

afterAll(async () => {
    await testDatabase.stop();
});

afterEach(async () => {
    await testDatabase.cleanup();
});


describe('Create Messages', () => {
    test('Create a new message in the database', async () => {
        const chatMessage = new ChatMessage('This a test message', '507f1f77bcf86cd799439011');
        await chatMessage.createNewMessage().then((msg) => {
            expect(msg.message).toBe('This a test message');
            expect(String(msg.user_id)).toBe('507f1f77bcf86cd799439011');
        });
    });
});


describe('Getting Messages', () => {
    let messsageId;
    beforeEach( async () => {
        const chatMessage = new ChatMessage('This a test message', '507f1f77bcf86cd799439011');
        await chatMessage.createNewMessage().then((msg) => {
            messsageId = String(msg._id);
        });
    });

    test('getting messages from  the database', async () => {
        const chatMessage = new ChatMessage();
        await chatMessage.getChatMessages().then((msg) => {
            expect(String(msg[0]._id)).toBe(messsageId);
        });
    });

    test('find messages by normal keyword', async () => {
        await ChatMessage.findMessagesByKeyword('test').then((msg) => {
            expect(String(msg[0]._id)).toBe(messsageId);
        });
    });

    test('find messages by stop-word', async () => {
        await ChatMessage.findMessagesByKeyword('a').then((msg) => {
            expect(msg.length).toBe(0);
        });
    });

    test('find messages by id', async () => {
        await ChatMessage.findMessageById(messsageId).then((msg) => {
            expect(String(msg.message)).toBe('This a test message');
        });
    });

    test('set msg spam', async () => {
        const usrReporterId = '12345';
        await ChatMessage.setReportSpam(messsageId, usrReporterId).then((msg) => {
            return expect(msg.reported_spams.get(usrReporterId)).toBe(true);
        });
    });
});


