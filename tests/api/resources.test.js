const TestDatabase = require('../services/testDataBase');
const agent = require('superagent');
const constants = require('../../constants');
const pictureTest = './tests/resources/photo_resources_test.png';


// Initiate Server
const PORT = 3001;
const HOST = 'http://localhost:' + PORT;

const app = require('../../app').app;
app.set('port', PORT);
const server = app.listen(PORT);

const testDatabase = new TestDatabase();


const user = {
    username: 'APIUserTest',
    password: 'fakePassword',
    name: 'fake name',
    last_name: 'fake last',
};

let token;
let userId;

afterEach(async () => {
    await testDatabase.cleanup();
});

afterAll(async () => {
    await testDatabase.cleanup();
    await testDatabase.stop();
    await server.close();
});


beforeEach(async () => {
    // get token
    await agent.post(HOST + '/api/users')
        .send(user)
        .set('accept', 'json')
        .then((res) =>{
            token = res.body.tokens.token;
            userId = res.body.user.userId;
        });

    console.log('token: ' + token);
    console.log('userId: ' + userId);
});


beforeAll(async () => {
    await testDatabase.start();
});


describe('Testing Resource creeation  API', () =>{
    test('Should create a resource with picture', async () =>{
        expect.assertions(1);

        // var fileStr = imgFile.toString('base64')
        const resource = {
            user_id: userId,
            resourceType: constants.RESOURCE_MEDICAL,
            name: 'resource name',
            location: 'resource location',
            description: 'resource description',
            questionOne: true,
            questionTwo: true,
            questionThree: true,
            // image:imgFile,
            contentType: 'image/png'};

        await agent.post(HOST +'/api/resources')
            .field(resource)
            .attach('resourceImage', pictureTest)
            // .send(resource)
            .set('Authorization', token)
            // .set('accept', 'json')
            .then((res) =>{
                return expect(res.body.name).toBe('resource name');
            });
    });

    test('Should create a resource without picture', async () =>{
        expect.assertions(1);

        // var fileStr = imgFile.toString('base64')
        const resource = {
            user_id: userId,
            resourceType: constants.RESOURCE_MEDICAL,
            name: 'without picture',
            location: 'resource location',
            description: 'resource description',
            questionOne: true,
            questionTwo: true,
            questionThree: true,
            // image:imgFile,
            contentType: 'image/png'};

        await agent.post(HOST +'/api/resources')
            .field(resource)
            // .attach('resourceImage', pictureTest)
            // .send(resource)
            .set('Authorization', token)
            // .set('accept', 'json')
            .then((res) =>{
                return expect(res.body.name).toBe('without picture');
            });
    });
});


describe('Testing searching Resources  API', () =>{
    let resourceId;
    beforeEach(async ()=>{
        let resource = {
            user_id: userId,
            resourceType: constants.RESOURCE_MEDICAL,
            name: 'resource name',
            location: 'resource location',
            description: 'resource description',
            questionOne: true,
            questionTwo: true,
            questionThree: true,
            // image:imgFile,
            // contentType:'image/png'
        };

        await agent.post(HOST +'/api/resources')
            .field(resource)
            .attach('resourceImage', pictureTest)
            .set('Authorization', token)
            .set('accept', 'json')
            .then((res) =>{
                return resourceId = res.body._id;
            });


        // Second resource created
        resource = {
            user_id: userId,
            resourceType: constants.RESOURCE_SHELTER,
            name: 'resource name 2',
            location: 'resource location 2',
            description: 'resource description 2',
            questionOne: true,
            questionTwo: false,
            questionThree: true,
            // image:imgFile,
            // contentType:'image/png'
        };

        await agent.post(HOST +'/api/resources')
            .field(resource)
            .attach('resourceImage', pictureTest)
            .set('Authorization', token)
            .set('accept', 'json')
            .then((res) =>{
                console.log('second resource created');
            });
    });


    test('Should return one specific resource', async () =>{
        expect.assertions(1);
        await agent.get(HOST +'/api/resources/' + resourceId)
            .accept('application/json')
            .send()
            .set('Authorization', token)
            .set('accept', 'json')
            .then((res) =>{
                expect(res.body.name).toBe('resource name');
            });
    });

    test('Should return all resource', async () =>{
        expect.assertions(1);
        await agent.get(HOST +'/api/resources/')
            .accept('application/json')
            .send()
            .set('Authorization', token)
            .set('accept', 'json')
            .then((res) =>{
                expect(res.body.length).toBe(2);
            });
    });
});

