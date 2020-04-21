const ValidatorInterface = require('./validatorInterface.js');

/**
* Our class for user model taht will be attached to the schema
*/
class UserOtherValidator extends ValidatorInterface{
    /**
    * [constructor description]
    * @return {[type]} [description]
    */
    constructor(){
        super();
        this.validatorRules = {
            customRules: [
                {
                    customRuleName: 'validateSecurityQuestion',
                    msg: "The security question and the answer to this cannot be empty if one of these is sent.",
                },
            ],
        };
    }

    validateSecurityQuestion(){
        if (this.validateData.personal_message != undefined) {
            if (this.validateData.personal_message.security_question.length == 0 && this.validateData.personal_message.security_question_answer.length != 0) {
                return false;
            }
            else if (this.validateData.personal_message.security_question.length != 0 && this.validateData.personal_message.security_question_answer.length == 0) {
                return false;
            }
            return true;
        }
    }
}

module.exports = UserOtherValidator;
