/**
 * modal component for status selection
 */
class StatusSelection {
    /**
     * [constructor description]
     * @return {[type]} [description]
     */
    constructor() {
        const statusButton = document.getElementById('status-button');
        statusButton.addEventListener('click', this.showModal);
        const confirmButton = document.getElementById('statusConfirmButton');
        confirmButton.addEventListener('click', this.statusConfirm);
    }
    /**
     * Singleton instance element
     * @return {[type]} [description]
     */
    static getInstance() {
        if (this.instance === undefined) {
            this.instance = new StatusSelection();
        }
        return this.instance;
    }

    /**
     * [statusConfirm description]
     * @return {[type]} [description]
     */
    statusConfirm() {
        const status = $('.modal-instructions :checked').val();
        const user_id = Cookies.get('user-id');
        const data = {'status': status};

        APIHandler.getInstance()
            .sendRequest('/users/' + user_id + '/status',
                'put', data, true, null)
            .then((response) => {
                $('#status-modal').modal('toggle');
                Cookies.set('user-status', response.status);

                GlobalEventDispatcher.updateAllUserLists();
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
                // if status is emergency
                if (status === 'EMERGENCY') {
                    $('.content-changer').removeClass('active');
                    $('#status-button').addClass('active');
                    event.preventDefault();
                    const newID = $('#status-button').data('view-id');
                    if (newID != undefined && newID != '') {
                        $('.menu-content-changer').removeClass('active');
                        swapViewContent(newID);
                    }
                }
            })
            .catch((error) => {
                $('#update-status-alert').html(error);
                $('#update-status-alert').show();
            });
    }
    /**
     * Displays the modal
     * @return {[type]} [description]
     */
    showModal() {
        const newID = $(this).data('view-id');
        if (newID === 'status-content') {
            // $('#status-modal').modal({ show: true });
            $('#status-modal').modal('toggle');
            const status = Cookies.get('user-status');
            $('#' + status).prop('checked', true);
        }
    }
}

$(function() {
    StatusSelection.getInstance();
});
