class SpamForm {
    sendSpamReport() {
        console.log('-----sending----------');
        const spamMsgId = $('#spam_msg_id').val();
        const spamUserId = $('#spam_user_id').val();
        const level = $('input[name=\'level\']:checked').val();
        const type = $('input[name=\'type\']:checked').val();
        const desc = $('#description').val();
        const data =  {
            'level': level,
            'type': type,
            'description': desc,
            'current_user_id': Cookies.get('user-id'),
            'reported_user_id': spamUserId,
            'message_id': spamMsgId
        };

        APIHandler.getInstance()
            .sendRequest( '/spam-report' ,
                'post',data,true,null)
            .then((response)=>{
                $('#spam-modal').modal('hide');
            })
            .catch(error =>{
                console.log('err happens:' + error);
            });

    }
}

$(function() {
    $('#spam-modal').on('hidden.bs.modal', function() {
        $('#spam-report-form').get(0).reset();
        $("#spam-error-alert").hide();
    });
    $('#spam-report-button').on('click', function(e) {
        e.preventDefault();
        if ($('input[name=\'type\']:checked').val() == undefined) {
            $("#spam-error-alert").html("Please choose a spam type.");
            $("#spam-error-alert").show();
            return false;
        }
        if ($('#description').val().length == 0) {
            $("#spam-error-alert").html("Please provide spam description.");
            $("#spam-error-alert").show();
            return false;
        }
        const spamForm = new SpamForm();
        spamForm.sendSpamReport();
    });
    $('#spam-modal').modal('hide');
    return false;
});
