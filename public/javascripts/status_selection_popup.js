class StatusSelection {

  // constructor () {
  //   $(".content-changer").addEventListener('click', event => this.showModal(event));
  // }
  constructor() {

    const statusButton = document.getElementById("status-button");
    statusButton.addEventListener("click", this.showModal);

    const confirmButton = document.getElementById("statusConfirmButton");
    confirmButton.addEventListener("click", this.statusConfirm);


  }

  statusConfirm() {
    let status = $('.modal-instructions :checked').val();
    let user_id = Cookies.get('user-id');
    let jwt = Cookies.get('user-jwt-esn');
    let acknowledgement = Cookies.get('user-acknowledgement');
    let online_status = Cookies.get('online-status');

    $.ajax({
      url: apiPath + '/users/' + user_id,
      type: 'put',
      data: {
        'onLine': online_status,
        'acknowledgement': acknowledgement,
        'status': status,
      },
      headers: {
        "Authorization": jwt
      }
    }).done(function (response) {
      console.log(response);
      //hide modal
      $('#status-modal').modal('toggle');
      Cookies.set('user-status', response.user.status);
    }).fail(function (e) {
      $("#update-status-alert").html(e);
      $("#update-status-alert").show();
    }).always(function () {
      console.log("complete");
    });
  }

  // setStatus() {
  //   let status = Cookies.get('user-status');
  //   $(status).prop( "checked", true );
  // }

  showModal() {
    let newID = $(this).data('view-id');
    if (newID === "status-content") {
      // $('#status-modal').modal({ show: true });
      $('#status-modal').modal('toggle');
      let status = Cookies.get('user-status');
      
      $("#"+status).prop("checked", true);
    }



  }

}


$(function () {
  new StatusSelection();
})