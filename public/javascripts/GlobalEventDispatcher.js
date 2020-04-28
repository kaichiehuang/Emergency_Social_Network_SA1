// eslint-disable-next-line no-unused-vars
class GlobalEventDispatcher {
    /**
     * Call the API to notify that every user device should update the user list
     * @return {[type]} [description]
     */
    static updateAllUserLists() {
        APIHandler.getInstance().sendRequest('/usersList/', 'get', {}, true, null, false)
        .then( (res) => {})
        .catch( (err) => {});
    }
}
