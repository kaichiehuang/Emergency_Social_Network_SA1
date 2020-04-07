class UserProfileForm {
    constructor(step) {
        this.step = step;
    }

    /**
     * [drawUsers description]
     * @param  {[type]} containerId [description]
     * @return {[type]}             [description]
     */
    static drawProfileForm(user, step) {
        let containerId = "user-profile-form-content__container-" + step ;
        //1. find templates in html
        let profileTemplate = document.querySelector('template#userProfileFormTemplate' + step);
        //2. find container
        let profileFormContainer = document.getElementById(containerId);
        profileFormContainer.innerText = "";
        if (profileFormContainer != undefined) {
            // $("#" + containerId).html("");
            //3. draw using the template
            if (profileTemplate != undefined && profileTemplate != null && user != undefined) {
                let template = profileTemplate.content.cloneNode(true);
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
     * [drawProfileFormStep1 description]
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
        template.querySelector('input#user-profile-form__emergency_contact').value = (user.emergency_contact.name != undefined) ? user.emergency_contact.name : '';
        template.querySelector('input#user-profile-form__emergency_contact_phone_number').value = (user.emergency_contact.phone_number != undefined) ? user.emergency_contact.phone_number : '';
        template.querySelector('input#user-profile-form__emergency_contact_address').value = (user.emergency_contact.address != undefined) ? user.emergency_contact.address : '';

        return template;
    }

    /**
     * [drawProfileFormStep1 description]
     * @param  {[type]} user     [description]
     * @param  {[type]} template [description]
     * @return {[type]}          [description]
     */
    static fillProfileFormStep2(user, template) {

        //set emergency_contact
        template.querySelector('select#user-profile-form__blood_type').value = (user.medical_information.blood_type != undefined) ? user.medical_information.blood_type : '';
        template.querySelector('textarea#user-profile-form__prescribed_drugs').innerText = (user.medical_information.prescribed_drugs != undefined) ? user.medical_information.prescribed_drugs : '';
        template.querySelector('textarea#user-profile-form__allergies').innerText = (user.medical_information.prescribed_drugs != undefined) ? user.medical_information.allergies : '';

        return template;
    }

    /**
     * [updateComponentView description]
     * @param  {[type]} currentUser [description]
     * @param  {[type]} step        [description]
     * @return {[type]}             [description]
     */
    static updateComponentView(currentUser, step) {
        //get user data and then get messages to paint and to check for unread messages
        User.getUser(currentUser._id).then(user => {
            if (user != undefined) {
                UserProfileForm.drawProfileForm(user, step);
                UserProfileForm.registerEventsAfterDraw();
            }
        }).catch(err => {});
    }

    static registerEventsAfterDraw(){
        // globalContentChangerEvent();
        showElementEvent();
    }
}
/**
 * User profile behavior using jquery
 * @param  {[type]} ) {}          [description]
 * @return {[type]}   [description]
 */

let currentFormStep = 1;

$(function() {
    //initialize current user
    currentUser = new User();
    currentUser._id = Cookies.get('user-id');

    $('.profile-form').submit(function(event) {
        event.preventDefault();
        alert("submiting form");
    });
});