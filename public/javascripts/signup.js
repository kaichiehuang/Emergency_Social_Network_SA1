$(function () {


    function updateUsersList(){
        let jwt = Cookies.get('user-jwt-esn');
        $.ajax({
            url: apiPath + '/usersList/',
            type: 'get',
            headers: {
                "Authorization": jwt
            }
        }).done(function (response) {
            console.log(response);
        }).fail(function (e) {
            $("#update-status-alert").html(e);
            $("#update-status-alert").show();
        }).always(function () {
            console.log("complete");
        });
    }

    /**
     * [postMessage description]
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    function signup() {
        let name = $("#name").val();
        let last_name = $("#last_name").val();
        let username = $("#username").val();
        let password = $("#password").val();
        //validations
        $.ajax({
            url: apiPath + '/users/',
            type: 'post',
            data: {
                'name': name,
                'last_name': last_name,
                'username': username,
                'password': password
            },
        }).done(function (response) {
            if (response.user != undefined && response.tokens != undefined) {
                user_id = response.user.userId;
                username = response.user.username;
                userJWT = response.tokens.token;
                user_acknowledgement = response.user.acknowledgement;
                user_status = response.user.status;
                //set token in cookies since it is more secure
                Cookies.set('user-jwt-esn', userJWT);
                Cookies.set('user-jwt-refresh-esn', response.tokens.token);
                Cookies.set('user-id', user_id);
                Cookies.set('username', username);
                Cookies.set('user-acknowledgement', user_acknowledgement);
                Cookies.set('user-status', user_status);
                Cookies.set('online-status', response.user.onLine);

                $(".user-name-placeholder").html(username)
                if (user_acknowledgement) {
                    setOnline(true);
                    updateUsersList();
                    window.location.replace("/app")
                } else {
                    swapContent("acknowledgement-page-content");
                }
            }
            console.log(response)
            $("#signup-error-alert").hide();
        }).fail(function (response) {
            $("#signup-error-alert").html(response.responseJSON.msg);
            $("#signup-error-alert").show();
        }).always(function () {
            console.log("complete");
        });;
    }
    /**
     * [submitAcknowledgment description]
     * @return {[type]} [description]
     */
    function submitAcknowledgment() {
        if ($('#signup-acknowledgement').is(":checked")) {
            let acknowledgement = $("#signup-acknowledgement").val();
            let status = Cookies.get('status');
            let user_id = Cookies.get('user-id');
            let jwt = Cookies.get('user-jwt-esn');
            // //validations
            $.ajax({
                url: apiPath + '/users/' + user_id,
                type: 'put',
                data: {
                    'acknowledgement': true,
                    'status':"UNDEFINED",
                    'onLine':true
                },
                headers: { "Authorization": userJWT }
            }).done(function (response) {
                user_acknowledgement = response.user.acknowledgement;
                Cookies.set('user-acknowledgement', user_acknowledgement);
                setOnline(true);
                updateUsersList();
                window.location.replace("/app")
            }).fail(function () {
                $("#signup-error-alert").html();
                $("#signup-error-alert").show();
                //alert("all done")
            }).always(function () {
                console.log("complete");
            });
        }
    }




    /****** events declaration ********/

    $('#signup-submit-button').click(function (e) {
        e.preventDefault();
        signup();

    });
    $('#acknowledgement-submit-button').click(function (e) {
        e.preventDefault();
        submitAcknowledgment();
    });
});

