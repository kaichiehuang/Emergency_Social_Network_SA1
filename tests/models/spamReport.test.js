const TestDatabase = require('../services/testDataBase');
const SpamReport = require('../../model/spamReport');
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

describe('principal', () => {
    describe('Creating msg Spam Reports', () => {
        test('Create a new spam report in the database', async () => {
            const report = new SpamReport('message', 'False', 'He is faker');
            await report.saveSpamReport().then((report) => {
                expect(report.level).toBe('message');
                expect(report.type).toBe('False');
            });
        });
    });
    describe('Creating user Spam Reports', () => {
        test('Create a new user report in the database', async () => {
            const report = new SpamReport('user', 'Harrassing', 'He is faker');
            await report.saveSpamReport().then((report) => {
                expect(report.level).toBe('user');
                expect(report.type).toBe('Harrassing');
            });
        });
    });
});
