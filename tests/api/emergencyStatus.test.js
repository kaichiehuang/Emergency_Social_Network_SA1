const TestDatabase = require("../services/testDataBase");
const agent = require('superagent')
const express = require('express');
let exp = express()

// Initiate Server
let PORT = 3000;
let HOST = 'http://localhost:' + PORT;

let app = require('../../app').app;
app.set('port', PORT);
let server = app.listen(PORT);

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
            console.log(userId);
            console.log(token);
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
                //console.log(res);
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
                //console.log(res);
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
                //console.log(res);
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
                //console.log(res);
                expect(res.body.share_location).toBe('This is a location description');
            });
    });



// end of describe
});


// describe('picture and description API test', () => {
//     exp.use(express.static('tests'));

//     let pictureId;
//     test('User adds a picture and discription description', async () => {
//         expect.assertions(1);
//         await agent.post(HOST + '/api/emergencyStatusDetail/' + userId)
//             .attach('image1', 'tests/api/testImage/test.jpg')
//             .field("pictureDescription", "picture description")
//             .then((res) =>{
//                 //console.log(res);
//                 expect(res.picture_path).toBe('tests/api/testImage/test.jpg');
//                 expect(res.picture_description).toBe('picture description');
//                 pictureId = res._id;
//             });
//     });


// // end of describe
// });
    