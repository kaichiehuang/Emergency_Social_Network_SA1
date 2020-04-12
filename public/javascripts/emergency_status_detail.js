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

    static generatePreviewPage() {

        EmergencyStatusDetail.setEditBreifDescriptionEvent();

        EmergencyStatusDetail.setSaveBreifDescriptionEvent();

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
                let t = document.querySelector('#pictureAndDescriptionTemplate');
                t.content.querySelector('img').src = pictureObj.picture_path;
                t.content.querySelector('div').id = pictureObj._id;
                t.content.querySelector('p').innerHTML = pictureObj.picture_description;

                let clone = document.importNode(t.content, true);
                let pictureContainer = document.getElementsByClassName('sharePicture');
                pictureContainer[0].appendChild(clone);

                EmergencyStatusDetail.setDeletePictureEvent(pictureObj._id);

            })    
        }).fail(function(e) {
            $("#get-picture-and-description-alert").html(e);
            $("#get-picture-and-description-alert").show();
        }).always(function() {
            console.log("complete");
        });
        
        

        //brief description
        document.getElementById("briefDescriptionPreview").innerHTML = "test";
        $("#briefDescriptionPreview").removeClass("hidden");

        //share location

        //picture and description

    }


}

$(function() {

    EmergencyStatusDetail.generatePreviewPage();

    




});