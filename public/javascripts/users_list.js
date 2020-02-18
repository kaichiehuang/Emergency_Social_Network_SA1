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

                    listContainer.appendChild(template);
                }
            }
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
    let userModel = new User;
    User.getUsers().then(users => {
        User.drawUsers(users, "user-list-content__list")
    }).catch(err => {});
});