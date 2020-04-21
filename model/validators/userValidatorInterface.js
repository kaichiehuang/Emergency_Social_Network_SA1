/**
 * Our class for user model taht will be attached to the schema
 */
class UserValidatorInterface {
    constructor() {
        this.arrayData = [];
        this.validatorRules = {
            "requiredRules": [], // list of variables
            "lengthRules": [], // array of objects {"field", "minLength": 3},{"field", "minLength": 3},
        };
    }
    /**
     *
     */
    validateStepData(data) {
        //set data for global access
        this.setValidationData(data);
        return new Promise((resolve, reject) => {
            //1. validate required fields
            this.validateRequiredFields().then((result) => {
                //2. validate required fields
                return this.validateFieldsByLength();
            }).then((result) => {
                return resolve(true);
            }).catch((err) => {
                return reject(err);
            });
        });
    }
    /**
     * [validateRequiredFields description]
     * @return {[type]} [description]
     */
    validateRequiredFields() {
        return new Promise((resolve, reject) => {
            console.log(this.validatorRules);
            if (this.validatorRules.requiredRules.length > 0) {
                for (var i = 0; i < this.validatorRules.requiredRules.length; i++) {
                    const field = this.validatorRules.requiredRules[i];
                    let validationResult = false;
                    if (field.innerObject != undefined) {
                        validationResult = this.validateRequiredField(field.fieldName, field.innerObject);
                    } else {
                        validationResult = this.validateRequiredField(field.fieldName);
                    }
                    if (validationResult == false) {
                        if (field.msg == undefined || field.msg.length == 0) {
                            return reject(field.fieldName + " is a required field");
                        }
                        return reject(field.msg);
                    }
                }
            }
            return resolve(true);
        });
    }
    /**
     * Validates required field
     * @param  {[type]} data      [description]
     * @param  {[type]} fieldName [description]
     * @return {[type]}           [description]
     */
    validateRequiredField(fieldName, innerObject) {
        if (innerObject != undefined) {
            if (this.arrayData[innerObject][fieldName] == undefined || this.arrayData[innerObject][fieldName] == "" || this.arrayData[innerObject][fieldName].length == 0) {
                return false;
            }
        } else {
            if (this.arrayData[fieldName] == undefined || this.arrayData[fieldName] == "" || this.arrayData[fieldName].length == 0) {
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
            if (this.validatorRules.lengthRules.length > 0) {
                for (var i = 0; i < this.validatorRules.lengthRules.length; i++) {
                    const field = this.validatorRules.lengthRules[i];
                    let validationResult = false;
                    if (field.innerObject != undefined) {
                        validationResult = this.validateFieldByLength(field.fieldName, field.minLength, field.innerObject);
                    } else {
                        validationResult = this.validateFieldByLength(field.fieldName, field.minLength);
                    }
                    if (!validationResult) {
                        if (field.msg == undefined || field.msg.length == 0) {
                            return reject("Minimum length for " + field.fieldName + " is " + field.minLength);
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
    validateFieldByLength (fieldName, minLength, innerObject) {
        if (innerObject != undefined) {
            if (this.arrayData[innerObject][fieldName] == undefined || this.arrayData[innerObject][fieldName].length < minLength) {
                return false;
            }
        } else {
            if (this.arrayData[fieldName] == undefined || this.arrayData[fieldName].length < minLength) {
                return false;
            }
        }
        return true;
    }
    /**
     * [setValidationData description]
     * @param {[type]} data [description]
     */
    setValidationData(data) {
        this.arrayData = data;
    }
}
module.exports = UserValidatorInterface;