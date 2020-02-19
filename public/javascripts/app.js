let currentContentPageID = "";
let userJWT = null;
let user_id = null;
let user_name = null;
let user_acknowledgement = null;
let apiPath = "/api";

/**
 * Swaps visible content. It receives an ID to show and hides everything with the class  main-content-block
 * @param  {[type]} newID [description]
 * @return {[type]}       [description]
 */
function swapContent(newID) {
    $(".main-content-block").addClass("hidden-main-content-block");
    $("#" + newID).removeClass("hidden-main-content-block");
    currentContentPageID = newID;
}

$(function() {

    if(Cookies.get('username')!== undefined){
        $(".user-name-reference").html(Cookies.get('username'));
    }

    //events
    $(".content-changer").click(function(event) {
        $(".content-changer").removeClass('active')
        $(this).addClass("active");
        event.preventDefault();
        let newID = $(this).data('view-id');
        if(newID != undefined && newID != ""){
            swapContent(newID)
        }

    });

    userJWT = Cookies.get('user-jwt-esn');
    //user is not logged in
    if (userJWT == null || userJWT == undefined || userJWT == "") {
        console.log("no token found ... user is not logged in")
        if (window.location.pathname != "/") {
            window.location.replace("/")
        }
    }
    //user is logged in
    else {

        //TODO test if cookie is expired

        user_id = Cookies.get('user-id');
        user_name = Cookies.get('username');
        user_acknowledgement = Cookies.get('user-acknowledgement');
        if (window.location.pathname == "/") {
            if (  user_acknowledgement === "true") {
                window.location.replace("/app")
            } else {
                swapContent("acknowledgement-page-content");
            }
        }
        console.log("found cookie = " + userJWT)
    }
});