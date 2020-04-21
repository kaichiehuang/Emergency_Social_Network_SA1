const userValidationInterface = require('userValidationInterface');

/**
 * Our class for user model taht will be attached to the schema
 */
class UserPersonalValidation extends UserValidationInterface{
    /**
     * [constructor description]
     * @return {[type]} [description]
     */
    constructor() {}

    /**
     *
     */
    validateStepData(){
        return new Promise((resolve, reject) => {
            reject("Missing class implementation");
        }
    }
}

module.exports = UserPersonalValidation;
