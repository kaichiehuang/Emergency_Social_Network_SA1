class Resources {

    static instance = undefined;
    /**
     * Initializing view
     */
    constructor() {
        $('#step-one-btn').on('click', (e) => {
            Resources.getInstance().addClassElements('selected-btn',
                $('#step-one-btn'));
            Resources.getInstance().removeClassElements('selected-btn',
                $('#step-two-btn'), $('#step-three-btn'));


            Resources.getInstance().removeClassElements('hidden-main-content-block',
                $('#step-one-content'), $('#div-resource-type'));
            Resources.getInstance().addClassElements('hidden-main-content-block',
                $('#resource-location-div'), $('#resource-picture-div'));
        });

        $('#step-two-btn').on('click', (e) => {
            Resources.getInstance().addClassElements('selected-btn',
                $('#step-two-btn'));
            Resources.getInstance().removeClassElements('selected-btn',
                $('#step-one-btn'), $('#step-three-btn'));

            Resources.getInstance().removeClassElements('hidden-main-content-block',
                $('#resource-location-div'));
            Resources.getInstance().addClassElements('hidden-main-content-block',
                $('#step-one-content'), $('#resource-picture-div'),
                $('#div-resource-type'));
        });


        $('#step-three-btn').on('click', (e) => {
            Resources.getInstance().addClassElements('selected-btn',
                $('#step-three-btn'));
            Resources.getInstance().removeClassElements('selected-btn',
                $('#step-two-btn'), $('#step-one-btn'));

            Resources.getInstance().removeClassElements('hidden-main-content-block',
                $('#resource-picture-div'));
            Resources.getInstance().addClassElements('hidden-main-content-block',
                $('#step-one-content'), $('#resource-location-div'),
                $('#div-resource-type'));
        });


        $('#supplies-btn').on('click', (e) => {
            Resources.getInstance().addClassElements('selected-btn',
                $('#supplies-btn'));
            Resources.getInstance().removeClassElements('selected-btn',
                $('#shelter-btn'), $('#medical-btn'));

            Resources.getInstance().removeClassElements('hidden-main-content-block',
                $('#supplies-content-div'));
            Resources.getInstance().addClassElements('hidden-main-content-block',
                $('#medical-content-div'), $('#shelter-content-div'));
        });

        $('#medical-btn').on('click', (e) => {
            Resources.getInstance().addClassElements('selected-btn',
                $('#medical-btn'));
            Resources.getInstance().removeClassElements('selected-btn',
                $('#supplies-btn'), $('#shelter-btn'));

            Resources.getInstance().removeClassElements('hidden-main-content-block',
                $('#medical-content-div'));
            Resources.getInstance().addClassElements('hidden-main-content-block',
                $('#supplies-content-div'), $('#shelter-content-div'));
        });


        $('#shelter-btn').on('click', (e) => {
            Resources.getInstance().addClassElements('selected-btn',
                $('#shelter-btn'));
            Resources.getInstance().removeClassElements('selected-btn',
                $('#supplies-btn'), $('#medical-btn'));

            Resources.getInstance().removeClassElements('hidden-main-content-block',
                $('#shelter-content-div'));
            Resources.getInstance().addClassElements('hidden-main-content-block',
                $('#medical-content-div'), $('#supplies-content-div'));
        });

        $('#resource-submit-btn').on('click', async (e) => {
            const valid = await Resources.getInstance().validateRequireFields();
            if (valid.length===0) {
                Resources.getInstance().getValues();
            } else {
                $('#modaltext').text(valid);
                $('#validationsModal').modal('show');
            }
        });

        $('#erasePicture').on('click', async (e) => {
            e.preventDefault();
            $('#resource-picture').val('');
            $('#image-preview').attr('src', '#');
            Resources.getInstance().addClassElements('hidden-main-content-block',
                $('#imageDiv'));
        });


        $('#resource-picture').on('change', (e) => {
            Resources.getInstance().readURL();
            Resources.getInstance().removeClassElements('hidden-main-content-block',
                $('#imageDiv'));
        });


    }
    /**
     * Singleton instance element
     * @return {[type]} [description]
     */
     static getInstance(){
        if (this.instance === undefined) {
            this.instance = new Resources();
        }
        return this.instance;
    }

    /**
     * Initialize buttons selection
     */
     initializeFirstSelection() {
        $('#step-one-btn').trigger('click');
        $('#supplies-btn').trigger('click');
    }


     removeClassElements(nameClass, ...showElement) {
        for (const element of showElement) {
            element.removeClass(nameClass);
        }
    }


     addClassElements(nameClass, ...showElement) {
        for (const element of showElement) {
            element.addClass(nameClass);
        }
    }

    /**
     * Method to read the image and show a preview
     */
     readURL() {
        const input = $('#resource-picture').prop('files');
        if (input && input[0]) {
            const reader = new FileReader();
            reader.onload = function(e) {
                $('#image-preview').attr('src', e.target.result);
            };
            reader.readAsDataURL(input[0]); // convert to base64 string
        }
    }


    /**
     * Getting values from the form to save the resource
     */
     getValues() {
        let description;
        let questionOne;
        let questionTwo;

        switch ($('#div-resource-type button.selected-btn').attr('name')) {
        case 'SUPPLIES':
            description = $('#supplies-description-id').val();
            questionOne = $('#supplies-q1-div input[type=\'radio\']:checked')
                .val();
            questionTwo = $('#supplies-q2-div input[type=\'radio\']:checked')
                .val();

            break;
        case 'MEDICAL':
            description = $('#medical-description-id').val();
            questionOne = $('#medical-q1-div input[type=\'radio\']:checked')
                .val();
            break;
        case 'SHELTER':
            description = $('#shelter-description-id').val();
            questionOne = $('#shelter-q1-div input[type=\'radio\']:checked')
                .val();
            questionTwo = $('#shelter-q2-div input[type=\'radio\']:checked')
                .val();
            break;
        default:
            alert('error' + $('#div-resource-type button.selected-btn')
                .attr('name'));
            break;
        }


        const resourceObject = {
            user_id: Cookies.get('user-id'),
            resourceType: $('#div-resource-type button.selected-btn')
                .attr('name'),
            name: $('#resource-name-id').val(),
            location: $('#resource-location').val(),
            description: description,
            questionOne: questionOne,
            questionTwo: questionTwo,
        };

        Resources.getInstance().postResource(resourceObject);
    }


     validateRequireFields() {
        const resourceType = ('#div-resource-type button.selected-btn');
        if (resourceType.length === 0 ||
            $('#resource-location').val() === '' ||
            $('#resource-name-id').val() === '') {
            return 'Resource and Location are a required fields';
        } else {
            if ($('#resource-picture').prop('files').length !== 0 &&
                $('#resource-picture').prop('files')[0].size>2000000) {
                return 'Picture Size limit 2Mb';
            } else {
                switch ($('#div-resource-type button.selected-btn')
                    .attr('name')) {
                case 'SUPPLIES':
                    if ($('#supplies-description-id').val() === '' ||
                            $('#supplies-q1-div input[type=\'radio\']:checked')
                                .length === 0 ||
                            $('#supplies-q2-div input[type=\'radio\']:checked')
                                .length === 0) {
                        return 'Description and questions answers ' +
                            'are mandatory fields';
                    } else {
                        return '';
                    }
                    break;
                case 'MEDICAL':
                    if ($('#medical-description-id').val() === '' ||
                            $('#medical-q1-div input[type=\'radio\']:checked')
                                .length === 0) {
                        return 'Description and questions answers ' +
                            'are mandatory fields';
                    } else {
                        return '';
                    }
                    break;
                case 'SHELTER':

                    if ($('#shelter-description-id').val() === '' ||
                            $('#shelter-q1-div input[type=\'radio\']:checked')
                                .length === 0 ||
                            $('#shelter-q2-div input[type=\'radio\']:checked')
                                .length === 0) {
                        return 'Description and questions answers ' +
                            'are mandatory fields';
                    } else {
                        return '';
                    }
                    break;
                default:
                    return 'false';
                    break;
                }
            }
        }
    }

    /**
     * Saving resource information
     * @param resourceObject
     * @return {Promise<unknown>}
     */
     postResource(resourceObject) {
        const formData = new FormData();

        formData.append('user_id', Cookies.get('user-id'));
        formData.append('resourceType', $('#div-resource-type button.selected-btn')
            .attr('name'));
        formData.append('name', $('#resource-name-id').val());
        formData.append('location', $('#resource-location').val());
        formData.append('description', resourceObject.description);
        formData.append('questionOne', resourceObject.questionOne);
        formData.append('questionTwo', resourceObject.questionTwo);

        if ($('#resource-picture').prop('files').length !== 0) {
            formData.append('resourceImage',
                $('#resource-picture').prop('files')[0]);
        }
        return new Promise((resolve, reject) => {
            const jwt = Cookies.get('user-jwt-esn');
            $.ajax({
                url: apiPath + '/resources/',
                processData: false,
                contentType: false,
                type: 'post',
                headers: {
                    'Authorization': jwt
                },
                data: formData,
            }).done(function(response) {
                $('#supplies-form').trigger('reset');
                $('#image-preview').attr('src', '#');
                Resources.getInstance().initializeFirstSelection();
                swapViewContent('public-chat-content');
                resolve(response);
            }).fail(function(e) {
                reject(e.message);
            }).always(function() {
                console.log('complete');
            });
        });
    }
}


$(function() {
    Resources.getInstance().initializeFirstSelection();
});


