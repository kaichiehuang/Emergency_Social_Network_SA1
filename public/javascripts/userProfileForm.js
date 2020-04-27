// eslint-disable-next-line no-unused-vars
/**
 * Class in charge of drawing a use's profile form, 3 steps
 */
class UserProfileForm {

    /**
     * Singleton instance element
     * @return {[type]} [description]
     */
    static getInstance() {
        if (this.instance === undefined) {
            this.instance = new UserProfileForm();
        }
        return this.instance;
    }

    /**
     * changes the receiver for the private chat
     * @param profileFormUserId
     */
    initiateUserProfileForm(profileFormUserId, step) {
        Cookies.set('profile_form_user_id', profileFormUserId);
        this.updateComponentView(profileFormUserId, step);
        this.initEvent();
    }

    /**
     * [drawUsers description]
     * @param user
     * @param step
     */
     drawUserProfileForm(user, step) {
        const containerId = 'user-profile-form-content__container-' + step;
        // 1. find templates in html
        const profileTemplate = document.querySelector('template#userProfileFormTemplate' + step);
        // 2. find container
        const profileFormContainer = document.getElementById(containerId);
        profileFormContainer.innerText = '';
        if (profileFormContainer != undefined) {
            // 3. draw using the template
            if (profileTemplate != undefined && profileTemplate !=
                null && user != undefined) {
                let template = profileTemplate.content.cloneNode(true);
                template.querySelector('input#form_user_id')
                    .value = (user._id != undefined) ? user._id : '';
                // set username
                template.querySelector('.user-profile__username')
                    .innerText = user.username;
                if (step == 0) {
                    template = this.fillProfileFormStep0(user, template);
                }
                else if (step == 1) {
                    template =  this.fillProfileFormStep1(user, template);
                }
                else if (step == 2) {
                    template =  this.fillProfileFormStep2(user, template);
                }
                else if (step == 3) {
                    template =  this.fillProfileFormStep3(user, template);
                }
                profileFormContainer.appendChild(template);
            }
        }
    }

    /**
     * [fillProfileFormStep0 description]
     * @param  {[type]} user     [description]
     * @param  {[type]} template [description]
     * @return {[type]}          [description]
     */
    fillProfileFormStep0(user, template) {
        // set name
        if (user.username != undefined) {
            template.querySelector('input#user-profile-form__username').value = user.username;
        }
        // set last name
        if (user.password != undefined) {
            template.querySelector('input#user-profile-form__password').value = "";
        }
        // set privilege
        if (user != undefined && (currentUser.role == "coordinator" || currentUser.role == "administrator")) {
            template.querySelector('select#user-profile-form__role').value = user.role;
        }else{
            template.querySelector('select#user-profile-form__role').remove();
            template.querySelector('label#user-profile-form__role_label').remove();
        }
        // set privilege
        template.querySelector('select#user-profile-form__active').value = 1;
        if (user.active != undefined && (currentUser.role == "coordinator" || currentUser.role == "administrator")) {
            template.querySelector('select#user-profile-form__active').value = 0;
        }else{
            template.querySelector('select#user-profile-form__active').remove();
            template.querySelector('label#user-profile-form__active_label').remove();
        }
        return template;
    }

    /**
     * [fillProfileFormStep1 description]
     * @param  {[type]} user     [description]
     * @param  {[type]} template [description]
     * @return {[type]}          [description]
     */
     fillProfileFormStep1(user, template) {
        // set name
        if (user.name != undefined) {
            template.querySelector('input#user-profile-form__name').value = user.name;
        }
        // set last name
        if (user.last_name != undefined) {
            template.querySelector('input#user-profile-form__last_name').value = user.last_name;
        }
        // set birth date
        if (user.birth_date != undefined) {
            template.querySelector('input#user-profile-form__birth_date').value = user.birth_date;
        }
        // set address
        if (user.address != undefined) {
            template.querySelector('input#user-profile-form__address').value = user.address;
        }
        // set city
        if (user.city != undefined) {
            template.querySelector('input#user-profile-form__city').value = user.city;
        }
        // set phone number
        if (user.phone_number != undefined) {
            template.querySelector('input#user-profile-form__phone_number').value = user.phone_number;
        }
        // set emergency_contact
        if (user.emergency_contact != undefined) {
            if (user.emergency_contact.name != undefined) {
                template.querySelector('input#user-profile-form__emergency_contact').value = user.emergency_contact.name;
            }
            if (user.emergency_contact.phone_number != undefined) {
                template.querySelector('input#user-profile-form__emergency_contact_phone_number').value = user.emergency_contact.phone_number;
            }
            if (user.emergency_contact.address != undefined) {
                template.querySelector('input#user-profile-form__emergency_contact_address').value = user.emergency_contact.address;
            }
        }
        return template;
    }

