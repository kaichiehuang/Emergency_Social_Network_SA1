class UserList {
    /**
     * [drawUsers description]
     * @param  {[type]} containerId [description]
     * @return {[type]}             [description]
     */
    static drawUsers(users, currentUser) {
        let containerId = "user-list-content__list";
        $("#user-list-content .no-results-message").addClass("hidden");
        //1. find templates in html
        const onlineTemplate = document.querySelector('template#onlineUserTemplate');
        const offlineTemplate = document.querySelector('template#offlineUserTemplate');
        const emptyListTemplate = document.querySelector('template#emptyListUserTemplate');
        //2. find container
        let listContainer = document.getElementById(containerId);
        $("#" + containerId + " li").remove();
        if (listContainer != undefined) {
            //3. iterate over users list and draw using the appropiate template based on online/offline state
            for (let i = 0; i < users.length; i++) {
                const user = users[i];
                var template = null;
                //4. online state
                if (onlineTemplate != undefined && user.onLine == true) {
                    template = onlineTemplate.content.cloneNode(true);
                }
                //5. offline state
                else if (offlineTemplate != undefined && (user.onLine == false || user.onLine == undefined)) {
                    template = offlineTemplate.content.cloneNode(true);
                }
                if (template != undefined && template != null && user != undefined) {
                    template.querySelector('.username').innerText = user.username;
                    template.querySelector('.username').setAttribute('data-user-id', user._id);
                    template.querySelector('.chat-button').setAttribute('data-user-id', user._id);
                    template.querySelector('.status-button').setAttribute('data-user-id', user._id);
                    //set message counter from user
                    if (currentUser.unread_messages != undefined && currentUser.unread_messages[user._id] != undefined && currentUser.unread_messages[user._id] > 0) {
                        template.querySelector('.message-counter').innerText = currentUser.unread_messages[user._id];
                    }
                    if (user.status === "OK") {
                        template.querySelector("#statusSpan").classList.add("background-color-ok");
                        template.querySelector("#iconStatus").classList.add("fa-check");
                        template.querySelector('.status-button').setAttribute('data-status', "ok");
                    } else if (user.status === "HELP") {
                        template.querySelector("#statusSpan").classList.add("background-color-help");
                        template.querySelector("#iconStatus").classList.add("fa-exclamation");
                        template.querySelector('.status-button').setAttribute('data-status', "help");
                    } else if (user.status === "EMERGENCY") {
                        template.querySelector("#statusSpan").classList.add("background-color-emergency");
                        template.querySelector("#iconStatus").classList.add("fa-exclamation-triangle");
                        template.querySelector('.status-button').setAttribute('data-status', "Emergency");
                    } else if (user.status === "UNDEFINED") {
                        template.querySelector("#statusSpan").classList.add("background-color-undefined");
                        template.querySelector("#iconStatus").classList.add("fa-question");
                        template.querySelector('.status-button').setAttribute('data-status', "undefined");
                    }
                    listContainer.appendChild(template);
                }
            }
            UserList.registerEventsAfterDraw()
        }
    }
    static showEmergencyStatus(userId) {
        console.log("user id is " + userId);
        $('#userEmergencyDetail').modal('show');
        let jwt = Cookies.get('user-jwt-esn');
        //get brief description and location
        $.ajax({
            url: apiPath + '/emergencyStatusDetail/' + userId,
            type: 'get',
            headers: {
                "Authorization": jwt
            }
        }).done(function(response) {
            console.log(response);
            //brief description
            document.getElementById("userBriefDescriptionPreview").innerHTML = response.status_description;
            //location description
            document.getElementById("userLocationDescriptionPreview").innerHTML = response.share_location;
        }).fail(function(e) {
            $("#get-emergency-detail-alert").html(e);
            $("#get-emergency-detail-alert").show();
        }).always(function() {
            console.log("complete");
        });
        $(".userPicAndDesBlock").empty();
        //get picutures and description
        $.ajax({
            url: apiPath + '/emergencyStatusDetail/picture/' + userId,
            type: 'get',
            headers: {
                "Authorization": jwt
            }
        }).done(function(response) {
            console.log(response);
            response.forEach(function(pictureObj) {
                console.log(pictureObj);
                let t = document.querySelector('#userPictureAndDescriptionTemplate');
                t.content.querySelector('img').src = pictureObj.picture_path;
                t.content.querySelector('div').id = pictureObj._id;
                t.content.querySelector('p').innerHTML = pictureObj.picture_description;
                let clone = document.importNode(t.content, true);
                let pictureContainer = document.getElementsByClassName('userSharePicture');
                pictureContainer[0].appendChild(clone);
            })
        }).fail(function(e) {
            $("#get-picture-and-description-alert").html(e);
            $("#get-picture-and-description-alert").show();
        }).always(function() {
            console.log("complete");
        });
    }
    /**
     * draws empty list of users
     * @return {[type]} [description]
     */
    static drawNoUsers() {
        $("#user-list-content__list li").remove();
        $("#user-list-content .no-results-message").removeClass("hidden");
    }
    //todo pass this to a class AddressBook that has an attribute currentUser
    static updateComponentView(currentUser, searchKeyword, searchStatus) {
        //get user data and then get messages to paint and to check for unread messages
        User.getUser(currentUser._id).then(user => {
            currentUser.unread_messages = user.unread_messages;
            return User.getUsers(searchKeyword, searchStatus);
        }).then(users => {
            if (users.length > 0) {
                UserList.drawUsers(users, currentUser);
            } else {
                UserList.drawNoUsers();
            }
        }).catch(err => {});
    }
    /**
     * [registerEventsAfterDraw description]
     * @return {[type]} [description]
     */
    static registerEventsAfterDraw() {
        globalContentChangerEvent();
        // assign view change event for chat button for each user in the list
        menuContentChangerEvent();
        $('.chat-button').click(function(event) {
            PrivateChatMessage.initiatePrivateChat($(this).data('user-id'));
        });
        $('.username').click(function(event) {
            UserProfile.initiateUserProfile($(this).data('user-id'));
        });
        //show emergency status detail
        $('.status-button').unbind().click(function(event) {
            let clickedUserId = $(this).data('user-id');
            let clickedUserStatus = $(this).data('status');
            if (clickedUserStatus === "Emergency") {
                User.showEmergencyStatus(clickedUserId);
            }
        });
    }
}
/**
 * User List behavior using jquery
 * @param  {[type]} ) {}          [description]
 * @return {[type]}   [description]
 */
