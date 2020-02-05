$(function() {
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
            url: '/users',
            type: 'post',
            data: {
                'name': name,
                'last_name': last_name,
                'username': username,
                'password': password
            },
        }).done(function(response) {
            if (response.user != undefined && response.tokens != undefined) {
                user_id = response.user.userId;
                user_name = response.user.name;
                userJWT = response.tokens.token;
                //set token in cookies since it is more secure
                Cookies.set('user-jwt-esn', userJWT);
                Cookies.set('user-jwt-refresh-esn', response.tokens.token);
                Cookies.set('user-id', user_id);
                Cookies.set('user-name', user_name);
                $(".user-name-placeholder").html(user_name)
                swapContent("welcome-page-content");
            }
            console.log(response)
            $("#signup-error-alert").hide();
        }).fail(function(response) {
            $("#signup-error-alert").html(response.responseJSON.msg);
            $("#signup-error-alert").show();
        }).always(function() {
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
            // //validations
            $.ajax({
                url: '/users/' + user_id,
                type: 'put',
                data: {
                    'acknowledgement': true
                },
                headers: {"Authorization": userJWT}
            }).done(function(response) {
                alert("all done")
                // swapContent("welcome-page-content");
            }).fail(function() {
                $("#signup-error-alert").html("asdfghjkdfghj");
                $("#signup-error-alert").show();
                alert("all done")
            }).always(function() {
                console.log("complete");
            });
        }
    }


    /****** events declaration ********/

    $('#signup-submit-button').click(function(e) {
        e.preventDefault();
        signup();
    });
    $('#acknowledgement-submit-button').click(function(e) {
        e.preventDefault();
        submitAcknowledgment();
    });
});