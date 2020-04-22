// eslint-disable-next-line no-unused-vars
class GlobalEventDispatcher {
    static updateAllUserLists() {
        APIHandler.getInstance().sendRequest('/usersList/', 'get', {}, true, null)
        .then( (res) => {})
        .catch( (err) => {});
    }
}