const TestDataBase = require('../services/testDataBase');
const Resource =require('../../model/resource');
const constants = require('../../constants');
const testDatabase = new TestDataBase();
const fs = require('fs');

const pictureTest = "./tests/resources/photo_resources_test.png"


beforeAll(async () => {
    await testDatabase.start();
});

afterAll(async () => {
    await testDatabase.stop();
});

afterEach(async () => {
    await testDatabase.cleanup();
});


describe('Creating a resource',() => {

    test('Should create a resource ', async() => {
        expect.assertions(1);
        var imgFile =fs.readFileSync(pictureTest)
        //var fileStr = imgFile.toString('base64')
        const resource = new Resource(
            '507f1f77bcf86cd799439011',
            constants.RESOURCE_MEDICAL,
            'resource name',
            'resource location',
        'resource description',
            true,
            true,
            true,
            imgFile,
            'image/png');
        const newResource = await resource.saveResource()
        expect(newResource.name).toBe('resource name');

    });


    test('Should validate require fields ', async() => {
        expect.assertions(1);
        var imgFile =fs.readFileSync(pictureTest)
        //var fileStr = imgFile.toString('base64')
        const resource = new Resource(
            '507f1f77bcf86cd799439011',
            constants.RESOURCE_MEDICAL,
            'resource name',
            '',
            'resource description',
            true,
            true,
            true,
            imgFile,
            'image/png');
        //const newResource = await resource.saveResource();

        return expect(resource.saveResource())
            .rejects.toEqual('Please validate require fields.')


    });

});


describe('Getting a resource',() => {
    let resourceId;
    beforeEach(async () => {
        var imgFile =fs.readFileSync(pictureTest)
        //var fileStr = imgFile.toString('base64')
        const resource = new Resource(
            '507f1f77bcf86cd799439011',
            constants.RESOURCE_MEDICAL,
            'resource name',
            'resource location',
            'resource description',
            true,
            true,
            true,
            imgFile,
            'image/png');
        const newResource = await resource.saveResource()
        resourceId = newResource._id;

    });


    test('Should get a resource previously inserted ', async() => {
        expect.assertions(1);

        const resource = await Resource.findResourceById(resourceId);
        expect(resource._id.toString()).toBe(resourceId.toString());

    });



    test('Should get all the resource previously inserted ', async() => {
        expect.assertions(1);

        var imgFile =fs.readFileSync(pictureTest)
        //var fileStr = imgFile.toString('base64')
        let resource = new Resource(
            '507f1f77bcf86cd799439011',
            constants.RESOURCE_MEDICAL,
            'resource name 2',
            'resource location',
            'resource description',
            true,
            true,
            true,
            imgFile,
            'image/png');
        await resource.saveResource()

        const resources = await Resource.findResources();
        console.log(resources)
        expect(resources.length).toBe(2);

    });

})
