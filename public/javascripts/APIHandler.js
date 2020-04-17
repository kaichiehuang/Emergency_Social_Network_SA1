class APIHandler {

    static instance = null;

    constructor() {
    }

    sendRequest(url, operation, data, token, contentType) {
        let jwt = Cookies.get('user-jwt-esn');

        let contentTyoeOption = contentType ?
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
            contentType: contentTyoeOption
        };

        return new Promise((resolve, reject) => {
            $.ajax(options)
                .done(function (response) {
                    resolve(response);
                })
                .fail(function (e) {
                    console.log('Request Error' + e);
                    reject(e);
                })
        });
    }

    static getInstance() {
        if (this.instance == null) {
            this.instance = new APIHandler();
        }
        return this.instance;
    }
}