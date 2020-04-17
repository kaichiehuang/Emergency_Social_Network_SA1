class StatusSelection {

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
            url: apiPath + '/users/' + user_id + '/status',
            type: 'put',
            data: {
                'status': status,
            },
            headers: {
                "Authorization": jwt
            }
        }).done(function(response) {
            console.log(response);
            //hide modal
            $('#status-modal').modal('toggle');
            Cookies.set('user-status', response.status);
            //tell server to emit user-list-update event
            GlobalEventDispatcher.updateAllUserLists();

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
        }).fail(function(e) {
            $("#update-status-alert").html(e);
            $("#update-status-alert").show();
        }).always(function() {
            console.log("complete");
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