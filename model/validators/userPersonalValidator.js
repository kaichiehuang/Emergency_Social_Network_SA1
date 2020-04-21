const UserValidatorInterface = require('./userValidatorInterface.js');
/**
 * Our class for user model taht will be attached to the schema
 */
class UserPersonalValidator extends UserValidatorInterface {
    /**
     * [constructor description]
     * @return {[type]} [description]
     */
    constructor() {
        super();
        const commonMsg = "All fields are mandatory in this step.";
        this.validatorRules = {
            "requiredRules": [{
                "fieldName": 'name',
                "msg": commonMsg
            }, {
                "fieldName": 'last_name',
                "msg": commonMsg
            }, {
                "fieldName": 'address',
                "msg": commonMsg
            }, {
                "fieldName": 'phone_number',
                "msg": commonMsg
            }, {
                "fieldName": "city",
                "msg": commonMsg
            }, {
                "fieldName": "birth_date",
                "msg": commonMsg
            }, {
                "fieldName": "privacy_terms_data_accepted",
                "msg": "Please accept the terms and conditions"
            }, {
                "innerObject": "emergency_contact",
                "fieldName": "name",
                "msg": commonMsg
            }, {
                "innerObject": "emergency_contact",
                "fieldName": "phone_number",
                "msg": commonMsg
            }, {
                "innerObject": "emergency_contact",
                "fieldName": "address",
                "msg": commonMsg
            }], // array of objects, {fieldName: "", "msg", ""}
            "lengthRules": [{
                "fieldName": "city",
                "minLength": 4,
                "msg": "City must be longer than 4 characters"
            }, {
                "fieldName": "address",
                "minLength": 4,
                "msg": "Address must be longer than 4 characters"
            }, {
                "fieldName": "phone_number",
                "minLength": 7,
                "msg": "Phone number must be longer than 7 characters"
            }, {
                "innerObject": "emergency_contact",
                "fieldName": "phone_number",
                "minLength": 7,
                "msg": "The emergency contact phone number must be longer than 7 characters"
            }], // array of objects {"fieldName", "minLength": 3, "msg"},{"field", "minLength": 3, "msg"},
        };
    }
}
module.exports = UserPersonalValidator;