    /**
     * Fills the content in the form of step2
     * @param  {[type]} user     [description]
     * @param  {[type]} template the template loaded in the draw function
     * @return {[type]}          the template with all the data
     */
     fillProfileFormStep2(user, template) {
        // set emergency_contact
        if (user.medical_information != undefined && user.medical_information.blood_type != undefined) {
            template.querySelector('select#user-profile-form__blood_type').value = user.medical_information.blood_type;
        }
        if (user.medical_information != undefined && user.medical_information.prescribed_drugs != undefined) {
            template.querySelector('textarea#user-profile-form__prescribed_drugs').innerText = user.medical_information.prescribed_drugs;
        }
        if (user.medical_information != undefined && user.medical_information.prescribed_drugs != undefined && user.medical_information.prescribed_drugs != '') {
            template.querySelector('textarea#user-profile-form__prescribed_drugs').innerText = user.medical_information.prescribed_drugs;
            template.querySelector('input#has_prescribed_drugs1').checked = 'checked';
            template.querySelector('textarea#user-profile-form__prescribed_drugs').classList.remove('hidden');
        } else {
            template.querySelector('textarea#user-profile-form__prescribed_drugs').innerText = '';
            template.querySelector('input#has_prescribed_drugs0').checked = 'checked';
        }
        if (user.medical_information != undefined && user.medical_information.allergies != undefined && user.medical_information.allergies != '') {
            template.querySelector('textarea#user-profile-form__allergies').innerText = user.medical_information.allergies;
            template.querySelector('textarea#user-profile-form__allergies').classList.remove('hidden');
            template.querySelector('input#has_allergies1').checked = 'checked';
        } else {
            template.querySelector('textarea#user-profile-form__allergies').innerText = '';
            template.querySelector('input#has_allergies0').checked = 'checked';
        }
        return template;
    }

    /**
     * Fills the content in the form of step3
     * @param  {[type]} user     [description]
     * @param  {[type]} template the template loaded in the draw function
     * @return {[type]}          the template with all the data
     */
     fillProfileFormStep3(user, template) {
        // set emergency_contact
        if (user.personal_message != undefined && user.personal_message.message != undefined) {
            template.querySelector('textarea#user-profile-form__personal_message').innerText = user.personal_message.message;
        }
        if (user.personal_message != undefined && user.personal_message.security_question != undefined) {
            template.querySelector('input#user-profile-form__security_question').value = user.personal_message.security_question;
        }
        if (user.personal_message != undefined && user.personal_message.security_question_answer != undefined) {
            template.querySelector('input#user-profile-form__security_question_answer').value = user.personal_message.security_question_answer;
        }
        return template;
    }

    /**
     * Saves the data of a submitted form
     * @param  {[type]} formId [description]
     * @return {[type]}        [description]
     */
     saveUserProfile(formId, step) {
        return new Promise((resolve, reject) => {
            const userId = $('#' + formId).find('#form_user_id').val();
            const data =  this.buildData(formId);
            User.getInstance().updateUser(userId, data)
                .then((user) => {
                    User.getInstance().updateCurrentUser();
                    if (step >= 1 && step < 3) {
                        const newStep = parseInt(step) + 1;
                        swapViewContent('user-profile-form' + newStep,
                            'main-content-block');
                        UserProfileForm.getInstance().updateComponentView(user._id, newStep);
                    } else {
                        UserProfile.getInstance().initiateUserProfile(userId);
                        swapViewContent('user-profile-content',
                            'main-content-block');
                    }
                }).catch((err) => {
                    alert(err);
                });
        });
    }

    /**
     * Build data for submission to API
     * @param  {[type]} formId [description]
     * @return {[type]}        [description]
     */
     buildData(formId) {
        const data = $('#' + formId).serializeArray();
        const step = $('#' + formId).find('#form_step').val();
        let finalData = {};
        for (let i = 0; i < data.length; i++) {
            const object = data[i];
            const key = object.name;
            const value = object.value;
            if (step == 1) {
                finalData =  this.buildDataStep1(finalData, key, value);
            } else if (step == 2) {
                finalData =  this.buildDataStep2(finalData, key, value);
            } else if (step == 3) {
                finalData =  this.buildDataStep3(finalData, key, value);
            }else{
                finalData = this.buildDataDefaultStep(finalData, key, value);
            }
        }
        return finalData;
    }

