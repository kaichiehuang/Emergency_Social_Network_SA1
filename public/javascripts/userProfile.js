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
            // $("#" + containerId).html("");
            //3. draw using the template
            if (profileTemplate != undefined && profileTemplate != null && user != undefined) {
                let template = profileTemplate.content.cloneNode(true);
                //set username
                template.querySelector('.user-profile__username').innerText = user.username;

                //set name
                template.querySelector('.user-profile__name').innerText = user.name;

                //set last name
                template.querySelector('.user-profile__last_name').innerText = user.last_name;
                //set address
                template.querySelector('.user-profile__address').innerText = user.address;
                //set city
                template.querySelector('.user-profile__city').innerText = user.city;
                //set phone number
                template.querySelector('.user-profile__phone_number').innerText = user.phone_number;
                //set emergency_contact
                template.querySelector('.user-profile__emergency_contact').innerText = user.emergency_contact.name;
                template.querySelector('.user-profile__emergency_contact_phone_number').innerText = user.emergency_contact.phone_number;
                template.querySelector('.user-profile__emergency_contact_address').innerText = user.emergency_contact.address;



                // template.querySelector('.chat-button').setAttribute('data-user-id', user._id);
                // //set message counter from user
                // if (currentUser.unread_messages != undefined && currentUser.unread_messages[user._id] != undefined && currentUser.unread_messages[user._id] > 0) {
                //     template.querySelector('.message-counter').innerText = currentUser.unread_messages[user._id];
                // }
                // if (user.status === "OK") {
                //     template.querySelector("#statusSpan").classList.add("background-color-ok");
                //     template.querySelector("#iconStatus").classList.add("fa-check");
                // } else if (user.status === "HELP") {
                //     template.querySelector("#statusSpan").classList.add("background-color-help");
                //     template.querySelector("#iconStatus").classList.add("fa-exclamation");
                // } else if (user.status === "EMERGENCY") {
                //     template.querySelector("#statusSpan").classList.add("background-color-emergency");
                //     template.querySelector("#iconStatus").classList.add("fa-exclamation-triangle");
                // } else if (user.status === "UNDEFINED") {
                //     template.querySelector("#statusSpan").classList.add("background-color-undefined");
                //     template.querySelector("#iconStatus").classList.add("fa-question");
                // }
                profileContainer.appendChild(template);
            }

            // assign view change event for chat button for each user in the list
            // contentChangerEvent();
            // $('.chat-button').click(function(event) {
            //     PrivateChatMessage.initiatePrivateChat($(this).data('user-id'));
            // });
        }
    }


    //todo pass this to a class AddressBook that has an attribute currentUser
    static updateComponentView(currentUser) {
        //get user data and then get messages to paint and to check for unread messages
        User.getUser(currentUser._id)
        .then(user => {
            if(user != undefined){
                UserProfile.drawProfile(user);
            }
        }).catch(err => {});
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

    //Initial call to get the user list after login
    UserProfile.updateComponentView(currentUser);

    //Click event, to update user list when the user switch between views
    $(".content-changer").click(function(event) {
        event.preventDefault();
        let newID = $(this).data('view-id');
        if (newID === "user-profile-content") {
            UserProfile.updateComponentView(currentUser);
        }
    });
});

