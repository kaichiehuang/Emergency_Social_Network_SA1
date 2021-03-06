class SignoutComponent {
    /**
     * Initializing view
     */
    constructor() {
        this.instance = undefined;
    }

    /**
     * Singleton instance element
     * @return {[type]} [description]
     */
    static getInstance() {
        if (this.instance === undefined) {
            this.instance = new SignoutComponent();
        }
        return this.instance;
    }

    /**
     * Log out function
     * @return {[type]} [description]
     */
    signout() {
        User.getInstance().setOnline(false);
        if(Cookies.remove('user-jwt-esn') != undefined){
            //update all users
            GlobalEventDispatcher.updateAllUserLists();
        }
        this.removeCookies();
        this.redirectHomePage();
    }
    /**
     * Remove all the info from the cookie
     * @return {[type]} [description]
     */
    removeCookies() {
        Cookies.remove('user-jwt-esn', {path: ''});
        Cookies.remove('user-jwt-refresh-esn', {path: ''});
        Cookies.remove('user-id', {path: ''});
        Cookies.remove('user-name', {path: ''});
        Cookies.remove('user-acknowledgement', {path: ''});
        Cookies.remove('user-status', {path: ''});
    }
    /**
     * Redirect user to home page
     * @return {[type]} [description]
     */
    redirectHomePage() {
        if(window!= undefined && window.location != undefined){
            window.location.replace('/');
        }
    }

    /**
     * Register logout events
     * @return {[type]} [description]
     */
    registerEvents() {

        /** **** events declaration ********/
        $('a[href="#signout-action"]').click(function(e) {
            e.preventDefault();
            SignoutComponent.getInstance().signout();
            SignoutComponent.getInstance().redirectHomePage();
        });

        socket.on('logout-user', (data) => {
            SignoutComponent.getInstance().signout();
            showElements('sign-out-poppup');
        });

        $('.btn-exit-popup').on('click', (e) => {
            SignoutComponent.getInstance().redirectHomePage();
        });
    }

}
$(function() {
    SignoutComponent.getInstance().registerEvents();
});