$(function() {
    //Initial call to get the user list after login
    UserList.updateComponentView(currentUser, "", "");
    //Socket IO implementation to update user list on every change of users data.
    socket.on("user-list-update", () => {
        UserList.updateComponentView(currentUser, $("#search-users-list__input").val(), "")
    });
    //Click event, to update user list when the user switch between views
    $(".menu-content-changer").click(function(event) {
        event.preventDefault();
        let newID = $(this).data('view-id');
        if (newID === "user-list-content") {
            UserList.updateComponentView(currentUser, $("#search-users-list__input").val(), "");
        }
    });
    /**
     * form submit button event // triggered by submit and enter event by default
     */
    $("#search-users-list__button, #users-search-form .status-list__color").click(function(e) {
        e.preventDefault();
        let searchKeyword = $("#search-users-list__input").val();
        let newSelectedStatus = $(this).data('status');
        if (newSelectedStatus != undefined) {
            //removing filter
            if (selectedStatus == newSelectedStatus) {
                $("#users-search-form .status-list__color").addClass('non-selected');
                selectedStatus = null;
            } else {
                $("#users-search-form .status-list__color").addClass('non-selected');
                $(this).removeClass('non-selected');
                selectedStatus = newSelectedStatus;
            }
        }
        UserList.updateComponentView(currentUser, searchKeyword, selectedStatus);
    });
});