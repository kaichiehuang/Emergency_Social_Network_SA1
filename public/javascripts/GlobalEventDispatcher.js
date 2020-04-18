class GlobalEventDispatcher {
    static updateAllUserLists() {
        let jwt = Cookies.get('user-jwt-esn');
        $.ajax({
            url: apiPath + '/usersList/',
            type: 'get',
            headers: {
                "Authorization": jwt
            }
        }).done(function(response) {
            console.log(response);
        }).fail(function(e) {
        }).always(function() {
            console.log("complete");
        });
    }
}