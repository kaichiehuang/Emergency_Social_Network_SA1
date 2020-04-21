const UserValidatorInterface = require('./userValidatorInterface');

/**
 * Our class for user model taht will be attached to the schema
 */
class UserMedicalValidator extends UserValidatorInterface{
    /**
     * [constructor description]
     * @return {[type]} [description]
     */
    constructor(){
        super();
        const commonMsg = "All fields are mandatory in this step.";
        this.validatorRules = {
            "requiredRules": [{
                "innerObject": "medical_information",
                "fieldName": 'blood_type',
                "msg": "Blood type is a mandatory field, please select a valid blood type"
            },{
                "innerObject": "medical_information",
                "fieldName": 'privacy_terms_medical_accepted',
                "msg": "Please accept the term and conditions for medical data treatment"
            }],
            "lengthRules": [], // array of objects {"fieldName", "minLength": 3, "msg"},{"field", "minLength": 3, "msg"},
        };
    }
}

module.exports = UserMedicalValidator;