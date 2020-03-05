const TestDatabase = require("../services/testDataBase")
const ChatMessage = require("../model/chatMessage")
const mongoose = require('mongoose');


TestDatabase.setupDB();


describe("principal", () => {

  describe("Create Messages", () => {

    test("Create a new message in the database", async () => {
      let chatMessage = new ChatMessage("This a test message", '507f1f77bcf86cd799439011');
      await chatMessage.createNewMessage().then(msg => {
        expect(msg.message).toBe("This a test message");
        expect(String(msg.user_id)).toBe("507f1f77bcf86cd799439011")

      });
    })

    afterEach(async () => {
      await mongoose.connection.db.dropDatabase();
    });
  })


  describe("Getting Messages", () => {

    // let messsageId;
    // beforeEach(async () => {
    //   let chatMessage = new ChatMessage("This a test message", '507f1f77bcf86cd799439011');
    //   await chatMessage.createNewMessage().then(msg => {
    //     console.log('messsageId' + String(msg._id));
    //     messsageId = String(msg._id);
    //
    //   });
    // })

    test("getting messages from  the database", async () => {
      let messsageId;
      let chatMessage = new ChatMessage("This a test message", '507f1f77bcf86cd799439011');
      await chatMessage.createNewMessage().then(async msg => {
        console.log('messsageId' + String(msg._id));
        return messsageId = String(msg._id);
        await chatMessage.getChatMessages().then(msg => {
          console.log('length' + msg.length);
          return expect(String(msg[0]._id)).toBe(messsageId);
        });

      });

      //let chatMessage = new ChatMessage();
      // await chatMessage.getChatMessages().then(msg => {
      //   console.log('length' + msg.length);
      //   expect(String(msg[0]._id)).toBe(messsageId);
      // });
    })


    afterAll(async () => {
      await mongoose.connection.db.dropDatabase();
    });
  })


})
