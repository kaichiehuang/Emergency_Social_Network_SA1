const ValidatorInterface = require('./validatorInterface.js');
/**
 * User default validator
 */
class UserDefaultValidator extends ValidatorInterface {
    /**
     * [constructor description]
     * @return {[type]} [description]
     */
    constructor(ownerElement) {
        super(ownerElement);
        this.validatorRules = {
            'requiredRules': [], // array of objects, {fieldName: "", "msg", ""}
            'lengthRules': [], // array of objects {"fieldName", "minLength": 3, "msg"},{"field", "minLength": 3, "msg"},
        };
    }
}
module.exports = UserDefaultValidator;
