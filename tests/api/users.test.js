const TestDatabase = require('../services/testDataBase');
const agent = require('superagent');

// Initiate Server
const PORT = 3001;
const HOST = 'http://localhost:' + PORT;

const app = require('../../app').app;
app.set('port', PORT);
const server = app.listen(PORT);

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
    password: 'fakePassword',
    name: 'fake name',
    last_name: 'fake last',
};

describe('API USERS TEST', () => {
    let token;
    let userId;
    test('Should insert  a new user', async () =>{
        expect.assertions(1);
        await agent.post(HOST + '/api/users')
            .send(user)
            .set('accept', 'json')
            .then((res) =>{
                userId = res.body.user._id;
                token = res.body.tokens.token;
                expect(res.body.user.username).toBe('APIUserTest');
            });
    });


    test('Should not insert  a new user (empty fields)', async () =>{
        expect.assertions(1);
        const userEmpty = {
            username: 'undefined',
            password: undefined,
        };

        await agent.post(HOST + '/api/users')
            .send(userEmpty)
            .set('accept', 'json')
            .then((res) =>{
            })
            .catch((error) =>{
                expect(error.status).toBe(422);
            });
    });


    test('Should get a list of users', async () =>{
        expect.assertions(1);
        await agent.get(HOST + '/api/users')
            .accept('application/json')
            .send()
            .set('Authorization', token)
            .set('accept', 'json')
            .then((res) =>{
                expect(res.body.length).toBe(1);
            });
    });


    test('Should get a list of users filtered by keywords', async () =>{
        expect.assertions(1);
        await agent.get(HOST + '/api/users')
            .query('username=API')
            .accept('application/json')
            .send()
            .set('Authorization', token)
            .set('accept', 'json')
            .then((res) =>{
                expect(res.body.length).toBe(1);
            });
    });

    test('Should get a list of users filtered by status', async () =>{
        expect.assertions(1);
        await agent.get(HOST + '/api/users')
            .query('status=UNDEFINED')
            .accept('application/json')
            .send()
            .set('Authorization', token)
            .set('accept', 'json')
            .then((res) =>{
                expect(res.body.length).toBe(1);
            });
    });


    test('Should update user information (acknowledgement)', async () =>{
        expect.assertions(1);
        const userStatus = 'HELP';
        const user = {
            acknowledgement: true,
            onLine: true,
            status: userStatus
        };

        await agent.put(HOST + '/api/users/' + userId)
            // .query(userId)
            .accept('application/json')
            .send(user)
            .set('Authorization', token)
            .set('accept', 'json')
            .then((res) =>{
                expect(res.body.acknowledgement).toBe(true);
            });
    });


    test('Should update user status', async () =>{
        expect.assertions(1);
        const userStatus = 'HELP';
        const user = {
            status: userStatus
        };

        await agent.put(HOST + '/api/users/' + userId + '/status')
            // .query(userId)
            .accept('application/json')
            .send(user)
            .set('Authorization', token)
            .set('accept', 'json')
            .then((res) =>{
                expect(res.body.status).toBe(userStatus);
            });
    });


    test('Should return an user', async () => {
        expect.assertions(1);

        await agent.get(HOST + '/api/users/' + userId)
            // .query(userId)
            .accept('application/json')
            .send()
            .set('Authorization', token)
            .set('accept', 'json')
            .then((res) =>{
                expect(res.body._id).toBe(userId);
            });
    });
});


describe('Test Users with sockets', () =>{
    let token;
    let userId;

    beforeEach(async () => {
        await agent.post(HOST + '/api/users')
            .send(user)
            .set('accept', 'json')
            .then((res) =>{
                userId = res.body.user._id;
                token = res.body.tokens.token;
                expect(res.body.user.username).toBe('APIUserTest');
            });
    });

    afterEach(async () => {
        await testDatabase.cleanup();
    });

    test('should create relationship between user and socket', async () => {
        const socket= {socketId: '1'};
        await agent.post(HOST + '/api/users/'+userId+'/sockets')
        // .query('userId='+ userId)
            .accept('application/json')
            .send(socket)
            .set('Authorization', token)
            .set('accept', 'json')
            .then((res) =>{
                expect(res.body.result).toBe(true);
            });
    });


    test('should delete relationship between user and socket', async () => {
        const socket= {socketId: '1'};
        await agent.post(HOST + '/api/users/'+userId+'/sockets')
            .accept('application/json')
            .send(socket)
            .set('Authorization', token)
            .set('accept', 'json')
            .then((res) =>{
            });

        await agent.delete(HOST + '/api/users/'+userId+'/sockets/' + socket.socketId)
            .accept('application/json')
            .send(socket)
            .set('Authorization', token)
            .set('accept', 'json')
            .then((res) =>{
                expect(res.body.result).toBe(true);
            });
    });
});
