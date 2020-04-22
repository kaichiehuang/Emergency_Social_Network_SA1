const NewUserValidator = require('./newUserValidator');
/**
* Our class for user model taht will be attached to the schema
*/
class UserAccountValidator extends NewUserValidator {
    /**
    * [constructor description]
    * @return {[type]} [description]
    */
    constructor() {
        super();
        //allow empty for update account
        this.validatorRules.lengthRules[1].allowEmpty = true;
    }
}

module.exports = UserAccountValidator;




