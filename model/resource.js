const ResourceModel = require('./model').ResourcesMongo;
const constants = require('../constants');

/**
 * resource model
 */
class Resource {
    // eslint-disable-next-line require-jsdoc
    constructor(user, resourceType, name, location, description, q1, q2, q3, image, contentType) {
        this.user = user;
        this.resourceType = resourceType;
        this.name = name;
        this.location = location;
        this.description = description;
        this.q1 = q1;
        this.q2 = q2;
        this.q3 = q3;
        this.image = image;
        this.contentType = contentType;
    }

    /**
     * Create new Resource
     * @returns {Promise<unknown>}
     */
    saveResource() {
        return new Promise((resolve, reject) =>{
            // require fields validation
            if (this.location.length === 0 ||
                this.description.length === 0) {
                reject('Please validate require fields.');
            } else {
                // Creating Resource Model
                const resource = new ResourceModel({
                    user: this.user,
                    resource_type: this.resourceType,
                    name: this.name,
                    location: this.location,
                    description: this.description,
                    question_one: this.q1,
                    question_two: this.q2,
                    question_three: this.q3,
                    image: {
                        data: this.image,
                        contentType: this.contentType
                    }

                });

                // Saving Model
                resource.save()
                    .then((result) => {
                        resolve(result);
                    })
                    .catch((err) => {
                        /* istanbul ignore next */
                        reject(err);
                    });
            }
        });
    }

    /**
     * Method to get all Resources in databse
     * @returns {Promise<unknown>}
     */
    static findResources() {
        return new Promise((resolve, reject) =>{
            ResourceModel.find()
                .select('name description')
                .populate('user_id', ['_id', 'username'])
                .sort({
                    created_at: 'asc'
                })
                .then((result) =>{
                    resolve(result);
                })
                .catch( (err) =>{
                    /* istanbul ignore next */
                    reject(err);
                });
        });
    }

    /**
     * Method to get a resource by his id
     * @param resourceId
     * @returns {Promise<unknown>}
     */
    static findResourceById(resourceId) {
        return new Promise((resolve, reject) =>{
            ResourceModel.findById(resourceId)
                .populate('user_id', ['_id', 'username'])
                .then((result) =>{
                    resolve(result);
                })
                .catch( (err) =>{
                    /* istanbul ignore next */
                    reject(err);
                });
        });
    }
}


module.exports= Resource;
