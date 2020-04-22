const ValidatorInterface = require('./validatorInterface.js');
const blacklist = require('the-big-username-blacklist');

/**
* Our class for user model taht will be attached to the schema
*/
class NewUserValidator extends ValidatorInterface {
    /**
    * [constructor description]
    * @return {[type]} [description]
    */
    constructor() {
        super();
        const commonMsg = 'Invalid username and password.';
        this.validatorRules = {
            'requiredRules': [
                {
                    'fieldName': 'username',
                    'msg': commonMsg
                }, {
                    'fieldName': 'password',
                    'msg': commonMsg
                }
            ], // array of objects, {fieldName: "", "msg", ""}
            'lengthRules': [
                {
                    'fieldName': 'username',
                    'minLength': 3,
                    'msg': 'Invalid username, please enter a longer username (min 3 characters)'
                }, {
                    'fieldName': 'password',
                    'minLength': 4,
                    'msg': 'Invalid password, please enter a longer password (min 4 characters)'
                }
            ],
            'customRules': [
                {
                    'customRuleName': 'validateBannedUsername',
                    'msg': 'Invalid username, this username is reserved for the platform. Please enter a different username.',
                },
            ],
        };
    }

    /**
     * Validates if a username is banned
     * @return {[type]} [description]
     */
    validateBannedUsername() {
        if (this.validateData.username == undefined) {
            return false;
        }
        // 3. Validate BlackListUser\
        const black = blacklist.validate(this.validateData.username);
        if (!black) {
            return false;
        }
        return true;
    }
}

module.exports = NewUserValidator;
