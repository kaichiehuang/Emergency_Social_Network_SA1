class SpamForm {
    constructor() {
        const confirmButton = document.getElementById('spam-report-button');
        confirmButton.addEventListener('click', this.sendSpamReport);
    }

    sendSpamReport() {
        const status = $('.modal-instructions :checked').val();
        const current_user_id = Cookies.get('user-id');
        const jwt = Cookies.get('user-jwt-esn');
        $.ajax({
            url: apiPath + '/spam-report',
            type: 'post',
            data: {
                'status': status,
            },
            headers: {
                'Authorization': jwt
            }
        }).done(function(response) {
            console.log(response);
            // hide modal
            $('#status-modal').modal('toggle');
            Cookies.set('user-status', response.user.status);
            // tell server to emit user-list-update event
            $.ajax({
                url: apiPath + '/usersList/',
                type: 'get',
                headers: {
                    'Authorization': jwt
                }
            }).done(function(response) {
                console.log(response);
            }).fail(function(e) {
                $('#update-status-alert').html(e);
                $('#update-status-alert').show();
            }).always(function() {
                console.log('complete');
            });
            // change header icon for status
            if (status === 'OK') {
                $('#statusIcon').removeClass();
                $('#statusIcon').addClass('fa fa-check');
            } else if (status === 'HELP') {
                $('#statusIcon').removeClass();
                $('#statusIcon').addClass('fa fa-exclamation');
            } else if (status === 'EMERGENCY') {
                $('#statusIcon').removeClass();
                $('#statusIcon').addClass('fa fa-exclamation-triangle');
            } else if (status === 'UNDEFINED') {
                $('#statusIcon').removeClass();
                $('#statusIcon').addClass('fa fa-question');
            }
        }).fail(function(e) {
            $('#update-status-alert').html(e);
            $('#update-status-alert').show();
        }).always(function() {
            console.log('complete');
        });
    }
}
$(function() {
    $('#spam-report-button').on('click', function(e) {
        e.preventDefault();
        console.log("----spam_shot");
        e.preventDefault();
        console.log($('#spam_user_id').val());
        console.log($('#spam_msg_id').val());

        console.log($("input[name='level']:checked").val());
        console.log($("input[name='type']:checked").val());
        console.log($('#description').val());
    });
    //
    // $("#spam-report-form").submit(function() {
    //     console.log("----spam_shot");
    //     console.log($('this').attr('level'));
    //     console.log($('this').attr('type'));
    //     console.log($('this').attr('description'));
    // });
    $('#spam-modal').modal('hide');
    return false;
});
