const ValidatorInterface = require('./validatorInterface.js');

/**
* Our class for user model taht will be attached to the schema
*/
class UserAccountValidator extends ValidatorInterface{
    /**
    * [constructor description]
    * @return {[type]} [description]
    */
    constructor(){
        super();
    }
}

module.exports = UserAccountValidator;
