$(function() {
    function signout() {

        let jwt = Cookies.get('user-jwt-esn');

        Cookies.remove('user-jwt-esn', { path: '' });
        Cookies.remove('user-jwt-refresh-esn', { path: '' });
        Cookies.remove('user-id', { path: '' });
        Cookies.remove('user-name', { path: '' });
        Cookies.remove('user-acknowledgement', { path: '' });
        Cookies.remove('user-status',  { path: '' });


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

        window.location.replace("/");
    }

    /****** events declaration ********/

    $('a[href="#signout-action"]').click(function(e) {
        e.preventDefault();
        setOnline(false);
        signout();
    });

});