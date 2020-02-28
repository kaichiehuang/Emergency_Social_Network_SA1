$(function() {
  $(".content-changer").click(function(event) {
    event.preventDefault();
    let newID = $(this).data('view-id');
    if(newID === "status-content") {
      $('#status-modal').modal({show:true});

    }


  })
})