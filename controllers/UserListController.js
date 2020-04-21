/**
 * userlist controller
 */
class UserListController {
    /**
     * update user list
     */
    /* istanbul ignore next */
    // eslint-disable-next-line require-jsdoc
    updateUserList(req, res) {
        res.io.emit('user-list-update');
        res.status(201).send('Updating Users Lists');
    }
}
module.exports = UserListController;
