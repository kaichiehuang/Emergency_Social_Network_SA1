class ResourcesList {
    constructor() {
        $(document).on('click','#icon',function(event){
            for (let cssClass of this.classList) {
                if(cssClass.includes("id")){
                    const index= cssClass.indexOf("-");
                    const resourceId = cssClass.substring(index+1);
                    ResourcesList.getResourceById(resourceId);
                    break;
                }
            }
        });

        $("#addResourceIcon").on('click',(e)=>{
            swapViewContent("resources-content");
        })



    //Click event, to update user list when the user switch between views
        $(".menu-content-changer").click(function(event) {
            event.preventDefault();
            let newID = $(this).data('view-id');
            if (newID === "resources-list-content") {
                ResourcesList.updateResourceListView();
            }
        });

        ResourcesList.updateResourceListView();


    }

    static showResourceDetail(resource){

        //Changing labels
        $(".modal-body #resource-type-label").text("Resource Type:");
        $(".modal-body #picture-label").text("Picture:");

        ///Hide steps buttons
        $(".modal-body #div-steps").addClass("hidden-main-content-block");
        //SHOWING LOCATION IN THE SAME PAGE
        $(".modal-body #resource-location-div").removeClass("hidden-main-content-block");
        //SHOWING PICTURE IN THE SAME PAGE
        $(".modal-body #resource-picture-div").removeClass("hidden-main-content-block");
        //REMOVING PICTURES INPUTS
        $(".modal-body #resource-picture").addClass("hidden-main-content-block");
        $(".modal-body #erasePicture").addClass("hidden-main-content-block");
        $(".modal-body #resource-submit-btn").addClass("hidden-main-content-block");
        ///ADDING PICTURE
        $('.modal-body  #imageDiv').removeClass("hidden-main-content-block");
        ResourcesList.readURL(resource.image);
        //Adding Location
        $(".modal-body #resource-location").text(resource.location);
        $(".modal-body #resource-location").attr('readonly', true);
        //Adding resource name
        $(".modal-body #resource-name-id").val(resource.name);
        $(".modal-body #resource-name-id").attr('readonly', true);
        switch (resource.resource_type) {
            case "SUPPLIES":
                //Hiding RESOURCES TYPE BUTTONS
                $(".modal-body #supplies-btn").removeClass("hidden-main-content-block");
                $(".modal-body #medical-btn").addClass("hidden-main-content-block");
                $(".modal-body #shelter-btn").addClass("hidden-main-content-block");

                //HIDING DIVS OF ANOTHER RESOURCE TYPE
                $(".modal-body #supplies-content-div").removeClass("hidden-main-content-block");
                $(".modal-body #medical-content-div").addClass("hidden-main-content-block");
                $(".modal-body #shelter-content-div").addClass("hidden-main-content-block");
                //SUPPLY DESCRIPTION
                $(".modal-body #supplies-description-id").text(resource.description);
                $(".modal-body #supplies-description-id").attr('readonly', true);
                //SUPPLY QUESTION ONE
                if(resource.question_one) {
                    $(".modal-body #supplies-q1-yes").prop('checked', true);
                    $(".modal-body #supplies-q1-yes").attr('readonly', true);
                }else {
                    $(".modal-body #supplies-q1-no").prop('checked', true);
                    $(".modal-body #supplies-q1-no").attr('readonly', true);
                }
                //SUPPLY QUESTION TWO
                if(resource.question_two) {
                    $(".modal-body #supplies-q2-yes").prop('checked', true);
                    $(".modal-body #supplies-q2-yes").attr('readonly', true);
                }else {
                    $(".modal-body #supplies-q2-no").prop('checked', true);
                    $(".modal-body #supplies-q2-no").attr('readonly', true);
                }


                break;
            case "MEDICAL":
                //Hiding RESOURCES TYPE BUTTONS
                $(".modal-body #medical-btn").removeClass("hidden-main-content-block");
                $(".modal-body #supplies-btn").addClass("hidden-main-content-block");
                $(".modal-body #shelter-btn").addClass("hidden-main-content-block");

                $(".modal-body #medical-content-div").removeClass("hidden-main-content-block")
                $(".modal-body #supplies-content-div").addClass("hidden-main-content-block");
                $(".modal-body #shelter-content-div").addClass("hidden-main-content-block");
                //MEDICAL description
                $(".modal-body #medical-description-id").text(resource.description);
                $(".modal-body #medical-description-id").attr('readonly', true);
                //MEDICAL QUESTION ONE
                if(resource.question_one) {
                    $(".modal-body #medical-q1-yes").prop('checked', true);
                    $(".modal-body #medical-q1-yes").attr('readonly', true);
                }else {
                    $(".modal-body #medical-q1-no").prop('checked', true);
                    $(".modal-body #medical-q1-no").attr('readonly', true);
                }

                break;
            case  "SHELTER":
                //Hiding RESOURCES TYPE BUTTONS
                $(".modal-body shelter-btn").removeClass("hidden-main-content-block");
                $(".modal-body #supplies-btn").addClass("hidden-main-content-block");
                $(".modal-body #medical-btn").addClass("hidden-main-content-block");

                $(".modal-body #shelter-content-div").removeClass("hidden-main-content-block")
                $(".modal-body #medical-content-div").addClass("hidden-main-content-block");
                $(".modal-body #supplies-content-div").addClass("hidden-main-content-block");
                //SHELTER description
                $(".modal-body #shelter-description-id").text(resource.description);
                $(".modal-body #shelter-description-id").attr('readonly', true);
                //SHELTER QUESTION ONE
                if(resource.question_one) {
                    $(".modal-body #shelter-q1-yes").prop('checked', true);
                    $(".modal-body #shelter-q1-yes").attr('readonly', true);
                }else {
                    $(".modal-body #shelter-q1-no").prop('checked', true);
                    $(".modal-body #shelter-q1-no").attr('readonly', true);
                }
                //SHELTER QUESTION TWO
                if(resource.question_two) {
                    $(".modal-body #shelter-q2-yes").prop('checked', true);
                    $(".modal-body #shelter-q2-yes").attr('readonly', true);
                }else {
                    $(".modal-body #shelter-q2-no").prop('checked', true);
                    $(".modal-body #shelter-q2-no").attr('readonly', true);
                }

                break;
            default:
                break;
        }

        $(".modal-body #resources-content").removeClass("hidden-main-content-block");
        $('#exampleModalCenter').modal('show');
    }


    static async readURL(image){
        var base64Flag = 'data:image/png;base64,';
        var imageStr =
            await ResourcesList.arrayBufferToBase64(image.data.data)
        $('.modal-body  #image-preview').attr('src',base64Flag + imageStr);

    }

    static arrayBufferToBase64(buffer) {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };


    static getResourceById(resourceId){
        return new Promise((resolve, reject) => {
            let jwt = Cookies.get('user-jwt-esn');
            $.ajax({
                url: apiPath + '/resources/' +resourceId ,
                type: 'get',
                headers: {
                    "Authorization": jwt
                }
            }).done(function(response) {
                ResourcesList.showResourceDetail(response)
                resolve(response);
            }).fail(function(e) {
                reject(e.message)
            }).always(function() {
                console.log("complete");
            });
        });
    }

    static getResources() {
        return new Promise((resolve, reject) => {
            let jwt = Cookies.get('user-jwt-esn');
            $.ajax({
                url: apiPath + '/resources/',
                type: 'get',
                headers: {
                    "Authorization": jwt
                }
            }).done(function(response) {
                resolve(response);
            }).fail(function(e) {
                reject(e.message)
            }).always(function() {
                console.log("complete");
            });
        });
    }

    static drawResources(resources) {
        let containerId = "resources_list-content";
        $("#resources-list-div .no-results-message").addClass("hidden");
        //1. find templates in html
        const resourceTemplate = document.querySelector('template#resources-template');
        //2. find container
        let listContainer = document.getElementById(containerId);
        $("#" + containerId + " li").remove();
        if (listContainer != undefined) {
            for (let i = 0; i < resources.length; i++) {
                const resource = resources[i];
                var template = null;
                //4. online state
                if (resourceTemplate != undefined) {
                    template = resourceTemplate.content.cloneNode(true);
                }
                if (template != undefined && template != null ) {
                    template.querySelector('.resource-name').innerText = resource.name;
                    //template.querySelector('.description').innerText = resource.description;
                    template.querySelector('.fa-info-circle').classList.add("id-" +resource._id);
                    //set message counter from user
                    listContainer.appendChild(template);
                }
            }
            contentChangerEvent();
        }
    }

    //todo pass this to a class AddressBook that has an attribute currentUser
    static updateResourceListView() {
        //get resource data
        ResourcesList.getResources().then(resources => {
            if(resources.length > 0){
                ResourcesList.drawResources(resources);
            }

        }).catch(err => {});
    }
}


$(function() {

    new ResourcesList();

});

