let currentContentPageID = "";
let userJWT = null;
let user_id = null;
let user_name = null;

function swapContent(newID){
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
    if(userJWT == undefined || userJWT == ""){
        console.log("no token found ... user is not logged in")
    }
    //user is logged in
    else{

        user_id = Cookies.get('user-id');
        user_name = Cookies.get('user-name');
        swapContent("welcome-page-content");
        console.log("found cookie = " + userJWT)
    }

});