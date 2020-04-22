class GlobalController {

    constructor(){
        this.actualUser = null;

        //find user and store it in variable
    }

    /* istanbul ignore next */
    isAdmin() {
        if(this.getRole() == "admin"){
            return true;
        }
        return false;
    }

    isCoordinator() {
        if(this.getRole() == "coordinator"){
            return true;
        }
        return false;
    }

}
module.exports = GlobalController;
