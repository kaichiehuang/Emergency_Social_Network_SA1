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

const user = {
    username: 'APIUserTest',
    password:'fakePassword',
    name:'fake name',
    last_name: 'fake last',
}

describe('API USERS TEST', () => {
    let token;
    let userId;
    test('Should insert  a new user' , async () =>{
        expect.assertions(1);
        await agent.post(HOST + '/api/users')
            .send(user)
            .set('accept', 'json')
            .then(res =>{
                userId = res.body.user.userId;
                token = res.body.tokens.token;
                expect(res.body.user.username).toBe('APIUserTest');
            })
    })


    test('Should not insert  a new user (empty fields)' , async () =>{
        expect.assertions(1);
        const userEmpty = {
            username: 'undefined',
            password:undefined,
            name:'fake name',
            last_name: 'fake last',
        }

        await agent.post(HOST + '/api/users')
            .send(userEmpty)
            .set('accept', 'json')
            .then(res =>{
               console.log(res)
            })
            .catch(error =>{
                expect(error.status).toBe(422);
            });
    })


    test('Should get a list of users' ,async() =>{
        expect.assertions(1);
        await agent.get(HOST + '/api/users')
            .accept('application/json')
            .send()
            .set('Authorization', token)
            .set('accept', 'json')
            .then(res =>{
                expect(res.body.length).toBe(1);
            })
    })


    test('Should get a list of users filtered by keywords' ,async() =>{
        expect.assertions(1);
        await agent.get(HOST + '/api/users')
            .query('username=API')
            .accept('application/json')
            .send()
            .set('Authorization', token)
            .set('accept', 'json')
            .then(res =>{
                console.log(res.body);
                expect(res.body.length).toBe(1);
            })
    })

    test('Should get a list of users filtered by status' ,async() =>{
        expect.assertions(1);
        await agent.get(HOST + '/api/users')
            .query('status=UNDEFINED')
            .accept('application/json')
            .send()
            .set('Authorization', token)
            .set('accept', 'json')
            .then(res =>{
                expect(res.body.length).toBe(1);
            })
    })



    test('Should update user information (acknowledgement)', async() =>{
        expect.assertions(1);
        let userStatus = 'HELP';
        let user = {
            acknowledgement: true,
            onLine: true,
            status: userStatus
        }

        await agent.put(HOST + '/api/users/' + userId)
            //.query(userId)
            .accept('application/json')
            .send(user)
            .set('Authorization', token)
            .set('accept', 'json')
            .then(res =>{
                expect(res.body.user.acknowledgement).toBe(true);
            })
    })


    test('Should update user status', async() =>{
        expect.assertions(1);
        let userStatus = 'HELP';
        let user = {
            status: userStatus
        }

        await agent.put(HOST + '/api/users/' + userId + '/status')
            //.query(userId)
            .accept('application/json')
            .send(user)
            .set('Authorization', token)
            .set('accept', 'json')
            .then(res =>{
                expect(res.body.user.status).toBe(userStatus);
            })
    })



    test('Should return an user', async() => {
        expect.assertions(1);

        await agent.get(HOST + '/api/users/' + userId)
            //.query(userId)
            .accept('application/json')
            .send()
            .set('Authorization', token)
            .set('accept', 'json')
            .then(res =>{
                expect(res.body._id).toBe(userId);
            })
    })



})


describe('Test Users with sockets', () =>{
    let token;
    let userId;

    beforeEach(async () => {
        await agent.post(HOST + '/api/users')
            .send(user)
            .set('accept', 'json')
            .then(res =>{
                userId = res.body.user.userId;
                token = res.body.tokens.token;
                expect(res.body.user.username).toBe('APIUserTest');
            })
    });

    afterEach(async () => {
        await testDatabase.cleanup();

    });

    test('should create relationshio between user and socket',async() => {

        let socket= { socketId : "1"};
        await agent.post(HOST + '/api/users/'+userId+'/socket')
        //.query('userId='+ userId)
        .accept('application/json')
        .send(socket)
        .set('Authorization', token)
        .set('accept', 'json')
        .then(res =>{
            console.log(res.body);
            expect(res.body.sockets).toBeDefined();
        })
    })


    test('should delete relationship between user and socket',async() => {
        let socket= { socketId : "1"};
        await agent.post(HOST + '/api/users/'+userId+'/socket')
            .accept('application/json')
            .send(socket)
            .set('Authorization', token)
            .set('accept', 'json')
            .then(res =>{
                console.log(res.body);
            })

        await agent.delete(HOST + '/api/users/'+userId+'/socket/' + socket.socketId)
            .accept('application/json')
            .send(socket)
            .set('Authorization', token)
            .set('accept', 'json')
            .then(res =>{
                console.log(res.body);
                expect(res.body.sockets.length).toBeUndefined();
            })
    })

})
