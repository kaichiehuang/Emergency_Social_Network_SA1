const TestDatabase = require('../services/testDataBase');
const agent = require('superagent');

// Initiate Server
const PORT = 3000;
const HOST = 'http://localhost:' + PORT;

const app = require('../../app').app;
app.set('port', PORT);
let server;

const testDatabase = new TestDatabase();
let token;
let senderUserId;
let receiverUserId;
let privateMsg;

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
            receiverUserId = res.body.user.userId;
        });
    privateMsg = {
        message: 'enjoy today',
        sender_user_id: senderUserId,
        receiver_user_id: receiverUserId
    };
});

afterAll(async () => {
    await testDatabase.cleanup();
    await testDatabase.stop();
    await server.close();
});

describe('private chat messages API TEST', () => {
    test('Should create a new private msg', async () =>{
        expect.assertions(1);
        await agent.post(HOST + '/api/private-chat-messages')
            .send(privateMsg)
            .set('Authorization', token)
            .set('accept', 'json')
            .then((res) =>{
                expect(res.body.data.message).toBe('enjoy today');
            });
    });

    test('Should get a list of private msg', async () =>{
        expect.assertions(1);
        await agent.get(HOST + '/api/private-chat-messages')
            .query('sender_user_id=' + senderUserId)
            .query('receiver_user_id=' + receiverUserId)
            .accept('application/json')
            .send()
            .set('Authorization', token)
            .set('accept', 'json')
            .then((res) =>{
                expect(res.body.length).toBe(1);
            });
    });

    test('Should search a list of private msg', async () =>{
        expect.hasAssertions();
        await agent.get(HOST + '/api/private-chat-messages')
            .query('sender_user_id=' + senderUserId)
            .query('receiver_user_id=' + receiverUserId)
            .query('q=enjoy')
            .accept('application/json')
            .send()
            .set('Authorization', token)
            .set('accept', 'json')
            .then((res) =>{
                expect(res.body.length).toBe(1);
            });
    });

    test('Should not create a new private msg with an error input msg', async () =>{
        const errInputPrivateMsg = {
            sender_user_id: senderUserId,
            receiver_user_id: receiverUserId
        };
        await agent.post(HOST + '/api/private-chat-messages')
            .send(errInputPrivateMsg)
            .set('Authorization', token)
            .set('accept', 'json')
            .end((err, res) => {
                expect(err).not.toBe(null);
                expect(res.statusCode).toBe(422);
            });
    });

    test('Should not create a new private msg with an error input sender_user_id', async () =>{
        const errInputPrivateMsg = {
            message: 'enjoy today',
            receiver_user_id: receiverUserId
        };
        await agent.post(HOST + '/api/private-chat-messages')
            .send(errInputPrivateMsg)
            .set('Authorization', token)
            .set('accept', 'json')
            .end((err, res) => {
                expect(err).not.toBe(null);
                expect(res.statusCode).toBe(422);
            });
    });

    test('Should not create a new private msg with an error input receiver_user_id', async () =>{
        const errInputPrivateMsg = {
            message: 'enjoy today',
            sender_user_id: senderUserId
        };
        await agent.post(HOST + '/api/private-chat-messages')
            .send(errInputPrivateMsg)
            .set('Authorization', token)
            .set('accept', 'json')
            .end((err, res) => {
                expect(err).not.toBe(null);
                expect(res.statusCode).toBe(422);
            });
    });

    test('Should not get a list of private msg with an error query', async () =>{
        await agent.get(HOST + '/api/private-chat-messages')
            .query('receiver_user_id=' + receiverUserId)
            .accept('application/json')
            .send()
            .set('Authorization', token)
            .set('accept', 'json')
            .end((err, res) => {
                expect(err).not.toBe(null);
                expect(res.statusCode).toBe(422);
            });
    });

    test('Should not get a list of private msg with an error query receiver_user_id', async () =>{
        await agent.get(HOST + '/api/private-chat-messages')
            .query('sender_user_id=' + senderUserId)
            .accept('application/json')
            .send()
            .set('Authorization', token)
            .set('accept', 'json')
            .end((err, res) => {
                expect(err).not.toBe(null);
                expect(res.statusCode).toBe(422);
            });
    });
});
