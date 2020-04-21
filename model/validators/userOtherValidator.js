const UserValidatorInterface = require('./userValidatorInterface');

/**
 * Our class for user model taht will be attached to the schema
 */
class UserOtherValidator extends UserValidatorInterface{
    /**
     * [constructor description]
     * @return {[type]} [description]
     */
    constructor(){
        super();

    //             if (data.personal_message != undefined) {
    //                 if (data.personal_message.security_question.length == 0 && data.personal_message.security_question_answer.length != 0) {
    //                     return reject('The security question and the answer to this cannot be empty if one of these is sent.');
    //                 }
    //                 if (data.personal_message.security_question.length != 0 && data.personal_message.security_question_answer.length == 0) {
    //                     return reject('The security question and the answer to this cannot be empty if one of these is sent.');
    //                 }
    //             }


    }
}

module.exports = UserOtherValidator;
