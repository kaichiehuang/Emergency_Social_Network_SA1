class StatusSelection {

    constructor() {
        const statusButton = document.getElementById("status-button");
        statusButton.addEventListener("click", this.showModal);
        const confirmButton = document.getElementById("statusConfirmButton");
        confirmButton.addEventListener("click", this.statusConfirm);
    }

    updateAllUserLists() {
        APIHandler.getInstance()
            .sendRequest( '/usersList/' ,
                'get',null,true,null)
            .then((response)=>{
                console.log(response);
            })
            .catch(error =>{
                $("#update-status-alert").html(error);
                $("#update-status-alert").show();
            });
    }

    statusConfirm() {
        let status = $('.modal-instructions :checked').val();
        let user_id = Cookies.get('user-id');
        let jwt = Cookies.get('user-jwt-esn');
        let acknowledgement = Cookies.get('user-acknowledgement');
        let online_status = Cookies.get('online-status');
        const data ={'status': status,};

        APIHandler.getInstance()
            .sendRequest( '/users/' + user_id + '/status',
                'put',data,true,null)
            .then((response)=>{

                $('#status-modal').modal('toggle');
                Cookies.set('user-status', response.user.status);

                APIHandler.getInstance()
                    .sendRequest(  '/usersList/',
                        'get',null,true,null)
                    .then((response)=>{
                        console.log(response);
                    })
                    .catch(error =>{
                        $("#update-status-alert").html(error);
                        $("#update-status-alert").show();
                    });
                //change header icon for status
                if (status === "OK") {
                    $("#statusIcon").removeClass();
                    $("#statusIcon").addClass("fa fa-check");
                } else if (status === "HELP") {
                    $("#statusIcon").removeClass();
                    $("#statusIcon").addClass("fa fa-exclamation");
                } else if (status === "EMERGENCY") {
                    $("#statusIcon").removeClass();
                    $("#statusIcon").addClass("fa fa-exclamation-triangle");
                } else if (status === "UNDEFINED") {
                    $("#statusIcon").removeClass();
                    $("#statusIcon").addClass("fa fa-question");
                }
                //if status is emergency
                if (status === "EMERGENCY") {
                    $('.content-changer').removeClass('active');
                    $('#status-button').addClass('active');
                    event.preventDefault();
                    let newID = $('#status-button').data('view-id');
                    if (newID != undefined && newID != '') {
                        swapViewContent(newID);
                    }

                }
            })
            .catch(error =>{
                $("#update-status-alert").html(error);
                $("#update-status-alert").show();
            });
    }

    showModal() {
        let newID = $(this).data('view-id');
        if (newID === "status-content") {
            // $('#status-modal').modal({ show: true });
            $('#status-modal').modal('toggle');
            let status = Cookies.get('user-status');
            $("#" + status).prop("checked", true);
        }
    }
}
$(function() {
    new StatusSelection();
})