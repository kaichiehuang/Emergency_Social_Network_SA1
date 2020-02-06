let currentContentPageID = "";
let userJWT = null;
let user_id = null;
let user_name = null;
let user_acknowledgement = null;
let apiPath = "/api";

function swapContent(newID) {
    $(".main-content-block").addClass("hidden-main-content-block");
    $("#" + newID).removeClass("hidden-main-content-block");
    currentContentPageID = newID;
}
$(function() {
    //events
    $(".content-changer").click(function(event) {
        event.preventDefault();
        newID = $(this).data('view-id');
        swapContent(newID)
    });
    userJWT = Cookies.get('user-jwt-esn');
    //user is not logged in
    if (userJWT == undefined || userJWT == "") {
        console.log("no token found ... user is not logged in")
        if (window.location.pathname != "/") {
            window.location.replace("/")
        }
    }
    //user is logged in
    else {
        user_id = Cookies.get('user-id');
        user_name = Cookies.get('user-name');
        user_acknowledgement = Cookies.get('user-acknowledgement');
        if (window.location.pathname == "/") {
            if (user_acknowledgement) {
                window.location.replace("/app")
            } else {
                swapContent("acknowledgement-page-content");
            }
        }
        console.log("found cookie = " + userJWT)
    }
});