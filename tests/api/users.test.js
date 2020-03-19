const TestDatabase = require('../../services/testDataBase')
const agent = require('superagent')
var bodyParser = require('body-parser');

// Initiate Server
let PORT = 3000;
let HOST = 'http://localhost:' + PORT;

let app = require('../../app').app;
app.set('port', PORT);
app.listen(PORT);


// let server = requiÇre('../../app').server;
// server.listen(PORT);

const testDatabase = new TestDatabase();


beforeAll(async () => {
    await testDatabase.start();
});

afterAll(async () => {
    await testDatabase.stop();
});

afterEach(async () => {
    await testDatabase.cleanup();
});


const user = {
    username: 'fakeUser',
    password:'fakePassword',
    name:'fake name',
    last_name: 'fake last',
}

describe('API USERS TEST', () => {

    test('Can post a new user' ,() =>{
        agent.get(HOST + '/users')
            .send()
            .set('accept', 'json')
            .then(console.log)
            .catch(console.error)
    })

})
