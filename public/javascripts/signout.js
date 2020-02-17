$(function() {
    function signout() {
        Cookies.remove('user-jwt-esn', { path: '' });
        Cookies.remove('user-jwt-refresh-esn', { path: '' });
        Cookies.remove('user-id', { path: '' });
        Cookies.remove('user-name', { path: '' });
        Cookies.remove('user-acknowledgement', { path: '' });
        $.ajax({
            url: apiPath + '/users/logout',
            type: 'put',
            headers: {"Authorization": userJWT}
        }).done(function(response) {
            window.location.replace("/");
        }).fail(function() {
            $("#signup-error-alert").html("asdfghjkdfghj");
            $("#signup-error-alert").show();
            alert("all done")
        }).always(function() {
            window.location.replace("/");
            console.log("sign out complete");
        });
    }

    /****** events declaration ********/

    $('a[href="#signout-action"]').click(function(e) {
        e.preventDefault();
        signout();
    });

});