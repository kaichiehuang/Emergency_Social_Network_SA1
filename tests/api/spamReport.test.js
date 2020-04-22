const TestDatabase = require('../services/testDataBase');
const agent = require('superagent');
const ChatMessage = require('../../model/chatMessage');

// Initiate Server
const PORT = 3001;
const HOST = 'http://localhost:' + PORT;

const app = require('../../app').app;
app.set('port', PORT);
let server;

const testDatabase = new TestDatabase();
let token;
let senderUserId;
let reporterUserId;
let publicMessageId;

beforeAll(async () => {
    server = await app.listen(PORT);
    await testDatabase.start();
    const user = {
        username: 'APIUserTest1',
        password: 'fakePassword',
        name: 'fake name',
        last_name: 'fake last'
    };
    // get token
    await agent.post(HOST + '/api/users')
        .send(user)
        .set('accept', 'json')
        .then((res) =>{
            senderUserId = res.body.user.userId;
        });
    const user2 = {
        username: 'APIUserTest2',
        password: 'fakePassword',
        name: 'fake name2',
        last_name: 'fake last2'
    };
    await agent.post(HOST + '/api/users')
        .send(user2)
        .set('accept', 'json')
        .then((res) =>{
            token = res.body.tokens.token;
            reporterUserId = res.body.user.userId;
        });
    const chatMessage = new ChatMessage('This a test message', senderUserId);
    await chatMessage.createNewMessage().then((msg) => {
        publicMessageId = msg._id;
    });
});

afterAll(async () => {
    await testDatabase.cleanup();
    await testDatabase.stop();
    await server.close();
});

describe('create spam report API TEST', () => {
    test('user spam', async () =>{
        const userSpamMsg = {
            'level': 'user',
            'type': 'False',
            'description': 'lala',
            'current_user_id': reporterUserId,
            'reported_user_id': senderUserId,
            'message_id': publicMessageId
        };
        await agent.post(HOST + '/api/spam-report')
            .send(userSpamMsg)
            .set('Authorization', token)
            .set('accept', 'json')
            .then((res) =>{
                expect(res.body.level).toBe('user');
            });
    });

    test('msg spam', async () =>{
        const msgSpamMsg = {
            'level': 'message',
            'type': 'False',
            'description': 'lala',
            'current_user_id': reporterUserId,
            'reported_user_id': senderUserId,
            'message_id': publicMessageId
        };
        await agent.post(HOST + '/api/spam-report')
            .send(msgSpamMsg)
            .set('Authorization', token)
            .set('accept', 'json')
            .then((res) =>{
                expect(res.body.level).toBe('message');
            });
    });
});
