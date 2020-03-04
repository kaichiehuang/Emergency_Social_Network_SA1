const TestDatabase = require("../services/testDataBase")
const PrivateChatMessage = require("../model/privateChatMessage")
const mongoose = require('mongoose');


TestDatabase.setupDB()

describe("principal", () => {


  describe("Creating Private Messages", () => {
    test("Create a new private chat message in the database", async () => {
      let chatMessage = new PrivateChatMessage("This a test message", '507f1f77bcf86cd799439011', '507f1f77bcf86cd799439011');
      await chatMessage.createNewMessage().then(msg => {
        console.log(msg);
        expect(msg.message).toBe("This a test message");
        expect(String(msg.sender_user_id)).toBe("507f1f77bcf86cd799439011");
      });
    })

    afterEach(async () => {
      await mongoose.connection.db.dropDatabase();
    });
  })

  describe("Getting Messages", () => {

    let messsageId;
    beforeEach(async () => {
      let chatMessage = new PrivateChatMessage("This a test message", '507f1f77bcf86cd799439011', '507f1f77bcf86cd799439011');
      await chatMessage.createNewMessage().then(msg => {
        console.log('messsage:' + msg);
        messsageId = msg;

      });
    })

    test("getting private  messages from  the database", async () => {
      let chatMessage = new PrivateChatMessage();
      await chatMessage.getChatMessages(messsageId.sender_user_id, messsageId.receiver_user_id).then(msg => {
        console.log('msg' + msg);
        expect(String(msg[0]._id)).toBe(String(messsageId._id));
      });
    })

    afterAll(async () => {
      await mongoose.connection.db.dropDatabase();
    });

  })
})
