const TestDatabase = require('../services/testDataBase')
const agent = require('superagent')

// Initiate Server
let PORT = 3000;
let HOST = 'http://localhost:' + PORT;

let app = require('../../app').app;
app.set('port', PORT);
let server = app.listen(PORT);

const testDatabase = new TestDatabase();
let token1;
let token2;
let token3;
let user1Id;
let user2Id;
let user3Id
let publicMessage;

beforeAll(async () => {
    await testDatabase.start();

    const user1 = {
        username: 'fakeUser1',
        password:'fakePassword1',
    };
    //get userID for user1
    await agent.post(HOST + '/api/users')
        .send(user1)
        .set('accept', 'json')
        .then(res =>{
            user1Id = res.body.user.userId;
            token1 = res.body.tokens.token;
            console.log(user1Id);
            console.log(token1);
        });
   

    const user2 = {
        username: 'fakeUser2',
        password:'fakePassword2',
    };
    //get userID for user2
    await agent.post(HOST + '/api/users')
    .send(user2)
    .set('accept', 'json')
    .then(res =>{
        user2Id = res.body.user.userId;
        token2 = res.body.tokens.token;
    });

    const user3 = {
        username: 'fakeUser3',
        password:'fakePassword3',
    };
    //get userID for user3
    await agent.post(HOST + '/api/users')
    .send(user3)
    .set('accept', 'json')
    .then(res =>{
        user3Id = res.body.user.userId;
        token3 = res.body.tokens.token;
    });

    publicMessage = {
        message: "This is a public message",
        user_id: user1Id
    };

    //end of before all
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
            .then(res =>{
                //console.log(JSON.parse(res.text).data.message);
                //console.log(res.text);
                //console.log("fuckfuckfuck");
                //expect(res.body.data.message).toBe('This is a public message');
                expect(JSON.parse(res.text).data.message).toBe('This is a public message');
            });
        });

    test('User1 receive public message', async() =>{
        expect.assertions(1);
        await agent.get(HOST + '/api/chat-messages')
            .accept('application/json')
            .send()
            .set('Authorization', token1)
            .set('accept', 'json')
            .then(res =>{
                //console.log(res.body);
                expect(res.body[0].message).toBe('This is a public message');
            })
        });
    
    test('User2 receive public message', async() =>{
        expect.assertions(1);
        await agent.get(HOST + '/api/chat-messages')
            .accept('application/json')
            .send()
            .set('Authorization', token2)
            .set('accept', 'json')
            .then(res =>{
                expect(res.body[0].message).toBe('This is a public message');
            })
        });

    test('User3 receive public message', async() =>{
        expect.assertions(1);
        await agent.get(HOST + '/api/chat-messages')
            .accept('application/json')
            .send()
            .set('Authorization', token3)
            .set('accept', 'json')
            .then(res =>{
                expect(res.body[0].message).toBe('This is a public message');
            })
        });


//end of describe    
});