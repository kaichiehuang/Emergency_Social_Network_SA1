$(function() {
    function signout() {
        setOnline(false);
        GlobalEventDispatcher.updateAllUserLists();
        removeCookies();

        APIHandler.getInstance()
            .sendRequest('/usersList/',
                'get', null, true, null)
            .then((response) => {
                console.log(response);
            })
            .catch((error) => {
                $('#update-status-alert').html(error);
                $('#update-status-alert').show();
            });
    }

    function removeCookies() {
        Cookies.remove('user-jwt-esn', {path: ''});
        Cookies.remove('user-jwt-refresh-esn', {path: ''});
        Cookies.remove('user-id', {path: ''});
        Cookies.remove('user-name', {path: ''});
        Cookies.remove('user-acknowledgement', {path: ''});
        Cookies.remove('user-status', {path: ''});
    }
    function redirectHomePage() {
        window.location.replace('/');
    }
    /** **** events declaration ********/
    $('a[href="#signout-action"]').click(function(e) {
        e.preventDefault();
        signout();
        redirectHomePage();
    });

    socket.on('logout-user', (data) => {
        signout();
        showElements('sign-out-poppup');
    });

    $('.btn-exit-popup').on('click', (e) => {
        redirectHomePage();
    });
});
