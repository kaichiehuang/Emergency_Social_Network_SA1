const TestDatabase = require('../services/testDataBase')
const agent = require('superagent')

// Initiate Server
let PORT = 3000;
let HOST = 'http://localhost:' + PORT;

let app = require('../../app').app;
app.set('port', PORT);
let server;

const testDatabase = new TestDatabase();
let token;
let sender_user_id;
let receiver_user_id;
let private_msg;

beforeAll(async () => {
    server = await app.listen(PORT);
    await testDatabase.start();
    const user = {
        username: 'APIUserTest1',
        password:'fakePassword',
        name:'fake name',
        last_name: 'fake last'
    }
    // get token
    await agent.post(HOST + '/api/users')
        .send(user)
        .set('accept', 'json')
        .then(res =>{
            sender_user_id = res.body.user.userId;
        });
    const user2 = {
        username: 'APIUserTest2',
        password:'fakePassword',
        name:'fake name2',
        last_name: 'fake last2'
    }
    await agent.post(HOST + '/api/users')
        .send(user2)
        .set('accept', 'json')
        .then(res =>{
            token = res.body.tokens.token;
            receiver_user_id = res.body.user.userId;
        });
    private_msg = {
        message: 'enjoy today',
        sender_user_id: sender_user_id,
        receiver_user_id: receiver_user_id
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
            .send(private_msg)
            .set('Authorization', token)
            .set('accept', 'json')
            .then(res =>{
                expect(res.body.data.message).toBe('enjoy today')
            })
    })

    test('Should get a list of private msg', async() =>{
        expect.assertions(1);
        await agent.get(HOST + '/api/private-chat-messages')
            .query('sender_user_id=' + sender_user_id)
            .query('receiver_user_id=' + receiver_user_id)
            .accept('application/json')
            .send()
            .set('Authorization', token)
            .set('accept', 'json')
            .then(res =>{
                expect(res.body.length).toBe(1);
            })
    })

    test('Should search a list of private msg', async() =>{
        expect.hasAssertions();
        await agent.get(HOST + '/api/private-chat-messages')
            .query('sender_user_id=' + sender_user_id)
            .query('receiver_user_id=' + receiver_user_id)
            .query('q=enjoy')
            .accept('application/json')
            .send()
            .set('Authorization', token)
            .set('accept', 'json')
            .then(res =>{
                expect(res.body.length).toBe(1);
            })
    })

    test('Should not create a new private msg with an error input msg', async () =>{
        let err_input_private_msg = {
            sender_user_id: sender_user_id,
            receiver_user_id: receiver_user_id
        };
        await agent.post(HOST + '/api/private-chat-messages')
            .send(err_input_private_msg)
            .set('Authorization', token)
            .end((err, res) => {
                expect(err).not.toBe(null);
                expect(res.statusCode).toBe(422);
            })
    })

    test('Should not create a new private msg with an error input sender_user_id', async () =>{
        let err_input_private_msg = {
            message: 'enjoy today',
            receiver_user_id: receiver_user_id
        };
        await agent.post(HOST + '/api/private-chat-messages')
            .send(err_input_private_msg)
            .set('Authorization', token)
            .set('accept', 'json')
            .end((err, res) => {
                expect(err).not.toBe(null);
                expect(res.statusCode).toBe(422);
            })
    })

    test('Should not create a new private msg with an error input receiver_user_id', async () =>{
        let err_input_private_msg = {
            message: 'enjoy today',
            sender_user_id: sender_user_id
        };
        await agent.post(HOST + '/api/private-chat-messages')
            .send(err_input_private_msg)
            .set('Authorization', token)
            .set('accept', 'json')
            .end((err, res) => {
                expect(err).not.toBe(null);
                expect(res.statusCode).toBe(422);
            })
    })

    test('Should not get a list of private msg with an error query', async() =>{
        await agent.get(HOST + '/api/private-chat-messages')
            .query('receiver_user_id=' + receiver_user_id)
            .accept('application/json')
            .send()
            .set('Authorization', token)
            .set('accept', 'json')
            .end((err, res) => {
                expect(err).not.toBe(null);
                expect(res.statusCode).toBe(422);
            })
    })

    test('Should not get a list of private msg with an error query receiver_user_id', async() =>{
        await agent.get(HOST + '/api/private-chat-messages')
            .query('sender_user_id=' + sender_user_id)
            .accept('application/json')
            .send()
            .set('Authorization', token)
            .set('accept', 'json')
            .end((err, res) => {
                expect(err).not.toBe(null);
                expect(res.statusCode).toBe(422);
            })
    })

})
