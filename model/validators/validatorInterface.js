/**
 * Our class for user model taht will be attached to the schema
 */
class ValidatorInterface {
    // eslint-disable-next-line require-jsdoc
    constructor() {
        this.validateData = [];
        this.validatorRules = {
            'requiredRules': [], // list of variables
            'lengthRules': [], // array of objects {"field", "minLength": 3},{"field", "minLength": 3},
            'customRules': [],
            'acceptedData': []
        };
    }
    /**
     *   Validates a
     */
    validateDataRules(data) {
        // set data for global access
        this.setValidationData(data);
        return new Promise((resolve, reject) => {
            // 1. validate required fields
            this.validateRequiredFields()
                .then((result) => {
                // 2. validate required fields
                    return this.validateFieldsByLength();
                })
                .then((result) => {
                // 3. custom rules
                    return this.validateCustomRules();
                })
                .then((result) => {
                    return resolve(true);
                }).catch((err) => {
                    return reject(err);
                });
        });
    }
    /**
     * Validate required fields
     * @return {[type]} [description]
     */
    validateRequiredFields() {
        return new Promise((resolve, reject) => {
            if (this.validatorRules.requiredRules != undefined && this.validatorRules.requiredRules.length > 0) {
                for (let i = 0; i < this.validatorRules.requiredRules.length; i++) {
                    const field = this.validatorRules.requiredRules[i];
                    let validationResult = false;
                    if (field.innerObject != undefined) {
                        validationResult = this.validateRequiredField(field.fieldName, field.innerObject);
                    } else {
                        validationResult = this.validateRequiredField(field.fieldName);
                    }
                    if (validationResult == false) {
                        if (field.msg == undefined || field.msg.length == 0) {
                            return reject(field.fieldName + ' is a required field');
                        }
                        return reject(field.msg);
                    }
                }
            }
            return resolve(true);
        });
    }
    /**
     * Validates 1 required field
     * @param  {[type]} data      [description]
     * @param  {[type]} fieldName [description]
     * @return {[type]}           [description]
     */
    validateRequiredField(fieldName, innerObject) {
        if (innerObject != undefined) {
            if (this.validateData[innerObject][fieldName] == undefined || this.validateData[innerObject][fieldName] == '' || this.validateData[innerObject][fieldName].length == 0) {
                return false;
            }
        } else {
            if (this.validateData[fieldName] == undefined || this.validateData[fieldName] == '' || this.validateData[fieldName].length == 0) {
                return false;
            }
        }
        return true;
    }
    /**
     * Validates fields by length
     * @param  {[type]} data      [description]
     * @param  {[type]} fieldName [description]
     * @return {[type]}           [description]
     */
    validateFieldsByLength() {
        return new Promise((resolve, reject) => {
            if (this.validatorRules.lengthRules != undefined && this.validatorRules.lengthRules.length > 0) {
                for ( let i = 0; i < this.validatorRules.lengthRules.length; i++) {
                    const field = this.validatorRules.lengthRules[i];
                    let validationResult = false;
                    let allowEmpty = false;
                    if (field.allowEmpty) {
                        allowEmpty = field.allowEmpty;
                    }

                    if (field.innerObject != undefined) {
                        validationResult = this.validateFieldByLength(field.fieldName, field.minLength, field.innerObject, allowEmpty);
                    } else {
                        validationResult = this.validateFieldByLength(field.fieldName, field.minLength, null, allowEmpty);
                    }
                    if (!validationResult) {
                        if (field.msg == undefined || field.msg.length == 0) {
                            return reject('Minimum length for ' + field.fieldName + ' is ' + field.minLength );
                        }
                        return reject(field.msg);
                    }
                }
                return resolve(true);
            } else {
                return resolve(true);
            }
        });
    }
    /**
     * Validates required field
     * @param  {[type]} data      [description]
     * @param  {[type]} fieldName [description]
     * @return {[type]}           [description]
     */
    validateFieldByLength(fieldName, minLength, innerObject, allowEmpty) {
        // if it allows empty values move foward
        if (allowEmpty && (this.validateData[fieldName] == undefined || this.validateData[fieldName].length == 0)) {
            return true;
        }

        // else check for length rule
        if (innerObject != undefined) {
            if (this.validateData[innerObject][fieldName] == undefined || this.validateData[innerObject][fieldName].length < minLength) {
                return false;
            }
        } else {
            if (this.validateData[fieldName] == undefined || this.validateData[fieldName].length < minLength) {
                return false;
            }
        }
        return true;
    }
    /**
     * Validates fields by length
     * @param  {[type]} data      [description]
     * @param  {[type]} fieldName [description]
     * @return {[type]}           [description]
     */
    validateCustomRules() {
        return new Promise((resolve, reject) => {
            if (this.validatorRules.customRules != undefined && this.validatorRules.customRules.length > 0) {
                for (let i = 0; i < this.validatorRules.customRules.length; i++) {
                    const field = this.validatorRules.customRules[i];
                    let validationResult = false;
                    // call custom function
                    if (field.customRuleName.length > 0) {
                        validationResult = this[field.customRuleName]();
                    }

                    if (!validationResult) {
                        if (field.msg == undefined) {
                            return reject('Error');
                        }
                        return reject(field.msg);
                    }
                }
            }
            return resolve(true);
        });
    }

    /**
     * [setValidationData description]
     * @param {[type]} data [description]
     */
    setValidationData(data) {
        this.validateData = data;
    }
}
module.exports = ValidatorInterface;
