class User {
    constructor() {
        this._id = null;
        this.username = "";
        this.unread_messages = {};
    }
    /**
     * [getUserData description]
     * @param  {[type]} userId [description]
     * @return {[type]}        [description]
     */
    static getUserData(userId) {
        if (userId != null) {
            return new Promise((resolve, reject) => {
                let jwt = Cookies.get('user-jwt-esn');
                $.ajax({
                    url: apiPath + '/users/' + userId,
                    type: 'get',
                    headers: {
                        "Authorization": jwt
                    }
                }).done(function(response) {
                    let user = new User;
                    user.username = response.username;
                    user.unread_messages = {};
                    user.unread_messages = response.unread_messages;
                    resolve(user);
                }).fail(function(e) {
                    reject(e.message)
                }).always(function() {
                    console.log("complete");
                });
            });
        }
    }
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
            // assign view change event for chat button for each user in the list
            contentChangerEvent();
            $('.chat-button').click(function(event) {
                PrivateChatMessage.initiatePrivateChat($(this).data('user-id'));
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

    static showEmergencyStatus(userId) {
        console.log("user id is "+userId);
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

            response.forEach(function (pictureObj) {
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
    static drawNoUsers(){
        $("#user-list-content__list li").remove();
        $("#user-list-content .no-results-message").removeClass("hidden");
    }
    /**
     * Returns a list of users from the API
     * @return {[type]} [description]
     */
    static getUsers(keyword, status) {
        let data = {
            "username": keyword,
            "status": status
        };
        return new Promise((resolve, reject) => {
            let jwt = Cookies.get('user-jwt-esn');
            $.ajax({
                "url": apiPath + '/users',
                "type": 'get',
                "headers": {
                    "Authorization": jwt
                },
                "data": data
            }).done(function(response) {
                resolve(response);
            }).fail(function(e) {
                reject(e.message)
            }).always(function() {
                console.log("complete");
            });
        });
    }
    //todo pass this to a class AddressBook that has an attribute currentUser
    static updateUserListView(currentUser, searchKeyword, searchStatus) {
        //get user data and then get messages to paint and to check for unread messages
        User.getUserData(currentUser._id).then(user => {
            currentUser.unread_messages = user.unread_messages;
            return User.getUsers(searchKeyword, searchStatus);
        }).then(users => {
            if(users.length > 0){
                User.drawUsers(users, currentUser);
            }else{
                User.drawNoUsers();
            }

        }).catch(err => {});
    }
}

/**
 * User behavior using jquery
 * @param  {[type]} ) {}          [description]
 * @return {[type]}   [description]
 */
let currentUser = null;
let selectedStatus = null;

$(function() {
    const socket = io('/');

    //initialize current user
    currentUser = new User();
    currentUser._id = Cookies.get('user-id');

    //Initial call to get the user list after login
    User.updateUserListView(currentUser, "", "");

    //Socket IO implementation to update user list on every change of users data.
    socket.on("user-list-update", () => {
        User.updateUserListView(currentUser, $("#search-users-list__input").val(), "")
    });
    //Click event, to update user list when the user switch between views
    $(".content-changer").click(function(event) {
        event.preventDefault();
        let newID = $(this).data('view-id');
        if (newID === "user-list-content") {
            User.updateUserListView(currentUser, $("#search-users-list__input").val(), "");
        }
    });

    /**
     * form submit button event // triggered by submit and enter event by default
     */
    $("#search-users-list__button, #users-search-form .status-list__color").click(function (e) {
        e.preventDefault();
        let searchKeyword = $("#search-users-list__input").val();
        let newSelectedStatus = $(this).data('status');
        if(newSelectedStatus != undefined ){
            //removing filter
            if(selectedStatus == newSelectedStatus){
                $("#users-search-form .status-list__color").addClass('non-selected');
                selectedStatus = null;
            }
            else{
                $("#users-search-form .status-list__color").addClass('non-selected');
                $(this).removeClass('non-selected');
                selectedStatus = newSelectedStatus;
            }
        }



        User.updateUserListView(currentUser, searchKeyword, selectedStatus);
    });

});

