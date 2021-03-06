const TestDatabase = require('../services/testDataBase');
const agent = require('superagent');

// Initiate Server
const PORT = 3001;
const HOST = 'http://localhost:' + PORT;

const app = require('../../app').app;
app.set('port', PORT);
const server = app.listen(PORT);

const testDatabase = new TestDatabase();
let token;
let userId;

const user = {
    username: 'fakeUser',
    password: 'fakePassword',
};

beforeAll(async () => {
    await testDatabase.start();

    // get userID
    await agent.post(HOST + '/api/users')
        .send(user)
        .set('accept', 'json')
        .then((res) =>{
            userId = res.body.user.userId;
            token = res.body.tokens.token;
        });


    briefDescription = {
        description: 'This is a brief description',
        detailType: 'situation'
    };

    locationDescription = {
        description: 'This is a location description',
        detailType: 'location'
    };


    // end of before all
});

afterAll(async () => {
    await testDatabase.cleanup();
    await testDatabase.stop();
    await server.close();
});

describe('emergency status detail API test', () => {
    test('User updates emergency status brief description', async () => {
        expect.assertions(1);
        await agent.put(HOST + '/api/emergencyStatusDetail/' + userId)
            .send(briefDescription)
            .set('Authorization', token)
            .set('Accept', 'application/json')
            .then((res) =>{
                expect(res.body.status_description).toBe('This is a brief description');
            });
    });

    test('User updates emergency status location description', async () => {
        expect.assertions(1);
        await agent.put(HOST + '/api/emergencyStatusDetail/' + userId)
            .send(locationDescription)
            .set('Authorization', token)
            .set('Accept', 'application/json')
            .then((res) =>{
                expect(res.body.share_location).toBe('This is a location description');
            });
    });

    test('User gets emergency status brief description', async () => {
        expect.assertions(1);
        await agent.get(HOST + '/api/emergencyStatusDetail/' + userId)
            .send()
            .set('Authorization', token)
            .set('Accept', 'application/json')
            .then((res) =>{
                expect(res.body.status_description).toBe('This is a brief description');
            });
    });

    test('User gets emergency status location description', async () => {
        expect.assertions(1);
        await agent.get(HOST + '/api/emergencyStatusDetail/' + userId)
            .send(locationDescription)
            .set('Authorization', token)
            .set('Accept', 'application/json')
            .then((res) =>{
                expect(res.body.share_location).toBe('This is a location description');
            });
    });
});


describe('picture and description API test', () => {
    let pictureId;
    test('User adds a picture and discription description', async () => {
        expect.assertions(1);
        await agent.post(HOST + '/api/emergencyStatusDetail/' + userId)
            .attach('picture', 'tests/api/testImage/test.jpg')
            .field('pictureDescription', 'picture description')
            .set('Authorization', token)
            .set('Accept', 'application/json')
            .then((res) =>{
                expect(res.body.picture_description).toBe('picture description');
                pictureId = res.body._id;
            });
    });

    test('User gets all picture and description', async () => {
        expect.assertions(1);
        await agent.get(HOST + '/api/emergencyStatusDetail/picture/' + userId)
            .set('Authorization', token)
            .set('Accept', 'application/json')
            .then((res) =>{
                expect(res.body[0].picture_description).toBe('picture description');
            });
    });

    test('User updates description of a picture', async () => {
        expect.assertions(1);
        await agent.put(HOST + '/api/emergencyStatusDetail/picture/' + pictureId)
            .set('Authorization', token)
            .send({'pictureDescription': 'new description'})
            .set('Accept', 'application/json')
            .then((res) =>{
                expect(res.body.picture_description).toBe('new description');
            });
    });

    test('User deletes a picture and description from db', async () => {
        expect.assertions(1);
        await agent.delete(HOST + '/api/emergencyStatusDetail/picture/' + pictureId)
            .set('Authorization', token)
            .set('Accept', 'application/json')
            .then((res) =>{
                expect(res.body.picture_description).toBe('new description');
            });
    });
});
