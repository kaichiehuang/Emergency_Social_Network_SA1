class UserList {

    static instance;
    /**
     * Singleton instance element
     * @return {[type]} [description]
     */
    static getInstance() {
        if (this.instance === undefined) {
            this.instance = new UserList();
        }
        return this.instance;
    }

    /**
     * changes the receiver for the private chat
     * @param  {[type]} receiver_user_id [description]
     */
    initiateUserList() {
        this.updateComponentView(currentUser,
            $('#search-users-list__input').val(), '');
        $('#users-search-form .status-list__color')
            .addClass('non-selected');
    }

    /**
     * [drawUsers description]
     * @param  {[type]} containerId [description]
     * @return {[type]}             [description]
     */
     drawUsers(users, currentUser) {
        const containerId = 'user-list-content__list';
        $('#user-list-content .no-results-message').addClass('hidden');
        // 1. find templates in html
        const onlineTemplate = document.querySelector('template#onlineUserTemplate');
        const offlineTemplate = document.querySelector('template#offlineUserTemplate');
        // 2. find container
        const listContainer = document.getElementById(containerId);
        $('#' + containerId + ' li').remove();
        if (listContainer == undefined || (onlineTemplate == undefined && offlineTemplate == undefined)) {
            return;
        }
        // 3. iterate over users list and draw using the
        // appropriate template based on online/offline state
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            let template = null;
            // 4. online state
            template = onlineTemplate.content.cloneNode(true);
            // 5. offline state
            if (user.onLine == false || user.onLine == undefined) {
                template = offlineTemplate.content.cloneNode(true);
            }

            if (template == undefined || template ==
                null || user == undefined) {
                return;
            }

            //draw
            template.querySelector('.username')
                .innerText = user.username;
            template.querySelector('.username')
                .setAttribute('data-user-id', user._id);
            template.querySelector('.chat-button')
                .setAttribute('data-user-id', user._id);
            template.querySelector('.chat-button')
                .setAttribute('data-username', user.username);
            template.querySelector('.status-button')
                .setAttribute('data-user-id', user._id);
            // set message counter from user
            if (currentUser.unread_messages != undefined &&
                currentUser.unread_messages[user._id] != undefined &&
                currentUser.unread_messages[user._id] > 0) {
                template.querySelector('.message-counter').innerText =
                    currentUser.unread_messages[user._id];
            }

            if(user.status != undefined){
                this.drawUserStatues(template, user)
            }

            listContainer.appendChild(template);
        }
        this.registerEventsAfterDraw();

    }

    /**
     * Draws status info and icon
     * @param  {[type]} template [description]
     * @return {[type]}          [description]
     */
    drawUserStatues(template, user){
        let userStatusLC = user.status.toLowerCase();
        template.querySelector('#statusSpan')
            .classList.add('background-color-' + userStatusLC);
        template.querySelector('.status-button')
            .setAttribute('data-status', user.status);

        if (user.status === 'OK') {
            template.querySelector('#iconStatus')
                .classList.add('fa-check');
        } else if (user.status === 'HELP') {
            template.querySelector('#iconStatus')
                .classList.add('fa-exclamation');
        } else if (user.status === 'EMERGENCY') {
            template.querySelector('#iconStatus')
                .classList.add('fa-exclamation-triangle');
        } else if (user.status === 'UNDEFINED') {
            template.querySelector('#iconStatus')
                .classList.add('fa-question');
        }
        return template;
    }

    /**
     * Show the detail of an emergency status
     * @param  {[type]} userId [description]
     * @return {[type]}        [description]
     */
    showEmergencyStatus(userId) {
        $('#userEmergencyDetail').modal('show');
        //display detail
        this.getUserStatusDetail(userId);
        //display picture
        this.getUserStatusPictures(userId);
    }
    /**
     * [getUserStatusDetail description]
     * @return {[type]} [description]
     */
    getUserStatusDetail(userId){
        // get brief description and location
        APIHandler.getInstance()
            .sendRequest('/emergencyStatusDetail/' + userId,
                'get', null, true, null)
            .then((response) => {
                // brief description
                document.getElementById('userBriefDescriptionPreview')
                    .innerHTML = response.status_description;
                // location description
                document.getElementById('userLocationDescriptionPreview')
                    .innerHTML = response.share_location;
            })
            .catch((error) => {
                $('#get-emergency-detail-alert').html(error);
                $('#get-emergency-detail-alert').show();
            });
    }
    /**
     * Gets picture for user status
     * @return {[type]} [description]
     */
    getUserStatusPictures(userId){
        $('.userPicAndDesBlock').empty();
        // get picutures and description
        APIHandler.getInstance()
            .sendRequest('/emergencyStatusDetail/picture/' + userId,
                'get', null, true, null)
            .then((response) => {
                response.forEach(function(pictureObj) {
                    const t = document
                        .querySelector('#userPictureAndDescriptionTemplate');
                    t.content.querySelector('img').src =
                        pictureObj.picture_path;
                    t.content.querySelector('div').id =
                        pictureObj._id;
                    t.content.querySelector('p').innerHTML =
                        pictureObj.picture_description;
                    const clone = document.importNode(t.content, true);
                    const pictureContainer = document
                        .getElementsByClassName('userSharePicture');
                    pictureContainer[0].appendChild(clone);
                });
            })
            .catch((error) => {
                $('#get-picture-and-description-alert').html(error);
                $('#get-picture-and-description-alert').show();
            });
    }

    /**
     * draws empty list of users
     * @return {[type]} [description]
     */
     drawNoUsers() {
        $('#user-list-content__list li').remove();
        $('#user-list-content .no-results-message').removeClass('hidden');
    }

    // todo pass this to a class AddressBook that has an attribute currentUser
     updateComponentView(currentUser, searchKeyword, searchStatus) {
        // get user data and then get messages to
        // paint and to check for unread messages
        User.getInstance().getUser(currentUser._id).then((user) => {
            currentUser.unread_messages = user.unread_messages;
            return User.getInstance().getUsers(searchKeyword, searchStatus);
        }).then((users) => {
            if (users.length > 0) {
                UserList.getInstance().drawUsers(users, currentUser);
            } else {
                UserList.getInstance().drawNoUsers();
            }
        }).catch((err) => {
        });
    }

    /**
     * [registerEventsAfterDraw description]
     */
     registerEventsAfterDraw() {
        globalContentChangerEvent();
        // assign view change event for chat button for each user in the list
        menuContentChangerEvent();
        $('.chat-button').click(function(event) {
            $('.menu-content-changer').removeClass('active');
            $("#private-chat-content-menu").addClass('active');
            // eslint-disable-next-line no-invalid-this
            PrivateChatMessage.getInstance().initiatePrivateChat($(this).data('user-id'), $(this).data('username'));

        });
        $('.username').click(function(event) {
            // eslint-disable-next-line no-invalid-this
            UserProfile.getInstance().initiateUserProfile($(this).data('user-id'));
        });
        // show emergency status detail
        $('.status-button').unbind().click(function(event) {
            // eslint-disable-next-line no-invalid-this
            const clickedUserId = $(this).data('user-id');
            // eslint-disable-next-line no-invalid-this
            const clickedUserStatus = $(this).data('status');
            if (clickedUserStatus.toLowerCase() == 'emergency') {
                UserList.getInstance().showEmergencyStatus(clickedUserId);
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
    // Initial call to get the user list after login
    UserList.getInstance().updateComponentView(currentUser, '', '');
    // Socket IO implementation to update
    // user list on every change of users data.
    socket.on('user-list-update', () => {
        UserList.getInstance().updateComponentView(currentUser,
            $('#search-users-list__input').val(), '');
    });
    // Click event, to update user list when the user switch between views
    $('.menu-content-changer').click(function(event) {
        event.preventDefault();
        // eslint-disable-next-line no-invalid-this
        const newID = $(this).data('view-id');
        if (newID === 'user-list-content') {
            UserList.getInstance().initiateUserList();
        }
    });
    /**
     * form submit button event
     * triggered by submit and enter event by default
     */
    $('#search-users-list__button, #users-search-form .status-list__color')
        .click(function(e) {
            e.preventDefault();
            const searchKeyword = $('#search-users-list__input').val();
            // eslint-disable-next-line no-invalid-this
            const newSelectedStatus = $(this).data('status');
            if (newSelectedStatus != undefined) {
            // removing filter
                if (selectedStatus == newSelectedStatus) {
                    $('#users-search-form .status-list__color')
                        .addClass('non-selected');
                    selectedStatus = null;
                } else {
                    $('#users-search-form .status-list__color')
                        .addClass('non-selected');
                    // eslint-disable-next-line no-invalid-this
                    $(this).removeClass('non-selected');
                    selectedStatus = newSelectedStatus;
                }
            }
            UserList.getInstance().updateComponentView(currentUser,
                searchKeyword, selectedStatus);
        });
});
