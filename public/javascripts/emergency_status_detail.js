class EmergencyStatusDetail {
    constructor() {
        this._id = null;
        this.user_id = null;
    }
    //done
    static setEditDescriptionEvent() {
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

        $('.loc-edit-button').click(function(event) {
            event.preventDefault();
            console.log("location edit button clicked!");
            
            //hide paragraph and edit button
            $("#locationDescriptionPreview").addClass("hidden");
            $(".loc-edit-button").addClass("hidden");
            //show textarea and save button
            $("#locationDescriptionEdit").removeClass("hidden");
            $(".loc-save-button").removeClass("hidden");

        });
    }
    //done
    static setSaveDescriptionEvent() {
        let jwt = Cookies.get('user-jwt-esn');
        let user_id = Cookies.get('user-id');
        $('.save-button').click(function(event) {
            event.preventDefault();
            console.log('save button clicked!');
            //hide textarea and save button
            $("#briefDescriptionEdit").addClass("hidden");
            $(".save-button").addClass("hidden");

            //TODO update paragraph
            $.ajax({
                url: apiPath + '/emergencyStatusDetail/' + user_id,
                type: 'put',
                headers: {
                    "Authorization": jwt
                },
                data: {
                    description: $("#briefDescriptionEdit").val(),
                    detailType: "situation"
                }
            }).done(function(response) {
                console.log(response);
                document.getElementById("briefDescriptionPreview").innerHTML = response.status_description;
                document.getElementById("briefDescriptionEdit").innerHTML = response.status_description;
                //show paragraph and edit button
                $("#briefDescriptionPreview").removeClass("hidden");
                $(".edit-button").removeClass("hidden");
            }).fail(function(e) {
                $("#update-brief-description-alert").html(e);
                $("#update-brief-description-alert").show();
            }).always(function() {
                console.log("complete");
            }); 
            
        });

        $('.loc-save-button').click(function(event) {
            event.preventDefault();
            console.log('location save button clicked!');
            //hide textarea and save button
            $("#locationDescriptionEdit").addClass("hidden");
            $(".loc-save-button").addClass("hidden");

            //TODO update paragraph
            $.ajax({
                url: apiPath + '/emergencyStatusDetail/' + user_id,
                type: 'put',
                headers: {
                    "Authorization": jwt
                },
                data: {
                    description: $("#locationDescriptionEdit").val(),
                    detailType: "location"
                }
            }).done(function(response) {
                console.log(response);
                document.getElementById("locationDescriptionPreview").innerHTML = response.share_location;
                document.getElementById("locationDescriptionEdit").innerHTML = response.share_location;
                //show paragraph and edit button
                $("#locationDescriptionPreview").removeClass("hidden");
                $(".loc-edit-button").removeClass("hidden");
            }).fail(function(e) {
                $("#update-location-description-alert").html(e);
                $("#update-location-description-alert").show();
            }).always(function() {
                console.log("complete");
            });

        });
    }
    //done
    static setDeletePictureEvent(pictureId) {
        $('#'+pictureId).click(function(event) {
            event.preventDefault();
            let jwt = Cookies.get('user-jwt-esn');
            console.log("delete button for pictureId: " + pictureId + "clicked!");
            
            //delete picture in the backend
            $.ajax({
                url: apiPath + '/emergencyStatusDetail/picture/' + pictureId,
                type: 'delete',
                headers: {
                    "Authorization": jwt
                }
            }).done(function(response) {
                console.log(response);
            }).fail(function(e) {
                $("#delete-alert").html(e);
                $("#delte-alert").show();
            }).always(function() {
                console.log("complete");
            });

            //delete picture in the frontend
            $("#"+pictureId).remove();
        });
    }
    //done
    static setAddPictureEvent() {
        $(".add-button").click(function(event) {
            event.preventDefault();
            console.log("add picture button clicked");
            $('#addPictureModal').modal('show');

            $('#file').change(function(){
                console.log("yoyo");
                $("#picDiscription").removeClass("hidden");
                $(".upload-button").removeClass("hidden");
            });

            EmergencyStatusDetail.setUploadEvent();
        })
    }
    //done
    static setUploadEvent() {
        $(".upload-button").unbind().click(function(event) {
            console.log("upload button pressed");
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
                

                $("#picDiscription").val('');
                $("#file").val('');
                $("#picDiscription").addClass("hidden");
                $(".upload-button").addClass("hidden");
                $('#addPictureModal').modal('hide');

            }).fail(function(e) {
                $("#upload-alert").html(e);
                $("#upload-alert").show();
            }).always(function() {
                console.log("complete");
            });

        })

    }

    //done
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
    //done
    static generatePreviewPage() {

        EmergencyStatusDetail.setEditDescriptionEvent();

        EmergencyStatusDetail.setSaveDescriptionEvent();

        EmergencyStatusDetail.setAddPictureEvent();

        //retreive detailed data
        let jwt = Cookies.get('user-jwt-esn');
        let user_id = Cookies.get('user-id');
        //get brief description and location description
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
            $("#briefDescriptionPreview").removeClass("hidden");

            //location description
            document.getElementById("locationDescriptionPreview").innerHTML = response.share_location;
            document.getElementById("locationDescriptionEdit").innerHTML = response.share_location;
            $("#locationDescriptionPreview").removeClass("hidden");


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