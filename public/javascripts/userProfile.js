class UserProfile {

    /**
     * changes the receiver for the private chat
     * @param  {[type]} receiver_user_id [description]
     * @return {[type]}                  [description]
     */
     static initiateUserProfile(profile_user_id) {
        Cookies.set('profile_user_id', profile_user_id);
        UserProfile.updateComponentView(profile_user_id);
    }

    static resetProfile(){
        document.getElementById("user-profile-content__container").innerText = "";
    }
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
                if(user.emergency_contact != undefined){
                    template.querySelector('.user-profile__emergency_contact').innerText = (user.emergency_contact.name != undefined) ? user.emergency_contact.name : '';
                    template.querySelector('.user-profile__emergency_contact_phone_number').innerText = (user.emergency_contact.phone_number != undefined) ? user.emergency_contact.phone_number : '';
                    template.querySelector('.user-profile__emergency_contact_address').innerText = (user.emergency_contact.address != undefined) ? user.emergency_contact.address : '';
                }
                //set medical information
                if(user.medical_information != undefined){
                    template.querySelector('.user-profile__blood_type').innerText = (user.medical_information.blood_type != undefined) ? user.medical_information.blood_type : '';
                    template.querySelector('.user-profile__prescribed_drugs').innerText = (user.medical_information.prescribed_drugs != undefined) ? user.medical_information.prescribed_drugs : '';
                    template.querySelector('.user-profile__allergies').innerText = (user.medical_information.allergies != undefined) ? user.medical_information.allergies : '';
                }

                //if user is not the same as current User remove edit buttons
                if(user._id != currentUser._id){
                    template.querySelectorAll('.edit-profile-button').forEach(element => element.remove());
                }
                profileContainer.appendChild(template);
            }
        }
    }

    /**
     * Updates the UI
     * @param  {[type]} currentUser [description]
     * @return {[type]}             [description]user-profile__personal-message-container
     */
     static updateComponentView(currentUserId) {
        //get user data and then get messages to paint and to check for unread messages
        UserProfile.resetProfile();
        User.getUser(currentUserId).then(user => {
            if (user != undefined) {
                UserProfile.drawProfile(user);
            }
        }).catch(err => {
            showElements("profile-not-authorized");
        }).finally(() => {
            UserProfile.registerEventsAfterDraw();
        });
    }
    /**
     * Events needed after UI is rendered
     * @return {[type]} [description]
     */
     static registerEventsAfterDraw(){
        globalContentChangerEvent();
        if(Cookies.get('profile_user_id') == currentUser._id){
            $('.edit-profile-button').click(function(event) {
                UserProfileForm.initiateUserProfileForm(currentUser._id);
            });
        }
        $("#user-profile__personal-message-form").submit(function(event) {
            event.preventDefault();
            UserProfile.validatePersonalMessageQuestion();
        });

        showElementEvent();
        hideElementEvent();

    }

    static validatePersonalMessageQuestion(){
        let security_question_answer = $("#user-profile__personal-message-q-answer").val();
        let userId = Cookies.get('profile_user_id');
        User.getPersonalMessage(userId, security_question_answer)
        .then(result =>{
            $("#user-profile__personal-message").html(result.message);
            showElements("user-profile__personal-message-container");
        })
        .catch(err => {
            alert(err);
        });
    }
}
/**
 * User profile behavior using jquery
 * @param  {[type]} ) {}          [description]
 * @return {[type]}   [description]
 */
 $(function() {
    // from menu clicking on profile displays a users own profile
    $(".menu-content-changer").click(function(event) {
        let newID = $(this).data('view-id');
        if (newID === "user-profile-content") {
            UserProfile.initiateUserProfile(currentUser._id);
        }
    });

    $(".btn-profile-update-invite").click(function(event) {
        let newID = $(this).data('view-id');
        if (newID === "user-profile-content") {
            UserProfile.initiateUserProfile(currentUser._id);
        }
    });


});