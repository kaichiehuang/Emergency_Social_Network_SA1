const TestDatabase = require("../services/testDataBase");
const agent = require('superagent')



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
    username: 'APIUserTest',
    password:'fakePassword',
    name:'fake name',
    last_name: 'fake last',
}





beforeAll(async () => {
    await testDatabase.start();

    // get token
    await agent.post(HOST + '/api/users')
        .send(user)
        .set('accept', 'json')
        .then(res =>{
            token = res.body.tokens.token;
            userId = res.body.user.userId;
        });

    console.log("token: " + token);
    console.log("userId: " + userId);


    let announcement = {
        message: 'new announcement integration tests',
        user_id: userId,
    }

    let announcementTwo = {
        message: 'new announcement filtered integration tests',
        user_id: userId,
    }

    await agent.post(HOST +"/api/announcements")
        .send(announcement)
        .set('Authorization', token)
        .set('accept', 'json')
        .then()

    await agent.post(HOST +"/api/announcements")
        .send(announcementTwo)
        .set('Authorization', token)
        .set('accept', 'json')
        .then()


});

afterAll(async () => {
    await testDatabase.cleanup();
    await testDatabase.stop();
    await server.close();
});


describe("Create Announcement API", () =>{

    test('Should create an announcement', async() =>{
        expect.assertions(1);

        let announcement = {
            message: 'new announcement',
            user_id: userId,
        }

        await agent.post(HOST +"/api/announcements")
            .send(announcement)
            .set('Authorization', token)
            .set('accept', 'json')
            .then(res =>{
                 return expect(res.body.message).toBe('new announcement');
            })
    })
})


describe("Get Announcement API", () =>{
    test('Should get all the announcement', async() =>{
        expect.assertions(1);
        await agent.get(HOST +"/api/announcements")
            .send()
            .set('Authorization', token)
            .set('accept', 'json')
            .then(res =>{
                return expect(res.body.length).toBe(3);
            })
    })

    test('Should get announcement filtered by keyword', async() =>{
        expect.assertions(1);
        await agent.get(HOST +"/api/announcements")
            .query('q=filtered' )
            .query('page=0')
            .query('limit=1')
            .query('last=true')
            .accept('application/json')
            .send()
            .set('Authorization', token)
            .set('accept', 'json')
            .then(res =>{
                return expect(res.body.length).toBe(1);
            })
    })
})
