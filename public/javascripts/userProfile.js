class UserProfile {
    /**
     * [drawUsers description]
     * @param  {[type]} containerId [description]
     * @return {[type]}             [description]
     */
    static drawProfile(user) {
        let containerId = "user-profile-content__container";
        //1. find templates in html
        let profileTemplate = document.querySelector('template#userProfileTemplate');
        //2. find container
        let profileContainer = document.getElementById(containerId);
        profileContainer.innerText = "";
        if (profileContainer != undefined) {

            //3. draw using the template
            if (profileTemplate != undefined && profileTemplate != null && user != undefined) {
                let template = profileTemplate.content.cloneNode(true);
                //set username
                template.querySelector('.user-profile__username').innerText = user.username;
                //set name
                template.querySelector('.user-profile__name').innerText = (user.name != undefined) ? user.name : '';
                //set last name
                template.querySelector('.user-profile__last_name').innerText = (user.last_name != undefined) ? user.last_name : '';
                //set birth date
                template.querySelector('.user-profile__birth_date').innerText = (user.birth_date != undefined) ? new Date(Date.parse(user.birth_date)).toUTCString().toLocaleString() : '';
                //set address
                template.querySelector('.user-profile__address').innerText = (user.address != undefined) ? user.address : '';
                //set city
                template.querySelector('.user-profile__city').innerText = (user.city != undefined) ? user.city : '';
                //set phone number
                template.querySelector('.user-profile__phone_number').innerText = (user.phone_number != undefined) ? user.phone_number : '';
                //set emergency_contact
                template.querySelector('.user-profile__emergency_contact').innerText = (user.emergency_contact.name != undefined) ? user.emergency_contact.name : '';
                template.querySelector('.user-profile__emergency_contact_phone_number').innerText = (user.emergency_contact.phone_number != undefined) ? user.emergency_contact.phone_number : '';
                template.querySelector('.user-profile__emergency_contact_address').innerText = (user.emergency_contact.address != undefined) ? user.emergency_contact.address : '';
                //set medical information
                template.querySelector('.user-profile__blood_type').innerText = (user.medical_information.blood_type != undefined) ? user.medical_information.blood_type : '';
                template.querySelector('.user-profile__prescribed_drugs').innerText = (user.medical_information.prescribed_drugs != undefined) ? user.medical_information.prescribed_drugs : '';
                template.querySelector('.user-profile__allergies').innerText = (user.medical_information.allergies != undefined) ? user.medical_information.allergies : '';
                profileContainer.appendChild(template);
            }
        }
    }
    //todo pass this to a class AddressBook that has an attribute currentUser
    static updateComponentView(currentUser) {
        //get user data and then get messages to paint and to check for unread messages
        User.getUser(currentUser._id).then(user => {
            if (user != undefined) {
                UserProfile.drawProfile(user);
                UserProfile.registerEventsAfterDraw();
            }
        }).catch(err => {});
    }

    static registerEventsAfterDraw(){
        globalContentChangerEvent();
        $('.content-changer').click(function(event) {
            let newID = $(this).data('view-id');
            if (newID.includes("user-profile-form")) {
                UserProfileForm.updateComponentView(currentUser, newID[newID.length - 1]);
            }
        });
    }
}
/**
 * User profile behavior using jquery
 * @param  {[type]} ) {}          [description]
 * @return {[type]}   [description]
 */
$(function() {
    //initialize current user
    currentUser = new User();
    currentUser._id = Cookies.get('user-id');

    //
    $(".menu-content-changer").click(function(event) {
        let newID = $(this).data('view-id');
        if (newID === "user-profile-content") {
            UserProfile.updateComponentView(currentUser);
        }
    });

    //Click event, to update user list when the user switch between views
    // $(".edit-profile").click(function(event) {
    //     event.preventDefault();
    //     let newID = $(this).data('view-id');
    //     swapContent(newID, '.main-content-block');
    // });
});