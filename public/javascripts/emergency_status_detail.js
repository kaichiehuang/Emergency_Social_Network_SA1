class EmergencyStatusDetail {
    constructor() {
        this.instance = null;
        this._id = null;
        this.user_id = null;
    }
    /**
     * Singleton instance element
     * @return {[type]} [description]
     */
    static getInstance(){
        if (this.instance === undefined) {
            this.instance = new EmergencyStatusDetail();
        }
        return this.instance;
    }


    setEditDescriptionEvent() {
        $('.edit-button').click(function(event) {
            event.preventDefault();
            // hide paragraph and edit button
            $('#briefDescriptionPreview').addClass('hidden');
            $('.edit-button').addClass('hidden');
            // show textarea and save button
            $('#briefDescriptionEdit').removeClass('hidden');
            $('.save-button').removeClass('hidden');
        });

        $('.loc-edit-button').click(function(event) {
            event.preventDefault();
            // hide paragraph and edit button
            $('#locationDescriptionPreview').addClass('hidden');
            $('.loc-edit-button').addClass('hidden');
            // show textarea and save button
            $('#locationDescriptionEdit').removeClass('hidden');
            $('.loc-save-button').removeClass('hidden');
        });
    }

    setSaveDescriptionEvent() {
        const user_id = Cookies.get('user-id');
        $('.save-button').click(function(event) {
            event.preventDefault();            // hide textarea and save button
            $('#briefDescriptionEdit').addClass('hidden');
            $('.save-button').addClass('hidden');

            const data = {
                description: $('#briefDescriptionEdit').val(),
                detailType: 'situation'
            };

            APIHandler.getInstance()
                .sendRequest('/emergencyStatusDetail/' + user_id,
                    'put', data, true, null)
                .then((response) => {                    document.getElementById('briefDescriptionPreview')
                    .innerHTML = response.status_description;
                    document.getElementById('briefDescriptionEdit')
                        .innerHTML = response.status_description;
                    // show paragraph and edit button
                    $('#briefDescriptionPreview').removeClass('hidden');
                    $('.edit-button').removeClass('hidden');
                })
                .catch((error) => {
                    $('#update-brief-description-alert').html(error);
                    $('#update-brief-description-alert').show();
                });
        });

        $('.loc-save-button').click(function(event) {
            event.preventDefault();
            // hide textarea and save button
            $('#locationDescriptionEdit').addClass('hidden');
            $('.loc-save-button').addClass('hidden');

            const data = {
                description: $('#locationDescriptionEdit').val(),
                detailType: 'location'
            };

            APIHandler.getInstance()
                .sendRequest('/emergencyStatusDetail/' + user_id,
                    'put', data, true, null)
                .then((response) => {
                    document.getElementById('locationDescriptionPreview')
                        .innerHTML = response.share_location;
                    document.getElementById('locationDescriptionEdit')
                        .innerHTML = response.share_location;
                    // show paragraph and edit button
                    $('#locationDescriptionPreview').removeClass('hidden');
                    $('.loc-edit-button').removeClass('hidden');
                })
                .catch((error) => {
                    $('#update-location-description-alert').html(error);
                    $('#update-location-description-alert').show();
                });
        });
    }

    setDeletePictureEvent(pictureId) {
        $('#' + pictureId).click(function(event) {
            event.preventDefault();

            APIHandler.getInstance()
                .sendRequest('/emergencyStatusDetail/picture/' + pictureId,
                    'delete', null, true, null)
                .then((response) => {                })
                .catch((error) => {
                    $('#delete-alert').html(error);
                    $('#delte-alert').show();
                });

            // delete picture in the frontend
            $('*[data-pic-id="' + pictureId + '"]').remove();

            // $("#"+pictureId).remove();
        });
    }

    setAddPictureEvent() {
        $('.add-button').click(function(event) {
            event.preventDefault();
            $('#addPictureModal').modal('show');

            $('#file').change(function() {
                $('#picDiscription').removeClass('hidden');
                $('.upload-button').removeClass('hidden');
            });

            EmergencyStatusDetail.getInstance().setUploadEvent();
        });
    }

    setUploadEvent() {
        $('.upload-button').unbind().click(function(event) {
            event.preventDefault();
            const jwt = Cookies.get('user-jwt-esn');
            const user_id = Cookies.get('user-id');
            const fd = new FormData();
            const files = $('#file')[0].files[0];
            fd.append('picture', files);
            fd.append('pictureDescription', $('#picDiscription').val());

            $('#addPictureModal').modal('hide');

            $.ajax({
                url: apiPath + '/emergencyStatusDetail/' + user_id,
                type: 'post',
                headers: {
                    'Authorization': jwt
                },
                data: fd,
                contentType: false,
                processData: false,
            }).done(function(response) {
                EmergencyStatusDetail.getInstance().drawPictureAndDescription(response);
                $('#picDiscription').val('');
                $('#file').val('');
                $('#picDiscription').addClass('hidden');
                $('.upload-button').addClass('hidden');
            }).fail(function(e) {
                $('#upload-alert').html(e);
                $('#upload-alert').show();
            });
        });
    }

    drawPictureAndDescription(pictureObj) {
        const t = document.querySelector('#pictureAndDescriptionTemplate');
        t.content.querySelector('img').src = pictureObj.picture_path;
        t.content.querySelector('button').id = pictureObj._id;
        t.content.querySelector('p').innerHTML = pictureObj.picture_description;
        const clone = document.importNode(t.content, true);
        clone.querySelector('.picAndDesBlock')
            .setAttribute('data-pic-id', pictureObj._id);
        const pictureContainer = document
            .getElementsByClassName('sharePicture');
        pictureContainer[0].appendChild(clone);

        EmergencyStatusDetail.getInstance().setDeletePictureEvent(pictureObj._id);
    }

    generatePreviewPage() {
        EmergencyStatusDetail.getInstance().setEditDescriptionEvent();
        EmergencyStatusDetail.getInstance().setSaveDescriptionEvent();
        EmergencyStatusDetail.getInstance().setAddPictureEvent();
        // retrieve detailed data
        const user_id = Cookies.get('user-id');
        // get brief description and location description
        APIHandler.getInstance()
            .sendRequest('/emergencyStatusDetail/' + user_id,
                'get', null, true, null)
            .then((response) => {
                if (response != null) {
                    // brief description
                    document.getElementById('briefDescriptionPreview')
                        .innerHTML = response.status_description;
                    document.getElementById('briefDescriptionEdit')
                        .innerHTML = response.status_description;
                    $('#briefDescriptionPreview').removeClass('hidden');
                    // location description
                    document.getElementById('locationDescriptionPreview')
                        .innerHTML = response.share_location;
                    document.getElementById('locationDescriptionEdit')
                        .innerHTML = response.share_location;
                    $('#locationDescriptionPreview').removeClass('hidden');
                }
            })
            .catch((error) => {
                $('#get-emergency-detail-alert').html(error);
                $('#get-emergency-detail-alert').show();
            });

        // get picture and description
        APIHandler.getInstance()
            .sendRequest('/emergencyStatusDetail/picture/' + user_id,
                'get', null, true, null)
            .then((response) => {
                response.forEach(function(pictureObj) {                    EmergencyStatusDetail.getInstance()
                        .drawPictureAndDescription(pictureObj);
                });
            })
            .catch((error) => {
                $('#get-picture-and-description-alert').html(error);
                $('#get-picture-and-description-alert').show();
            });
    }
}

$(function() {
    EmergencyStatusDetail.getInstance().generatePreviewPage();
});
