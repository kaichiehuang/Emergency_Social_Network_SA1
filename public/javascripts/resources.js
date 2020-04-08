
class Resources {
    constructor() {
        $("#step-one-btn").on('click', (e) => {

            if($('#step-one-content').hasClass("hidden-main-content-block")){
                $('#step-one-content').removeClass("hidden-main-content-block");

                $("#resource-location-div").addClass("hidden-main-content-block");
                $("#resource-picture-div").addClass("hidden-main-content-block");
                $("#div-resource-type").removeClass("hidden-main-content-block");
            }

        });

        $("#step-two-btn").on('click', (e) => {

            if($('#resource-location-div').hasClass("hidden-main-content-block")){
                $('#resource-location-div').removeClass("hidden-main-content-block");

                $("#step-one-content").addClass("hidden-main-content-block");
                $("#resource-picture-div").addClass("hidden-main-content-block");
                $("#div-resource-type").addClass("hidden-main-content-block");
            }

        });


        $("#step-three-btn").on('click', (e) => {

            if($('#resource-picture-div').hasClass("hidden-main-content-block")){
                $('#resource-picture-div').removeClass("hidden-main-content-block");

                $("#step-one-content").addClass("hidden-main-content-block");
                $("#resource-location-div").addClass("hidden-main-content-block");
                $("#div-resource-type").addClass("hidden-main-content-block");
            }

        });



        $("#supplies-btn").on('click', (e) => {

            $("#supplies-btn").addClass('selected-btn')
            $("#shelter-btn").removeClass('selected-btn')
            $("#medical-btn").removeClass('selected-btn')
            if($('#supplies-content-div').hasClass("hidden-main-content-block")){
                $('#supplies-content-div').removeClass("hidden-main-content-block");

                $("#medical-content-div").addClass("hidden-main-content-block");
                $("#shelter-content-div").addClass("hidden-main-content-block");
            }

        });

        $("#medical-btn").on('click', (e) => {

            $("#medical-btn").addClass('selected-btn')
            $("#shelter-btn").removeClass('selected-btn')
            $("#supplies-btn").removeClass('selected-btn')


            if($('#medical-content-div').hasClass("hidden-main-content-block")){
                $('#medical-content-div').removeClass("hidden-main-content-block");

                $("#supplies-content-div").addClass("hidden-main-content-block");
                $("#shelter-content-div").addClass("hidden-main-content-block");
            }
        });


        $("#shelter-btn").on('click', (e) => {

            $("#shelter-btn").addClass('selected-btn')
            $("#supplies-btn").removeClass('selected-btn')
            $("#medical-btn").removeClass('selected-btn')
            if($('#shelter-content-div').hasClass("hidden-main-content-block")){
                $('#shelter-content-div').removeClass("hidden-main-content-block");

                $("#medical-content-div").addClass("hidden-main-content-block");
                $("#supplies-content-div").addClass("hidden-main-content-block");
            }
        });

        $("#resource-submit-btn").on('click',(e)=>{
            Resources.getValues();
        })


        $("#resource-picture").on('change', (e) => {
            Resources.readURL();
            $('#image-preview').removeClass('hidden-main-content-block')
        });




    }


    static readURL() {

        let input = $('#resource-picture').prop('files');
        if (input && input[0]) {
            let reader = new FileReader();

            reader.onload = function(e) {
                $('#image-preview').attr('src', e.target.result);
            }

            reader.readAsDataURL(input[0]); // convert to base64 string
        }
    }


    static getValues(){

        let description;
        let questionOne;
        let questionTwo;

        switch ($("#div-resource-type button.selected-btn").attr('name')){
            case 'SUPPLIES':
                    description = $('#supplies-description-id').val();
                    questionOne = $("#supplies-q1-div input[type='radio']:checked").val();
                    questionTwo = $("#supplies-q2-div input[type='radio']:checked").val();

                break;
            case 'MEDICAL':
                description = $('#medical-description-id').val();
                questionOne = $("#medical-q1-div input[type='radio']:checked").val();
                break;
            case 'SHELTER':
                description = $("#shelter-description-id").val();
                questionOne = $("#shelter-q1-div input[type='radio']:checked").val();
                questionTwo = $("#shelter-q2-div input[type='radio']:checked").val();
                break;
            default:
                alert('error' + $("#div-resource-type button.selected-btn").attr('name'))
                break;
        }


        const resourceObject ={
            user_id:  Cookies.get('user-id'),
            resourceType: $("#div-resource-type button.selected-btn").attr('name'),
            name:$('#resource-name-id').val(),
            location: $('#resource-location').val(),
            description: description,
            questionOne: questionOne,
            questionTwo: questionTwo,
        };

        this.postResource(resourceObject);

    }

    static postResource(resourceObject) {

        let formData = new FormData();

        formData.append("data", JSON.stringify(resourceObject));
        formData.append("resourceImage", $('#resource-picture').prop('files')[0]);

            return new Promise((resolve, reject) => {
                let jwt = Cookies.get('user-jwt-esn');
                $.ajax({
                    url: apiPath + '/resources/',
                    processData: false,
                    contentType: false,
                    type: 'post',
                    headers: {
                        "Authorization": jwt
                    },
                    data:formData,
                }).done(function(response) {
                    $('#supplies-form').trigger("reset");
                    $('#image-preview').attr('src',"#");
                    //swapContent("public-chat-content");
                    resolve(response);
                }).fail(function(e) {
                    reject(e.message)
                }).always(function() {
                    console.log("complete");
                });
            });

    }


}


$(function() {
    new Resources();
})




