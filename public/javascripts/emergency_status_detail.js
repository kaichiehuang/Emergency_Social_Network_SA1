class EmergencyStatusDetail {
    constructor() {
        this._id = null;
        this.user_id = null;
    }

    static setEditDetailEvent() {
        $('.editButton').click(function(event) {
            event.preventDefault();
            console.log("edit button clicked!");
            EmergencyStatusDetail.generateEditPage();
        });
    }

    static setSaveDetailEvent() {
        $('.saveButton').click(function(event) {
            event.preventDefault();
            console.log('save button clicked!');
            //TODO
            EmergencyStatusDetail.sendStatusDetail();
            EmergencyStatusDetail.generatePreviewPage();
        });
    }

    static generateEditPage() {
        //TODO: retreive detailed data
        
        //hide elements from preview mode
        $("#briefDescriptionPreview").addClass("hidden");

        //brief description
        document.getElementById("briefDescriptionEdit").innerHTML = "testtesttest";
        $("#briefDescriptionEdit").removeClass("hidden");

        //share location
        $("#shareLocationToggle").removeClass("hidden");
        

    }

    static generatePreviewPage() {
        //hide elements from edit mode
        $("#briefDescriptionEdit").addClass("hidden");
        $("#shareLocationToggle").addClass("hidden");


        //TODO: retreive detailed data
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
            $("#briefDescriptionPreview").removeClass("hidden");

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
                t.content.querySelector('img').id = pictureObj._id;
                t.content.querySelector('p').innerHTML = pictureObj.picture_description;

                let clone = document.importNode(t.content, true);
                let pictureContainer = document.getElementsByClassName('sharePicture');
                pictureContainer[0].appendChild(clone);
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

    EmergencyStatusDetail.setEditDetailEvent();

    EmergencyStatusDetail.setSaveDetailEvent();




});