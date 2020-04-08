const TestDatabase = require('../services/testDataBase');
const agent = require('superagent');
const ChatMessage = require('../../model/chatMessage');

// Initiate Server
const PORT = 3000;
const HOST = 'http://localhost:' + PORT;

const app = require('../../app').app;
app.set('port', PORT);
let server;

const testDatabase = new TestDatabase();
let token;
let sender_user_id;
let reporter_user_id;
let public_message_id;

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
            sender_user_id = res.body.user.userId;
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
            reporter_user_id = res.body.user.userId;
        });
    const chatMessage = new ChatMessage('This a test message', sender_user_id);
    await chatMessage.createNewMessage().then((msg) => {
        public_message_id = msg._id;
    });
});

afterAll(async () => {
    await testDatabase.cleanup();
    await testDatabase.stop();
    await server.close();
});

describe('create spam report API TEST', () => {
    test('user spam', async () =>{
        let user_spam_msg = {
            'level': 'user',
            'type': 'False',
            'description': 'lala',
            'current_user_id': reporter_user_id,
            'reported_user_id': sender_user_id,
            'message_id': public_message_id
        };
        await agent.post(HOST + '/api/spam-report')
            .send(user_spam_msg)
            .set('Authorization', token)
            .set('accept', 'json')
            .then((res) =>{
                expect(res.body.level).toBe('user');
            });
    });

    test('msg spam', async () =>{
        let msg_spam_msg = {
            'level': 'message',
            'type': 'False',
            'description': 'lala',
            'current_user_id': reporter_user_id,
            'reported_user_id': sender_user_id,
            'message_id': public_message_id
        };
        await agent.post(HOST + '/api/spam-report')
            .send(msg_spam_msg)
            .set('Authorization', token)
            .set('accept', 'json')
            .then((res) =>{
                expect(res.body.level).toBe('message');
            });
    });
});
