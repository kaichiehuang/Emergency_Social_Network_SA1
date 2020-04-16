class UserProfileForm {


    /**
     * changes the receiver for the private chat
     * @param  {[type]} receiver_user_id [description]
     * @return {[type]}                  [description]
     */
     static initiateUserProfileForm(profile_form_user_id) {
        Cookies.set('profile_form_user_id', profile_form_user_id);
        UserProfileForm.updateComponentView(profile_form_user_id, 1);
        UserProfileForm.initEvent()
    }

    /**
     * [drawUsers description]
     * @param  {[type]} containerId [description]
     * @return {[type]}             [description]
     */
     static drawUserProfileForm(user, step) {
        let containerId = "user-profile-form-content__container-" + step ;
        //1. find templates in html
        let profileTemplate = document.querySelector('template#userProfileFormTemplate' + step);
        //2. find container
        let profileFormContainer = document.getElementById(containerId);
        profileFormContainer.innerText = "";
        if (profileFormContainer != undefined) {
            //3. draw using the template
            if (profileTemplate != undefined && profileTemplate != null && user != undefined) {
                let template = profileTemplate.content.cloneNode(true);
                template.querySelector('input#form_user_id').value = (user._id != undefined) ? user._id : '';
                //set username
                template.querySelector('.user-profile__username').innerText = user.username;
                if(step == 1){
                    template = UserProfileForm.fillProfileFormStep1(user, template);
                }
                if(step == 2){
                    template = UserProfileForm.fillProfileFormStep2(user, template);
                }
                if(step == 3){
                    template = UserProfileForm.fillProfileFormStep3(user, template);
                }

                profileFormContainer.appendChild(template);
            }
        }
    }

    /**
     * [fillProfileFormStep1 description]
     * @param  {[type]} user     [description]
     * @param  {[type]} template [description]
     * @return {[type]}          [description]
     */
     static fillProfileFormStep1(user, template) {

        // set name
        template.querySelector('input#user-profile-form__name').value = (user.name != undefined) ? user.name : '';
        //set last name
        template.querySelector('input#user-profile-form__last_name').value = (user.last_name != undefined) ? user.last_name : '';
        //set birth date
        template.querySelector('input#user-profile-form__birth_date').value = (user.birth_date != undefined) ? user.birth_date : '';
        //set address
        template.querySelector('input#user-profile-form__address').value = (user.address != undefined) ? user.address : '';
        //set city
        template.querySelector('input#user-profile-form__city').value = (user.city != undefined) ? user.city : '';
        //set phone number
        template.querySelector('input#user-profile-form__phone_number').value = (user.phone_number != undefined) ? user.phone_number : '';
        //set emergency_contact
        if(user.emergency_contact != undefined){
            template.querySelector('input#user-profile-form__emergency_contact').value = (user.emergency_contact.name != undefined) ? user.emergency_contact.name : '';
            template.querySelector('input#user-profile-form__emergency_contact_phone_number').value = (user.emergency_contact.phone_number != undefined) ? user.emergency_contact.phone_number : '';
            template.querySelector('input#user-profile-form__emergency_contact_address').value = (user.emergency_contact.address != undefined) ? user.emergency_contact.address : '';
        }

        return template;
    }

    /**
     * Fills the content in the form of step2
     * @param  {[type]} user     [description]
     * @param  {[type]} template the template loaded in the draw function
     * @return {[type]}          the template with all the data
     */
     static fillProfileFormStep2(user, template) {
        //set emergency_contact
        template.querySelector('select#user-profile-form__blood_type').value = (user.medical_information != undefined && user.medical_information.blood_type != undefined) ? user.medical_information.blood_type : '';
        template.querySelector('textarea#user-profile-form__prescribed_drugs').innerText = (user.medical_information != undefined && user.medical_information.prescribed_drugs != undefined) ? user.medical_information.prescribed_drugs : '';

        if((user.medical_information != undefined && user.medical_information.prescribed_drugs != undefined && user.medical_information.prescribed_drugs != '')){
            template.querySelector('textarea#user-profile-form__prescribed_drugs').innerText = user.medical_information.prescribed_drugs;
            template.querySelector('input#has_prescribed_drugs1').checked = "checked";
            template.querySelector('textarea#user-profile-form__prescribed_drugs').classList.remove("hidden");
        }else{
            template.querySelector('textarea#user-profile-form__prescribed_drugs').innerText = '';
            template.querySelector('input#has_prescribed_drugs0').checked = "checked";
        }

        if((user.medical_information != undefined && user.medical_information.allergies != undefined && user.medical_information.allergies != '')){
            template.querySelector('textarea#user-profile-form__allergies').innerText = user.medical_information.allergies;
            template.querySelector('textarea#user-profile-form__allergies').classList.remove("hidden");
            template.querySelector('input#has_allergies1').checked = "checked";
        }else{
            template.querySelector('textarea#user-profile-form__allergies').innerText = '';
            template.querySelector('input#has_allergies0').checked = "checked";
        }

        return template;
    }

    /**
     * Fills the content in the form of step3
     * @param  {[type]} user     [description]
     * @param  {[type]} template the template loaded in the draw function
     * @return {[type]}          the template with all the data
     */
     static fillProfileFormStep3(user, template) {
        //set emergency_contact
        template.querySelector('textarea#user-profile-form__personal_message').innerText = (user.personal_message != undefined && user.personal_message.message != undefined) ? user.personal_message.message : '';
        template.querySelector('input#user-profile-form__security_question').value = (user.personal_message != undefined && user.personal_message.security_question != undefined) ? user.personal_message.security_question : '';
        template.querySelector('input#user-profile-form__security_question_answer').value = (user.personal_message != undefined && user.personal_message.security_question_answer != undefined) ? user.personal_message.security_question_answer : '';
        return template;
    }

    /**
     * Saves the data of a submitted form
     * @param  {[type]} formId [description]
     * @return {[type]}        [description]
     */
     static saveUserProfile(formId, step) {
        return new Promise((resolve, reject) => {
            const userId = $("#" + formId).find("#form_user_id").val();
            let data = UserProfileForm.buildData(formId);
            User.updateUser(userId, data)
            .then(user => {
                User.updateCurrentUser();

                if(step < 3){
                    let newStep = parseInt(step) + 1;
                    swapViewContent("user-profile-form" + newStep, "main-content-block");
                    UserProfileForm.updateComponentView(user._id, newStep);
                }else{
                    UserProfile.initiateUserProfile(userId);
                    swapViewContent("user-profile-content", "main-content-block");
                }
            }).catch(err => {
                alert(err);
            });
        });
    }

    static buildData(formId){
        let data = $("#" + formId).serializeArray();
        const step = $("#" + formId).find("#form_step").val();
        let finalData = {};
        for (var i = 0; i < data.length; i++) {
            let object = data[i];
            let key = object.name;
            let value = object.value;
            if(step == 1){
                finalData = UserProfileForm.buildDataStep1(finalData, key, value);
            }
            else if(step == 2){
                finalData = UserProfileForm.buildDataStep2(finalData, key, value);
            }
            else if(step == 3){
                finalData = UserProfileForm.buildDataStep3(finalData, key, value);
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
     static buildDataStep1(finalData, key, value){
        if(finalData.emergency_contact == undefined){
            finalData.emergency_contact = {};
        }

        if(key == "emergency_contact"){
            finalData.emergency_contact.name = value;
        }
        else if(key == "emergency_contact_phone_number"){
            finalData.emergency_contact.phone_number = value;
        }
        else if(key == "emergency_contact_address"){
            finalData.emergency_contact.address = value;
        }else{
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
     static buildDataStep2(finalData, key, value){
        if(finalData.medical_information == undefined){
            finalData.medical_information = {};
        }

        if(key == "prescribed_drugs"){
            finalData.medical_information.prescribed_drugs = "";
            if(finalData.has_prescribed_drugs == "1"){
                finalData.medical_information.prescribed_drugs = value;
            }
        }
        else if(key == "allergies"){
            finalData.medical_information.allergies = "";
            if(finalData.has_allergies == "1"){
                finalData.medical_information.allergies = value;
            }
        }
        if(key == "step"){
            finalData.step = value;
        }
        else{
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
     static buildDataStep3(finalData, key, value){
        if(finalData.personal_message == undefined){
            finalData.personal_message = {};
        }

        if(key == "security_question"){
            finalData.personal_message.security_question = value;
        }
        else if(key == "security_question_answer"){
            finalData.personal_message.security_question_answer = value;
        }
        else if(key == "message"){
            finalData.personal_message.message = value;
        }else{
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
     static updateComponentView(currentUserId, step) {
        //get user data and then get messages to paint and to check for unread messages
        User.getUser(currentUserId).then(user => {
            if (user != undefined) {
                UserProfileForm.drawUserProfileForm(user, step);
                UserProfileForm.registerEventsAfterDraw(step);
            }
        }).catch(err => {});
    }

    /**
     * [registerEventsAfterDraw description]
     * @param  {[type]} step [description]
     * @return {[type]}      [description]
     */
    static registerEventsAfterDraw(step){
        $('.profile-form').submit(function(event) {
            event.preventDefault();
            UserProfileForm.saveUserProfile($(this).attr("id"), step);
        });

        showElementEvent();
        hideElementEvent();
        globalContentChangerEvent();
        UserProfileForm.initEvent();
    }

    static initEvent(){
        $('.user-profile-menu-btn').click(function(event) {
            let newID = $(this).data('view-id');
            if (newID.includes("user-profile-form")) {
                UserProfileForm.updateComponentView(currentUser._id, newID[newID.length - 1]);
            }
        });
    }

}
/**
 * User profile behavior using jquery
 * @param  {[type]} ) {}          [description]
 * @return {[type]}   [description]
 */

 let currentFormStep = 1;

 $(function() {

});