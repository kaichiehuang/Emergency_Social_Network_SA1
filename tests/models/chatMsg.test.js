const TestDatabase = require("../services/testDataBase")
const ChatMessage = require("../../model/chatMessage")

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


  describe("Create Messages", () => {

    test("Create a new message in the database", async () => {
      let chatMessage = new ChatMessage("This a test message", '507f1f77bcf86cd799439011');
      await chatMessage.createNewMessage().then(msg => {
        expect(msg.message).toBe("This a test message");
        expect(String(msg.user_id)).toBe("507f1f77bcf86cd799439011")

      });
    })

  })


  describe("Getting Messages", () => {

    let messsageId;
    beforeEach( async () => {
      let chatMessage = new ChatMessage("This a test message", '507f1f77bcf86cd799439011');
       await chatMessage.createNewMessage().then(msg => {
         messsageId = String(msg._id);

      });
    })

    test("getting messages from  the database", async () => {
      let chatMessage = new ChatMessage();
        await chatMessage.getChatMessages().then(msg => {
          expect(String(msg[0]._id)).toBe(messsageId);
        });
    })

  })


