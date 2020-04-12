class EmergencyStatusDetail {
    constructor() {
        this._id = null;
        this.user_id = null;
    }

    static setEditBreifDescriptionEvent() {
        $('.edit-button').click(function(event) {
            event.preventDefault();
            console.log("edit button clicked!");
            
            //hide paragraph and edit button
            $("#briefDescriptionPreview").addClass("hidden");
            $(".edit-button").addClass("hidden");
            //show textarea and save button
            $("#briefDescriptionEdit").removeClass("hidden");
            $(".save-button").removeClass("hidden");

        });
    }

    static setSaveBreifDescriptionEvent() {
        $('.save-button').click(function(event) {
            event.preventDefault();
            console.log('save button clicked!');
            //hide textarea and save button
            $("#briefDescriptionEdit").addClass("hidden");
            $(".save-button").addClass("hidden");

            //TODO update paragraph

            //show paragraph and edit button
            $("#briefDescriptionPreview").removeClass("hidden");
            $(".edit-button").removeClass("hidden");
            
        });
    }

    static setDeletePictureEvent(pictureId) {
        $('#'+pictureId).click(function(event) {
            event.preventDefault();
            console.log("delete button for pictureId: " + pictureId + "clicked!");
            //delete picture in the backend

            //delete picture in the frontend
            $("#"+pictureId).remove();

            
        });
    }

    static setAddPictureEvent() {
        $(".add-button").click(function(event) {
            event.preventDefault();

            $('#addPictureModal').modal('show');

            $('#file').change(function(){
                console.log("yoyo");
                $("#picDiscription").removeClass("hidden");
                $(".upload-button").removeClass("hidden");
            });

            EmergencyStatusDetail.setUploadEvent();


        })
    }

    static setUploadEvent() {
        $(".upload-button").click(function(event) {
            event.preventDefault();
            let jwt = Cookies.get('user-jwt-esn');
            let user_id = Cookies.get('user-id');

            let fd = new FormData();
            let files = $('#file')[0].files[0];
            fd.append('picture', files);
            fd.append('pictureDescription', $('#picDiscription').val());


            $.ajax({
                url: apiPath + '/emergencyStatusDetail/' + user_id,
                type: 'post',
                headers: {
                    "Authorization": jwt
                },
                data: fd,
                contentType: false,
                processData: false,
            }).done(function(response) {
                console.log(response);
                EmergencyStatusDetail.drawPictureAndDescription(response);
                
            }).fail(function(e) {
                $("#upload-alert").html(e);
                $("#upload-alert").show();
            }).always(function() {
                console.log("complete");
            });




        })

    }



    static drawPictureAndDescription(pictureObj) {
        let t = document.querySelector('#pictureAndDescriptionTemplate');
        t.content.querySelector('img').src = pictureObj.picture_path;
        t.content.querySelector('div').id = pictureObj._id;
        t.content.querySelector('p').innerHTML = pictureObj.picture_description;

        let clone = document.importNode(t.content, true);
        let pictureContainer = document.getElementsByClassName('sharePicture');
        pictureContainer[0].appendChild(clone);

        EmergencyStatusDetail.setDeletePictureEvent(pictureObj._id);
    }

    static generatePreviewPage() {

        EmergencyStatusDetail.setEditBreifDescriptionEvent();

        EmergencyStatusDetail.setSaveBreifDescriptionEvent();

        EmergencyStatusDetail.setAddPictureEvent();

        //retreive detailed data
        let jwt = Cookies.get('user-jwt-esn');
        let user_id = Cookies.get('user-id');
        //get brief description and share location
        $.ajax({
            url: apiPath + '/emergencyStatusDetail/' + user_id,
            type: 'get',
            headers: {
                "Authorization": jwt
            }
        }).done(function(response) {
            console.log(response);

            //brief description
            document.getElementById("briefDescriptionPreview").innerHTML = response.status_description;
            document.getElementById("briefDescriptionEdit").innerHTML = response.status_description;

        }).fail(function(e) {
            $("#get-emergency-detail-alert").html(e);
            $("#get-emergency-detail-alert").show();
        }).always(function() {
            console.log("complete");
        });
        //get picture and description
        $.ajax({
            url: apiPath + '/emergencyStatusDetail/picture/' + user_id,
            type: 'get',
            headers: {
                "Authorization": jwt
            }
        }).done(function(response) {
            console.log(response);

            response.forEach(function (pictureObj) {
                console.log(pictureObj);
                EmergencyStatusDetail.drawPictureAndDescription(pictureObj)
            })    
        }).fail(function(e) {
            $("#get-picture-and-description-alert").html(e);
            $("#get-picture-and-description-alert").show();
        }).always(function() {
            console.log("complete");
        });
        

    }


}

$(function() {

    EmergencyStatusDetail.generatePreviewPage();

    




});