    /**
     * [buildDataStep1 description]
     * @param  {[type]} finalData [description]
     * @param  {[type]} key       [description]
     * @param  {[type]} value     [description]
     * @return {[type]}           [description]
     */
     buildDataDefaultStep(finalData, key, value) {
        finalData[key] = value;
        return finalData;
    }

    /**
     * [buildDataStep1 description]
     * @param  {[type]} finalData [description]
     * @param  {[type]} key       [description]
     * @param  {[type]} value     [description]
     * @return {[type]}           [description]
     */
     buildDataStep1(finalData, key, value) {
        if (finalData.emergency_contact == undefined) {
            finalData.emergency_contact = {};
        }
        if (key == 'emergency_contact') {
            finalData.emergency_contact.name = value;
        } else if (key == 'emergency_contact_phone_number') {
            finalData.emergency_contact.phone_number = value;
        } else if (key == 'emergency_contact_address') {
            finalData.emergency_contact.address = value;
        } else {
            finalData[key] = value;
        }
        return finalData;
    }

    /**
     * [buildDataStep2 description]
     * @param  {[type]} finalData [description]
     * @param  {[type]} key       [description]
     * @param  {[type]} value     [description]
     * @return {[type]}           [description]
     */
     buildDataStep2(finalData, key, value) {
        if (finalData.medical_information == undefined) {
            finalData.medical_information = {};
        }
        if (key == 'prescribed_drugs') {
            finalData.medical_information.prescribed_drugs = '';
            if (finalData.has_prescribed_drugs == '1') {
                finalData.medical_information.prescribed_drugs = value;
            }
        } else if (key == 'allergies') {
            finalData.medical_information.allergies = '';
            if (finalData.has_allergies == '1') {
                finalData.medical_information.allergies = value;
            }
        }
        if (key == 'step') {
            finalData.step = value;
        } else {
            finalData.medical_information[key] = value;
        }
        return finalData;
    }

    /**
     * [buildDataStep3 description]
     * @param  {[type]} finalData [description]
     * @param  {[type]} key       [description]
     * @param  {[type]} value     [description]
     * @return {[type]}           [description]
     */
     buildDataStep3(finalData, key, value) {
        if (finalData.personal_message == undefined) {
            finalData.personal_message = {};
        }
        if (key == 'security_question') {
            finalData.personal_message.security_question = value;
        } else if (key == 'security_question_answer') {
            finalData.personal_message.security_question_answer = value;
        } else if (key == 'message') {
            finalData.personal_message.message = value;
        } else {
            finalData[key] = value;
        }
        return finalData;
    }

    /**
     * [updateComponentView description]
     * @param  {[type]} currentUser [description]
     * @param  {[type]} step        [description]
     * @return {[type]}             [description]
     */
     updateComponentView(currentUserId, step) {
        // get user data and then get messages
        // to paint and to check for unread messages
        User.getInstance().getUser(currentUserId).then((user) => {
            if (user != undefined) {
                this.drawUserProfileForm(user, step);
                this.registerEventsAfterDraw(step);
            }
        }).catch((err) => {
        });
    }

    /**
     * [registerEventsAfterDraw description]
     * @param  {[type]} step [description]
     * @return {[type]}      [description]
     */
     registerEventsAfterDraw(step) {
        $('.profile-form').submit(function(event) {
            event.preventDefault();
            // eslint-disable-next-line no-invalid-this
            UserProfileForm.getInstance().saveUserProfile($(this).attr('id'), step);
        });
        showElementEvent();
        hideElementEvent();
        globalContentChangerEvent();
        this.initEvent();
    }

    /**
     * init event when drawn first time
     * @return {[type]} [description]
     */
     initEvent() {
        $('.user-profile-menu-btn').click(function(event) {
            // eslint-disable-next-line no-invalid-this
            const newID = $(this).data('view-id');
            if (newID.includes('user-profile-form')) {
                UserProfileForm.getInstance().updateComponentView(currentUser._id, newID[newID.length - 1]);
            }
        });
    }
}