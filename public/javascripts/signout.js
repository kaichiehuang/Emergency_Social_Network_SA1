$(function() {
    function signout() {
        GlobalEventDispatcher.updateAllUserLists();
        Cookies.remove('user-jwt-esn', {path: ''});
        Cookies.remove('user-jwt-refresh-esn', {path: ''});
        Cookies.remove('user-id', {path: ''});
        Cookies.remove('user-name', {path: ''});
        Cookies.remove('user-acknowledgement', {path: ''});
        Cookies.remove('user-status', {path: ''});


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

        window.location.replace('/');
    }
    function signoutUser() {
        setOnline(false);
        signout();
    }
    /** **** events declaration ********/
    $('a[href="#signout-action"]').click(function(e) {
        e.preventDefault();
        signoutUser();
    });

    socket.on('logout-user', () => {
        signoutUser();
    });
});
