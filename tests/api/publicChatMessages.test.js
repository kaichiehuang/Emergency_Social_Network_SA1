const TestDatabase = require('../services/testDataBase');
const agent = require('superagent');

// Initiate Server
const PORT = 3000;
const HOST = 'http://localhost:' + PORT;

const app = require('../../app').app;
app.set('port', PORT);
const server = app.listen(PORT);

const testDatabase = new TestDatabase();
let token1;
let token2;
let token3;
let user1Id;
let publicMessage;

beforeAll(async () => {
    await testDatabase.start();

    const user1 = {
        username: 'fakeUser1',
        password: 'fakePassword1',
    };
    // get userID for user1
    await agent.post(HOST + '/api/users')
        .send(user1)
        .set('accept', 'json')
        .then((res) =>{
            user1Id = res.body.user.userId;
            token1 = res.body.tokens.token;
        });


    const user2 = {
        username: 'fakeUser2',
        password: 'fakePassword2',
    };
    // get userID for user2
    await agent.post(HOST + '/api/users')
        .send(user2)
        .set('accept', 'json')
        .then((res) =>{
            user2Id = res.body.user.userId;
            token2 = res.body.tokens.token;
        });

    const user3 = {
        username: 'fakeUser3',
        password: 'fakePassword3',
    };
    // get userID for user3
    await agent.post(HOST + '/api/users')
        .send(user3)
        .set('accept', 'json')
        .then((res) =>{
            user3Id = res.body.user.userId;
            token3 = res.body.tokens.token;
        });

    publicMessage = {
        message: 'This is a public message',
        user_id: user1Id
    };

    // end of before all
});

afterAll(async () => {
    await testDatabase.cleanup();
    await testDatabase.stop();
    await server.close();
});

describe('public chat messages API test', () => {
    test('User1 create a new public message', async () => {
        expect.assertions(1);
        await agent.post(HOST + '/api/chat-messages')
            .send(publicMessage)
            .set('Authorization', token1)
            .set('Accept', 'application/json')
            .then((res) =>{
                expect(JSON.parse(res.text).data.message).toBe('This is a public message');
            });
    });

    test('User1 create a new public message with error', async () => {
        wrongPublicMessage = {
            message: 'This is a public message'
        };
        await agent.post(HOST + '/api/chat-messages')
            .send(wrongPublicMessage)
            .set('Authorization', token1)
            .set('Accept', 'application/json')
            .end((err, res) => {
                expect(err).not.toBe(null);
                expect(res.statusCode).toBe(422);
            });
    });

    test('User1 create a new public message with user id error', async () => {
        wrongPublicMessage = {
            user_id: user1Id
        };
        await agent.post(HOST + '/api/chat-messages')
            .send(wrongPublicMessage)
            .set('Authorization', token1)
            .set('Accept', 'application/json')
            .end((err, res) => {
                expect(err).not.toBe(null);
                expect(res.statusCode).toBe(422);
            });
    });

    test('User1 receive public message', async () =>{
        await agent.get(HOST + '/api/chat-messages')
            .accept('application/json')
            .send()
            .set('Authorization', token1)
            .set('accept', 'json')
            .then((res) =>{
                expect(res.body[0].message).toBe('This is a public message');
            });
    });

    test('User2 receive public message', async () =>{
        expect.assertions(1);
        await agent.get(HOST + '/api/chat-messages')
            .accept('application/json')
            .send()
            .set('Authorization', token2)
            .set('accept', 'json')
            .then((res) =>{
                expect(res.body[0].message).toBe('This is a public message');
            });
    });

    test('User3 receive public message', async () =>{
        expect.assertions(1);
        await agent.get(HOST + '/api/chat-messages')
            .accept('application/json')
            .send()
            .set('Authorization', token3)
            .set('accept', 'json')
            .then((res) =>{
                expect(res.body[0].message).toBe('This is a public message');
            });
    });

    test('User2 search with keyword', async () =>{
        expect.assertions(1);
        await agent.get(HOST + '/api/chat-messages')
            .accept('application/json')
            .query({q: 'public'})
            .query({page: 0})
            .send()
            .set('Authorization', token2)
            .set('accept', 'json')
            .then((res) =>{
                expect(res.body[0].message).toBe('This is a public message');
            });
    });

    test('User3 search with stop-word keyword', async () =>{
        expect.assertions(1);
        await agent.get(HOST + '/api/chat-messages')
            .accept('application/json')
            .query({q: 'a'})
            .query({page: 0})
            .send()
            .set('Authorization', token3)
            .set('accept', 'json')
            .then((res) =>{
                expect(res.body.length).toBe(0);
            });
    });

// end of describe
});
