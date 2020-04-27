class APIHandler {

    static instance = null;

    /**
     * Sends requests to API for every component or object using Jquery
     * @param  {[type]} url         [description]
     * @param  {[type]} operation   [description]
     * @param  {[type]} data        [description]
     * @param  {[type]} token       [description]
     * @param  {[type]} contentType [description]
     * @return {[type]}             [description]
     */
    sendRequest(url, operation, data, token, contentType) {
        $("#boxloader").show();
        const jwt = Cookies.get('user-jwt-esn');

        let contentTypeOption = contentType ?
            contentType : "application/x-www-form-urlencoded; charset=UTF-8";

        let headers = token ? {
            Authorization: jwt
        } : {};

        let dataSend = data ? data : {};

        let options = {
            url: apiPath + url,
            type: operation,
            data: dataSend,
            headers: headers,
            contentType: contentTypeOption
        };

        return new Promise((resolve, reject) => {
            $.ajax(options)
                .done(function(response) {
                    resolve(response);
                })
                .fail(function(e) {
                    if(e.responseText == "jwt expired" || e.responseText == "invalid algorithm" || e.responseText == "invalid token" || e.responseText == "jwt malformed" ){
                        SignoutComponent.getInstance().removeCookies();
                        SignoutComponent.getInstance().signout();
                        return reject(false);
                    }else{
                        reject(e);
                    }
                })
                .always(function(){
                    $("#boxloader").hide();
                })
        });
    }

    /**
     * Singleton instance element
     * @return {[type]} [description]
     */
    static getInstance() {
        if (this.instance == null) {
            this.instance = new APIHandler();
        }
        return this.instance;
    }
}