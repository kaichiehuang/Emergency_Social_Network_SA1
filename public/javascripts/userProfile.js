class UserProfile {
    static instance = null;

    /**
     * Singleton instance element
     * @return {[type]} [description]
     */
    static getInstance() {
        if (this.instance == null) {
            this.instance = new UserProfile();
        }
        return this.instance;
    }

    /**
     * changes the receiver for the private chat
     * @param  {[type]} receiver_user_id [description]
     */
    initiateUserProfile(profile_user_id) {
        Cookies.set('profile_user_id', profile_user_id);
        UserProfile.getInstance().updateComponentView(profile_user_id);
    }
    /**
     * Resets a User's profile view
     * @return {[type]} [description]
     */
    resetProfile() {
        document.getElementById('user-profile-content__container').innerText = '';
    }
    /**
     * [drawUsers description]
     * @param user
     */
    drawProfile(user) {
        const containerId = 'user-profile-content__container';
        // 1. find templates in html
        const profileTemplate = document.querySelector('template#userProfileTemplate');
        // 2. find container
        const profileContainer = document.getElementById(containerId);
        if (profileContainer != undefined) {
            // 3. draw using the template
            if (profileTemplate != undefined && profileTemplate != null && user != undefined) {
                let template = profileTemplate.content.cloneNode(true);
                //part 1 - personal info
                template = this.drawProfilePart1Info(user, template);
                //part 1 - emergency contact
                template = this.drawProfilePart1EmergencyContact(user, template);
                //part 2 - medical info
                template = this.drawProfilePart2Info(user, template);
                //part3 - personal message
                template = this.drawProfilePart3Info(user, template);

                // if user is not the same as current User remove edit buttons
                if (user._id != currentUser._id) {
                    template.querySelectorAll('.edit-profile-button').forEach((element) => element.remove());
                }
                profileContainer.appendChild(template);
            }
        }
    }
    /**
     * Add personal info to template component
     * @param  {[type]} user     [description]
     * @param  {[type]} template [description]
     * @return {[type]}          [description]
     */
    drawProfilePart1Info(user, template) {
        // set emergency_contact
        if (user.emergency_contact != undefined) {
            if (user.emergency_contact.name != undefined) {
                template.querySelector('.user-profile__emergency_contact').innerText = user.emergency_contact.name;
            }
            if (user.emergency_contact.phone_number != undefined) {
                template.querySelector('.user-profile__emergency_contact_phone_number').innerText = user.emergency_contact.phone_number;
            }
            if (user.emergency_contact.address != undefined) {
                template.querySelector('.user-profile__emergency_contact_address').innerText = user.emergency_contact.address;
            }
        }
        return template;
    }
    /**
     * Add emergency contact info to template component
     * @param  {[type]} user     [description]
     * @param  {[type]} template [description]
     * @return {[type]}          [description]
     */
    drawProfilePart1EmergencyContact(user, template) {
        // set username
        template.querySelectorAll('.user-profile__username').forEach((element) => element.innerText = user.username);
        // set name
        if (user.name != undefined) {
            template.querySelector('.user-profile__name').innerText = user.name;
        }
        // set last name
        if (user.last_name != undefined) {
            template.querySelector('.user-profile__last_name').innerText = user.last_name;
        }
        // set birth date
        if ((user.birth_date != undefined)) {
            template.querySelector('.user-profile__birth_date').innerText = new Date(Date.parse(user.birth_date)).toUTCString().toLocaleString();
        }
        // set address
        if (user.address != undefined) {
            template.querySelector('.user-profile__address').innerText = user.address;
        }
        // set city
        if (user.city != undefined) {
            template.querySelector('.user-profile__city').innerText = user.city;
        }
        // set phone number
        if (user.phone_number != undefined) {
            template.querySelector('.user-profile__phone_number').innerText = user.phone_number;
        }
        return template;
    }
    /**
     * Meedical info in profile
     * @param  {[type]} user     [description]
     * @param  {[type]} template [description]
     * @return {[type]}          [description]
     */
    drawProfilePart2Info(user, template) {
        // set medical information
        if (user.medical_information != undefined) {
            if (user.medical_information.blood_type != undefined) {
                template.querySelector('.user-profile__blood_type').innerText = user.medical_information.blood_type;
            }
            if (user.medical_information.prescribed_drugs != undefined) {
                template.querySelector('.user-profile__prescribed_drugs').innerText = user.medical_information.prescribed_drugs;
            }
            if (user.medical_information.allergies != undefined) {
                template.querySelector('.user-profile__allergies').innerText = user.medical_information.allergies;
            }
        }
        return template;
    }
    /**
     * Personal message
     * @param  {[type]} user     [description]
     * @param  {[type]} template [description]
     * @return {[type]}          [description]
     */
    drawProfilePart3Info(user, template) {
        // set personal message information
        if (user.personal_message != undefined) {
            let question = ' -- No question available --';
            if (user.personal_message.security_question != undefined) {
                question = user.personal_message.security_question;
            }
            template.querySelector('.user-profile__personal-message-q').innerText = question;
        }
        return template;
    }
    /**
     * Updates the UI
     * @param  {[type]} currentUser [description]
     */
    updateComponentView(currentUserId) {
        // get user data and then get messages to
        // paint and to check for unread messages
        UserProfile.getInstance().resetProfile();
        User.getUser(currentUserId).then((user) => {
            if (user != undefined) {
                UserProfile.getInstance().drawProfile(user);
            }
        }).catch((err) => {
            showElements('profile-not-authorized');
        }).finally(() => {
            UserProfile.getInstance().registerEventsAfterDraw();
        });
    }
    /**
     * Events needed after UI is rendered
     * @return {[type]} [description]
     */
    registerEventsAfterDraw() {
        globalContentChangerEvent();
        if (Cookies.get('profile_user_id') == currentUser._id) {
            $('.edit-profile-button').click(function(event) {
                UserProfileForm.initiateUserProfileForm(currentUser._id);
            });
        }
        $('#user-profile__personal-message-form').submit(function(event) {
            event.preventDefault();
            UserProfile.getInstance().validatePersonalMessageQuestion();
        });
        showElementEvent();
        hideElementEvent();
    }
    /**
     * Validate a Users personal message question before displaying the personal message
     * @return {[type]} [description]
     */
    validatePersonalMessageQuestion() {
        const security_question_answer = $('#user-profile__personal-message-q-answer').val();
        const userId = Cookies.get('profile_user_id');
        User.getPersonalMessage(userId, security_question_answer).then((result) => {
            $('#user-profile__personal-message').html(result.message);
            showElements('user-profile__personal-message-container');
        }).catch((err) => {
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
    $('.menu-content-changer').click(function(event) {
        // eslint-disable-next-line no-invalid-this
        const newID = $(this).data('view-id');
        if (newID === 'user-profile-content') {
            UserProfile.getInstance().initiateUserProfile(currentUser._id);
        }
    });
    $('.btn-profile-update-invite').click(function(event) {
        // eslint-disable-next-line no-invalid-this
        const newID = $(this).data('view-id');
        if (newID === 'user-profile-content') {
            UserProfile.getInstance().initiateUserProfile(currentUser._id);
        }
    });
});