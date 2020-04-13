const TestDatabase = require("../services/testDataBase")
const EmergencyStatusDetail = require('../../model/emergencyStatusDetail')

const testDatabase = new TestDatabase();

beforeAll(async () => {
  await testDatabase.start();
});

afterAll(async () => {
  await testDatabase.stop();
});

afterAll(async () => {
  await testDatabase.cleanup();
});

describe("Emergency Status Detail", () => {

    test("Create a new emergency status detail in the database", async () => {
      let detail = new EmergencyStatusDetail('507f1f77bcf86cd799439011');
      await detail.createEmergencyStatusDetail().then(res=> {
        expect(String(res.user_id)).toBe("507f1f77bcf86cd799439011");
        expect(res.status_description).toBe(null);
        expect(res.share_location).toBe(null);
      });
    });

    test("Update emegency status detail - brief description", async () => {
        
        await EmergencyStatusDetail.updateEmergencyStatusDetail('507f1f77bcf86cd799439011', "brief discription", "situation").then(res=> {
          expect(String(res.user_id)).toBe("507f1f77bcf86cd799439011");
          expect(res.status_description).toBe("brief discription");

        });
    });

    test("Update emegency status detail - location description", async () => {
        
        await EmergencyStatusDetail.updateEmergencyStatusDetail('507f1f77bcf86cd799439011', "location discription", "location").then(res=> {
          expect(String(res.user_id)).toBe("507f1f77bcf86cd799439011");
          expect(res.share_location).toBe("location discription");

        });
    });



    test("get megency status detail", async () => {
        
        await EmergencyStatusDetail.getEmergencyStatusDetail('507f1f77bcf86cd799439011').then(res=> {
          expect(String(res.user_id)).toBe("507f1f77bcf86cd799439011");
          expect(res.status_description).toBe("brief discription");
          expect(res.share_location).toBe("location discription");
        });
    });


})


describe("Picture and Description", () => {

    let pictureId;

    test("add a new picture and description in the database", async () => {
      
      await EmergencyStatusDetail.addPictureAndDescription("507f1f77bcf86cd799439011", "abc/cde/fgh", "name", "This is a description").then(res=> {
        expect(String(res.user_id)).toBe("507f1f77bcf86cd799439011");
        expect(res.picture_path).toBe("abc/cde/fgh");
        expect(res.picture_name).toBe("name");
        expect(res.picture_description).toBe("This is a description");
        pictureId = res._id;
      });
    });

    test("update picture description in the database", async () => {
      
        await EmergencyStatusDetail.updatePictureDescription(pictureId, "new description").then(res=> {
            expect(String(res.user_id)).toBe("507f1f77bcf86cd799439011");
            expect(res.picture_path).toBe("abc/cde/fgh");
            expect(res.picture_name).toBe("name");
            expect(res.picture_description).toBe("new description");
        });
    });

    test("get picture and description in the database", async () => {
      
        await EmergencyStatusDetail.getAllPictureAndDescription("507f1f77bcf86cd799439011").then(res=> {
            expect(String(res[0].user_id)).toBe("507f1f77bcf86cd799439011");
            expect(res[0].picture_path).toBe("abc/cde/fgh");
            expect(res[0].picture_name).toBe("name");
            expect(res[0].picture_description).toBe("new description");
        });
    });


    test("remove picture from the database", async () => {
      
        await EmergencyStatusDetail.removePictureAndDescription(pictureId).then(res=> {
            expect(String(res.user_id)).toBe("507f1f77bcf86cd799439011");
            expect(res.picture_path).toBe("abc/cde/fgh");
            expect(res.picture_name).toBe("name");
            expect(res.picture_description).toBe("new description");
        });
    });


    


})