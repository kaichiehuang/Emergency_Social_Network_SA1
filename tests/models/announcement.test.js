const TestDatabase = require('../services/testDataBase');
const Announcement = require('../../model/announcement');
const testDatabase = new TestDatabase();
require('../../model/user');

beforeAll(async () => {
    await testDatabase.start();
});

afterAll(async () => {
    await testDatabase.stop();
});

afterEach(async () => {
    await testDatabase.cleanup();
});


describe('Can creat an announcement', ()=> {
    test('Should create an announcement', () => {
        expect.assertions(1);
        const announcement = new Announcement(
            'this is an announcement',
            '507f1f77bcf86cd799439011',
            'OK',
        );

        return announcement.saveAnnouncement()
            .then((newAnnouncement) => {
                expect(newAnnouncement.announcement).toBe(announcement.announcement);
            }).catch((err) => {});
    });


    test('should reject announcement creation', () =>{
        expect.assertions(1);
        const announcement = new Announcement(
            '',
            '507f1f77bcf86cd799439011',
            'OK',
        );

        return expect(announcement.saveAnnouncement()).rejects.toEqual(
            'Invalid announcement, please enter the message that you want to send',
        );
    });
});


describe('Can get announcements', () => {
    beforeEach( async () => {
        let announcement = new Announcement(
            'this is an announcement',
            '507f1f77bcf86cd799439011',
            'OK',
        );

        await announcement.saveAnnouncement();

        announcement = new Announcement(
            'testing announcement search by keywords',
            '507f1f77bcf86cd799439011',
            'OK',
        );
        await announcement.saveAnnouncement();
    });

    test('Getting all the announcement', async () =>{
        expect.assertions(1);
        await Announcement.getAnnouncements()
            .then((res) =>{
                expect(res.length).toBe(2);
            })
            .catch((err) =>{});
    });

    test('searching announcement by keyword', async () =>{
        expect.assertions(1);
        const keywords = 'test a able about across after all almost also am among an and any are as at be because been but by can cannot could dear did do does either else ever every for from get got had has have he her hers him his how however i if in into is it its just least let like likely may me might most must my neither no nor not of off often on only or other our own rather said say says she should since so some than that the their them then there these they this tis to too twas us wants was we were what when where which while who whom why will with would yet you your';
        await Announcement.findAnnouncements(keywords, 0)
            .then((res) =>{
                expect(res.length).toBe(1);
            })
            .catch((err) =>{});
    });
});


//
// describe("Database error", () =>{
//
//
//     test("Should return an error message creating an announcement", async () => {
//         expect.assertions(1);
//
//         await testDatabase.stop();
//
//         let announcement = new Announcement(
//             "this is an announcement",
//             '507f1f77bcf86cd799439011',
//             'OK',
//         );
//
//         return expect(announcement.saveAnnouncement()).rejects.toContain(
//             'Error creating announcement:',
//         );
//     })
//
//
//     test("Should return an error message getting an announcement", async () => {
//         expect.assertions(1);
//
//         testDatabase.stop();
//
//         return expect(Announcement.getAnnouncements(-1,"p")).rejects.toHaveBeenCalled()
//
//
//     })
//
//
//
// })
