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
        const personalMessage = this.validateData.personal_message;
        if (personalMessage.message.length != 0 && (personalMessage.security_question_answer.length == 0 || personalMessage.security_question.length == 0)) {
            return false;
        }
        if (personalMessage.security_question.length == 0 && personalMessage.security_question_answer.length != 0) {
            return false;
        }
        if (personalMessage.security_question.length != 0 && personalMessage.security_question_answer.length == 0) {
            return false;
        }
        return true;
    }
}

module.exports = UserOtherValidator;
