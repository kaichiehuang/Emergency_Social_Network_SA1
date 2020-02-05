let currentContentPageID = "";

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
});