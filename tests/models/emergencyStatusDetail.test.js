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