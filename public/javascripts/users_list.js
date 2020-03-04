class User {
    /**
     * [drawUsers description]
     * @param  {[type]} containerId [description]
     * @return {[type]}             [description]
     */
    static drawUsers(users, containerId) {
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
                    if (user.status === "OK") {
                        template.querySelector("#statusSpan").classList.add("background-color-ok");
                        template.querySelector("#iconStatus").classList.add("fa-check");
                    } else if (user.status === "HELP") {
                        template.querySelector("#statusSpan").classList.add("background-color-help");
                        template.querySelector("#iconStatus").classList.add("fa-exclamation");
                    } else if (user.status === "EMERGENCY") {
                        template.querySelector("#statusSpan").classList.add("background-color-emergency");
                        template.querySelector("#iconStatus").classList.add("fa-exclamation-triangle");
                    } else if (user.status === "UNDEFINED") {
                        template.querySelector("#statusSpan").classList.add("background-color-undefined");
                        template.querySelector("#iconStatus").classList.add("fa-question");
                    }
                    listContainer.appendChild(template);
                }
            }
            // assign view change event for chat button for each user in the list
            viewChangerEvent();

            $('.chat-button').click(function(event) {
                initiatePrivateChat($(this).data('user-id'));
            });
        }
    }
    /**
     * Returns a list of users from the API
     * @return {[type]} [description]
     */
    static getUsers() {
        return new Promise((resolve, reject) => {
            let jwt = Cookies.get('user-jwt-esn');
            $.ajax({
                url: apiPath + '/users',
                type: 'get',
                headers: {
                    "Authorization": jwt
                }
            }).done(function(response) {
                resolve(response);
            }).fail(function(e) {
                reject(e.message)
            }).always(function() {
                console.log("complete");
            });
        });
    }
}
/**
 * User behavior using jquery
 * @param  {[type]} ) {}          [description]
 * @return {[type]}   [description]
 */
$(function() {
    const socket = io('http://localhost:3000');
    //Initial call to get the user list after login
    User.getUsers().then(users => {
        User.drawUsers(users, "user-list-content__list")
    }).catch(err => {});
    //Socket IO implementation to update user list on every change of users data.
    socket.on("user-list-update", () => {
        User.getUsers().then(users => {
            User.drawUsers(users, "user-list-content__list")
        }).catch(err => {});
    });
    //Click event, to update user list when the user switch between views
    $(".content-changer").click(function(event) {
        event.preventDefault();
        let newID = $(this).data('view-id');
        if (newID === "user-list-content") {
            User.getUsers().then(users => {
                User.drawUsers(users, "user-list-content__list")
            }).catch(err => {});
        }
    });
});