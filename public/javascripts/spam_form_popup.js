class SpamForm {
    sendSpamReport() {
        console.log('-----sending----------');
        const spamMsgId = $('#spam_msg_id').val();
        const spamUserId = $('#spam_user_id').val();
        const level = $('input[name=\'level\']:checked').val();
        const type = $('input[name=\'type\']:checked').val();
        const desc = $('#description').val();
        $.ajax({
            url: apiPath + '/spam-report',
            type: 'post',
            data: {
                'level': level,
                'type': type,
                'description': desc,
                'current_user_id': Cookies.get('user-id'),
                'reported_user_id': spamUserId,
                'message_id': spamMsgId
            },
            headers: {
                'Authorization': Cookies.get('user-jwt-esn')
            }
        }).done(function() {
            console.log('spam report sent successfully');
            // hide modal
            $('#spam-modal').modal('hide');
        }).fail(function(e) {
            console.log('err happens:' + e);
        }).always(function() {
            console.log('complete');
        });
    }
}
$(function() {
    $('#spam-report-button').on('click', function(e) {
        e.preventDefault();
        const spamForm = new SpamForm();
        spamForm.sendSpamReport();
    });
    $('#spam-modal').modal('hide');
    return false;
});
