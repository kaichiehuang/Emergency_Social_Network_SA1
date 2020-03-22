const TestDatabase = require('../services/testDataBase')
const agent = require('superagent')

// Initiate Server
let PORT = 3000;
let HOST = 'http://localhost:' + PORT;

let app = require('../../app').app;
app.set('port', PORT);
let server = app.listen(PORT);

const testDatabase = new TestDatabase();


beforeAll(async () => {
    await testDatabase.start();
});

afterAll(async () => {
    await testDatabase.stop();
    await server.close();
});

afterEach(async () => {
    //await testDatabase.cleanup();

});


const user = {
    username: 'APIUserTest',
    password:'fakePassword',
    name:'fake name',
    last_name: 'fake last',
}

describe('API USERS TEST', () => {
    let token;
    test('Should insert  a new user' , async () =>{
        expect.assertions(1);
        await agent.post(HOST + '/api/users')
            .send(user)
            .set('accept', 'json')
            .then(res =>{

                token = res.body.tokens.token;
                expect(res.body.user.username).toBe('APIUserTest')
            })
    })

    test('Should get a list of users' ,async() =>{
        expect.assertions(1);
        await agent.get(HOST + '/api/users')
            .accept('application/json')
            .send()
            .set('Authorization', token)
            .set('accept', 'json')
            .then(res =>{
                console.log("length:" + res.body[0].username);
                expect(res.body.length).toBe(1);
            })
    })


})
