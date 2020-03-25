class UserListController {
    updateUserList(req, res) {
        res.io.emit('user-list-update');
        res.status(201).send("Updating Users Lists");
    }
}
module.exports = UserListController;
