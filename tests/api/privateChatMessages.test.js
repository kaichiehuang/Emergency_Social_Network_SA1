const TestDatabase = require('../services/testDataBase')
const agent = require('superagent')

// Initiate Server
let PORT = 3000;
let HOST = 'http://localhost:' + PORT;

let app = require('../../app').app;
app.set('port', PORT);
let server = app.listen(PORT);

const testDatabase = new TestDatabase();
let token;
let sender_user_id;
let receiver_user_id;
let private_msg;

beforeAll(async () => {
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

//TODO full text search
    // test('Should search a list of private msg', async() =>{
    //     expect.assertions(1);
    //     await agent.get(HOST + '/api/private-chat-messages')
    //         .query('sender_user_id=' + sender_user_id)
    //         .query('receiver_user_id=' + receiver_user_id)
    //         .query('q=enjoy')
    //         .accept('application/json')
    //         .send()
    //         .set('Authorization', token)
    //         .set('accept', 'json')
    //         .then(res =>{
    //             expect(res.body.length).toBe(1);
    //         })
    // })
})
