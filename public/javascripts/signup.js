$(function() {

    /**
     * [postMessage description]
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    function signup() {
        $("#signup-error-alert").html("asdfghjkdfghj");
        $("#signup-error-alert").show();
        var name = $("#name").val();
        var last_name = $("#last_name").val();
        var username = $("#username").val();
        var password = $("#password").val();
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
            if(response.user != undefined && response.tokens != undefined){
                //set token in cookies since it is more secure
                Cookies.set('user-jwt-esn', response.tokens.token);
                Cookies.set('user-jwt-refresh-esn', response.tokens.token);
            }
            console.log(response)
            $("#message").val("");
        }).fail(function() {

            console.log("error");
        }).always(function() {
            console.log("complete");
        });;
    }
    $('#signup-submit-button').click(function(e) {
        e.preventDefault();
        signup();
    });
});