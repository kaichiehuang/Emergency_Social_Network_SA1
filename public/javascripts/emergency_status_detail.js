class EmergencyStatusDetail {
    constructor() {
        this.instance = null;
        this._id = null;
        this.userId = null;
    }
    /**
     * Singleton instance element
     * @return {[type]} [description]
     */
    static getInstance() {
        if (this.instance === undefined) {
            this.instance = new EmergencyStatusDetail();
        }
        return this.instance;
    }
    /**
     * Set up the click event for edit button for both
     * brief description of situation and location 
     * description
     */
    setEditDescriptionEvent() {
        $('.edit-button').click(function (event) {
            event.preventDefault();
            // hide paragraph and edit button
            $('#briefDescriptionPreview').addClass('hidden');
            $('.edit-button').addClass('hidden');
            // show textarea and save button
            $('#briefDescriptionEdit').removeClass('hidden');
            $('.save-button').removeClass('hidden');
        });

        $('.loc-edit-button').click(function (event) {
            event.preventDefault();
            // hide paragraph and edit button
            $('#locationDescriptionPreview').addClass('hidden');
            $('.loc-edit-button').addClass('hidden');
            // show textarea and save button
            $('#locationDescriptionEdit').removeClass('hidden');
            $('.loc-save-button').removeClass('hidden');
        });
    }
    /**
     * Set up the click event for saving
     * brief description of situation and location 
     * description 
     */
    setSaveDescriptionEvent() {
        const userId = Cookies.get('user-id');
        $('.save-button').click(function (event) {
            event.preventDefault(); // hide textarea and save button
            $('#briefDescriptionEdit').addClass('hidden');
            $('.save-button').addClass('hidden');

            const data = {
                description: $('#briefDescriptionEdit').val(),
                detailType: 'situation',
            };

            APIHandler.getInstance()
                .sendRequest(
                    '/emergencyStatusDetail/' + userId,
                    'put',
                    data,
                    true,
                    null
                )
                .then((response) => {
                    document.getElementById('briefDescriptionPreview').innerHTML =
                        response.status_description;
                    document.getElementById('briefDescriptionEdit').innerHTML =
                        response.status_description;
                    // show paragraph and edit button
                    $('#briefDescriptionPreview').removeClass('hidden');
                    $('.edit-button').removeClass('hidden');
                })
                .catch((error) => {
                    $('#update-brief-description-alert').html(error);
                    $('#update-brief-description-alert').show();
                });
        });

        $('.loc-save-button').click(function (event) {
            event.preventDefault();
            // hide textarea and save button
            $('#locationDescriptionEdit').addClass('hidden');
            $('.loc-save-button').addClass('hidden');

            const data = {
                description: $('#locationDescriptionEdit').val(),
                detailType: 'location',
            };

            APIHandler.getInstance()
                .sendRequest(
                    '/emergencyStatusDetail/' + userId,
                    'put',
                    data,
                    true,
                    null
                )
                .then((response) => {
                    document.getElementById('locationDescriptionPreview').innerHTML =
                        response.share_location;
                    document.getElementById('locationDescriptionEdit').innerHTML =
                        response.share_location;
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
    /**
     * Set up the click event for delete one picture and
     * its description
     */
    setDeletePictureEvent(pictureId) {
        $('#' + pictureId).click(function (event) {
            event.preventDefault();

            APIHandler.getInstance()
                .sendRequest(
                    '/emergencyStatusDetail/picture/' + pictureId,
                    'delete',
                    null,
                    true,
                    null
                )
                .then((response) => { })
                .catch((error) => {
                    $('#delete-alert').html(error);
                    $('#delte-alert').show();
                });

            // delete picture in the frontend
            $('*[data-pic-id="' + pictureId + '"]').remove();

            // $("#"+pictureId).remove();
        });
    }
    /**
     * Set up the click event for adding one picture and
     * its description
     */
    setAddPictureEvent() {
        $('.add-button').click(function (event) {
            event.preventDefault();
            $('#addPictureModal').modal('show');

            $('#file').change(function () {
                $('#picDiscription').removeClass('hidden');
                $('.upload-button').removeClass('hidden');
            });

            EmergencyStatusDetail.getInstance().setUploadEvent();
        });
    }
    /**
     * Set up the click event for uploading one picture and
     * its description
     */
    setUploadEvent() {
        $('.upload-button')
            .unbind()
            .click(function (event) {
                event.preventDefault();
                const jwt = Cookies.get('user-jwt-esn');
                const userId = Cookies.get('user-id');
                const fd = new FormData();
                const files = $('#file')[0].files[0];
                fd.append('picture', files);
                fd.append('pictureDescription', $('#picDiscription').val());

                $('#addPictureModal').modal('hide');

                $.ajax({
                    url: apiPath + '/emergencyStatusDetail/' + userId,
                    type: 'post',
                    headers: {
                        Authorization: jwt,
                    },
                    data: fd,
                    contentType: false,
                    processData: false,
                })
                    .done(function (response) {
                        EmergencyStatusDetail.getInstance().drawPictureAndDescription(
                            response
                        );
                        $('#picDiscription').val('');
                        $('#file').val('');
                        $('#picDiscription').addClass('hidden');
                        $('.upload-button').addClass('hidden');
                    })
                    .fail(function (e) {
                        $('#upload-alert').html(e);
                        $('#upload-alert').show();
                    });
            });
    }
    /**
     * Function for drawing pictures and discriptions to the view
     */
    drawPictureAndDescription(pictureObj) {
        const t = document.querySelector('#pictureAndDescriptionTemplate');
        t.content.querySelector('img').src = pictureObj.picture_path;
        t.content.querySelector('button').id = pictureObj._id;
        t.content.querySelector('p').innerHTML = pictureObj.picture_description;
        const clone = document.importNode(t.content, true);
        clone
            .querySelector('.picAndDesBlock')
            .setAttribute('data-pic-id', pictureObj._id);
        const pictureContainer = document.getElementsByClassName('sharePicture');
        pictureContainer[0].appendChild(clone);

        EmergencyStatusDetail.getInstance().setDeletePictureEvent(pictureObj._id);
    }
    /**
     * Function for generating the emergency status detail page
     */
    generatePreviewPage() {
        EmergencyStatusDetail.getInstance().setEditDescriptionEvent();
        EmergencyStatusDetail.getInstance().setSaveDescriptionEvent();
        EmergencyStatusDetail.getInstance().setAddPictureEvent();
        // retrieve detailed data
        const userId = Cookies.get('user-id');
        // get brief description and location description
        APIHandler.getInstance()
            .sendRequest('/emergencyStatusDetail/' + userId, 'get', null, true, null)
            .then((response) => {
                if (response != null) {
                    // brief description
                    document.getElementById('briefDescriptionPreview').innerHTML =
                        response.status_description;
                    document.getElementById('briefDescriptionEdit').innerHTML =
                        response.status_description;
                    $('#briefDescriptionPreview').removeClass('hidden');
                    // location description
                    document.getElementById('locationDescriptionPreview').innerHTML =
                        response.share_location;
                    document.getElementById('locationDescriptionEdit').innerHTML =
                        response.share_location;
                    $('#locationDescriptionPreview').removeClass('hidden');
                }
            })
            .catch((error) => {
                $('#get-emergency-detail-alert').html(error);
                $('#get-emergency-detail-alert').show();
            });

        // get picture and description
        APIHandler.getInstance()
            .sendRequest(
                '/emergencyStatusDetail/picture/' + userId,
                'get',
                null,
                true,
                null
            )
            .then((response) => {
                response.forEach(function (pictureObj) {
                    EmergencyStatusDetail.getInstance().drawPictureAndDescription(
                        pictureObj
                    );
                });
            })
            .catch((error) => {
                $('#get-picture-and-description-alert').html(error);
                $('#get-picture-and-description-alert').show();
            });
    }
}

$(function () {
    EmergencyStatusDetail.getInstance().generatePreviewPage();
});
