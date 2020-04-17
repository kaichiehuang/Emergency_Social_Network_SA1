$(function() {
    function signout() {
        GlobalEventDispatcher.updateAllUserLists();
        let jwt = Cookies.get('user-jwt-esn');
        Cookies.remove('user-jwt-esn', { path: '' });
        Cookies.remove('user-jwt-refresh-esn', { path: '' });
        Cookies.remove('user-id', { path: '' });
        Cookies.remove('user-name', { path: '' });
        Cookies.remove('user-acknowledgement', { path: '' });
        Cookies.remove('user-status',  { path: '' });

        window.location.replace("/");
    }

    /****** events declaration ********/

    $('a[href="#signout-action"]').click(function(e) {
        e.preventDefault();
        setOnline(false);
        signout();
    });

});