const ValidatorInterface = require('./validatorInterface.js');
/**
 * Our class for user model taht will be attached to the schema
 */
 class UserPersonalValidator extends ValidatorInterface {
    /**
     * [constructor description]
     * @return {[type]} [description]
     */
     constructor() {
        super();
        const commonMsg = "Missing required fields. Every field in this step is mandatory.";
        this.validatorRules = {
            "requiredRules": [
                {
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
                    "msg": "Please accept the term and conditions for personal data treatment"
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
                }
            ], // array of objects, {fieldName: "", "msg", ""}
            "lengthRules": [
                {
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
                    "msg": "Phone numbers must be longer than 7 characters"
                }, {
                    "innerObject": "emergency_contact",
                    "fieldName": "phone_number",
                    "minLength": 7,
                    "msg": "Phone numbers must be longer than 7 characters"
                }
            ], // array of objects {"fieldName", "minLength": 3, "msg"},{"field", "minLength": 3, "msg"},
        };
    }
}
module.exports = UserPersonalValidator;