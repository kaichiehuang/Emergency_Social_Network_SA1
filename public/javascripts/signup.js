$(function() {
    /**
     * [postMessage description]
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    function signup() {
        const name = $('#name').val();
        const last_name = $('#last_name').val();
        let username = $('#username').val();
        const password = $('#password').val();


        const data = {
            'name': name,
            'last_name': last_name,
            'username': username,
            'password': password
        };

        APIHandler.getInstance()
            .sendRequest('/users/', 'post', data,
                false, null).then((response) => {
                if (response.user != undefined &&
                    response.tokens != undefined) {
                    user_id = response.user.userId;
                    username = response.user.username;
                    userJWT = response.tokens.token;
                    user_acknowledgement = response.user.acknowledgement;
                    user_status = response.user.status;
                    // set token in cookies since it is more secure
                    Cookies.set('user-jwt-esn', userJWT);
                    Cookies.set('user-jwt-refresh-esn',
                        response.tokens.ex_token);
                    Cookies.set('user-id', user_id);
                    Cookies.set('username', username);
                    Cookies.set('user-acknowledgement', user_acknowledgement);
                    Cookies.set('user-status', user_status);
                    Cookies.set('online-status', response.user.onLine);

                    $('.user-name-placeholder').html(username);
                    if (user_acknowledgement) {
                        User.getInstance().setOnline(true);
                        GlobalEventDispatcher.updateAllUserLists();
                        window.location.replace('/app');
                    } else {
                        swapViewContent('acknowledgement-page-content',
                            'main-content-block');
                    }
                }
                console.log(response);
                $('#signup-error-alert').hide();
            })
            .catch((error) => {
                $('#signup-error-alert').html(error.responseJSON.msg);
                $('#signup-error-alert').show();
            });
    }

    /**
     * [submitAcknowledgment description]
     * @return {[type]} [description]
     */
    function submitAcknowledgment() {
        if ($('#signup-acknowledgement').is(':checked')) {
            const user_id = Cookies.get('user-id');
            // //validations
            $.ajax({
                url: apiPath + '/users/' + user_id,
                type: 'put',
                data: {
                    'acknowledgement': true,
                    'status': 'UNDEFINED',
                    'onLine': true
                },
                headers: {'Authorization': userJWT}
            }).done(function(response) {
                user_acknowledgement = response.acknowledgement;
                Cookies.set('user-acknowledgement', user_acknowledgement);
                User.getInstance().setOnline(true);
                GlobalEventDispatcher.updateAllUserLists();
                window.location.replace('/app');
            }).fail(function() {
                $('#signup-error-alert').html();
                $('#signup-error-alert').show();
            }).always(function() {
                console.log('complete');
            });
        }
    }


    /** **** events declaration ********/

    $('#signup-submit-button').click(function(e) {
        e.preventDefault();
        signup();
    });
    $('#acknowledgement-submit-button').click(function(e) {
        e.preventDefault();
        submitAcknowledgment();
    });
});

