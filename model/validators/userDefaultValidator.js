const ValidatorInterface = require('./validatorInterface.js');
/**
 * User default validator
 */
class UserDefaultValidator extends ValidatorInterface {
    /**
     * [constructor description]
     * @return {[type]} [description]
     */
    constructor() {
        super();
        const commonMsg = "All fields are mandatory in this step.";
        this.validatorRules = {
            "requiredRules": [], // array of objects, {fieldName: "", "msg", ""}
            "lengthRules": [], // array of objects {"fieldName", "minLength": 3, "msg"},{"field", "minLength": 3, "msg"},
        };
    }
}
module.exports = UserDefaultValidator;