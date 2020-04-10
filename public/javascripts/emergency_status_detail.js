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
        //TODO: retreive detailed data
        
        //hide elements from edit mode
        $("#briefDescriptionEdit").addClass("hidden");
        $("#shareLocationToggle").addClass("hidden");

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