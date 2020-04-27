const ValidatorInterface = require('./validatorInterface.js');

/**
* Our class for user model taht will be attached to the schema
*/
class UserOtherValidator extends ValidatorInterface {
    /**
    * [constructor description]
    * @return {[type]} [description]
    */
    constructor(ownerElement) {
        super(ownerElement);
        this.validatorRules = {
            'customRules': [
                {
                    'customRuleName': 'validateSecurityQuestion',
                    'msg': 'Message, security question and answer are required if any of these are sent.',
                },
            ],
        };
    }

    /**
     * Validates structure of security question and answer, they should both exists if one is not empty
     * @return {[type]} [description]
     */
    validateSecurityQuestion() {
        if (this.validateData.personal_message == undefined) {
            return true;
        }
        else if (this.validateData.personal_message.message.length != 0 && (this.validateData.personal_message.security_question_answer.length == 0 || this.validateData.personal_message.security_question.length == 0)) {
            return false;
        }
        else if (this.validateData.personal_message.security_question.length == 0 && this.validateData.personal_message.security_question_answer.length != 0) {
            return false;
        } else if (this.validateData.personal_message.security_question.length != 0 && this.validateData.personal_message.security_question_answer.length == 0) {
            return false;
        }

        return true;
    }
}

module.exports = UserOtherValidator;
