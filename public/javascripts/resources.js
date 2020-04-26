/**
 * Class for Resources Module
 */
class Resources {
    /**
     * Initializing view
     */
    constructor() {
        this.instance = undefined;
        this.initializeStepButtonEvents();
        this.initializeResourceTypeButtons();
        this.initializePictureEvents();

        $('#resource-submit-btn').on('click', async (e) => {
            const valid = await Resources.getInstance().validateRequireFields();
            if (valid.length===0) {
                Resources.getInstance().getValues();
            } else {
                $('#modaltext').text(valid);
                $('#validationsModal').modal('show');
            }
        });
    }
    /**
     * Singleton instance element
     * @return {[type]} [description]
     */
    static getInstance() {
        if (this.instance === undefined) {
            this.instance = new Resources();
        }
        return this.instance;
    }

    /**
     * Initialize events for controlling image functionality
     */
    initializePictureEvents() {
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
     * Remove and add button classes to selected option
     * @param idElementSelected
     * @param idElementOneHide
     * @param idElementTwoHide
     */
    buttonSelectionElements(idElementSelected, idElementOneHide, idElementTwoHide) {
        Resources.getInstance().addClassElements('selected-btn', $('#'+ idElementSelected +'-btn'));
        Resources.getInstance().removeClassElements('selected-btn', $('#'+ idElementOneHide+'-btn'),
            $('#'+ idElementTwoHide+'-btn'));
    }

    /**
     * Hide and show content depending on the Resource Type selected
     * @param idElementSelected
     * @param idElementOneHide
     * @param idElementTwoHide
     */
    hideShowContentElements(idElementSelected, idElementOneHide, idElementTwoHide) {
        Resources.getInstance().removeClassElements('hidden-main-content-block',
            $('#'+ idElementSelected +'-content-div'));
        Resources.getInstance().addClassElements('hidden-main-content-block',
            $('#'+ idElementOneHide+'-content-div'), $('#'+ idElementTwoHide+'-content-div'));
    }
    /**
     * Initialize button events for Resource Type
     */
    initializeResourceTypeButtons() {
        $('#supplies-btn').on('click', (e) => {
            Resources.getInstance().buttonSelectionElements('supplies', 'shelter',
                'medical');
            Resources.getInstance().hideShowContentElements('supplies', 'shelter',
                'medical');
        });
        $('#medical-btn').on('click', (e) => {
            Resources.getInstance().buttonSelectionElements('medical', 'supplies',
                'shelter');
            Resources.getInstance().hideShowContentElements('medical', 'supplies',
                'shelter');
        });
        $('#shelter-btn').on('click', (e) => {
            Resources.getInstance().buttonSelectionElements('shelter', 'supplies',
                'medical');
            Resources.getInstance().hideShowContentElements('shelter', 'supplies',
                'medical');
        });
    }
    /**
     * Initialize buttons for steps events
     */
    initializeStepButtonEvents() {
        $('#step-one-btn').on('click', (e) => {
            Resources.getInstance().buttonSelectionElements('step-one', 'step-two',
                'step-three');
            Resources.getInstance().removeClassElements('hidden-main-content-block',
                $('#step-one-content'), $('#div-resource-type'));
            Resources.getInstance().addClassElements('hidden-main-content-block',
                $('#resource-location-div'), $('#resource-picture-div'));
        });

        $('#step-two-btn').on('click', (e) => {
            Resources.getInstance().buttonSelectionElements('step-two', 'step-one',
                'step-three');
            Resources.getInstance().removeClassElements('hidden-main-content-block',
                $('#resource-location-div'));
            Resources.getInstance().addClassElements('hidden-main-content-block',
                $('#step-one-content'), $('#resource-picture-div'),
                $('#div-resource-type'));
        });


        $('#step-three-btn').on('click', (e) => {
            Resources.getInstance().buttonSelectionElements('step-three', 'step-two',
                'step-one');
            Resources.getInstance().removeClassElements('hidden-main-content-block',
                $('#resource-picture-div'));
            Resources.getInstance().addClassElements('hidden-main-content-block',
                $('#step-one-content'), $('#resource-location-div'),
                $('#div-resource-type'));
        });
    }
    /**
     * Initialize buttons selection
     */
    initializeFirstSelection() {
        $('#step-one-btn').trigger('click');
        $('#supplies-btn').trigger('click');
    }
    /**
     * Remove classes from elements
     * @param nameClass
     * @param showElement
     */
    removeClassElements(nameClass, ...showElement) {
        for (const element of showElement) {
            element.removeClass(nameClass);
        }
    }

    /**
     * Add classes to elements
     * @param nameClass
     * @param showElement
     */
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
        let questionTwo = false;
        const resourceType = $('#div-resource-type button.selected-btn').attr('name').toLowerCase();
        const description = $('#' + resourceType +'-description-id').val();
        const questionOne = $('#' + resourceType + '-q1-div input[type=\'radio\']:checked').val();
        // Only medical supplies type has one question
        if (resourceType!== 'medical') {
            questionTwo = $('#' + resourceType + '-q2-div input[type=\'radio\']:checked').val();
        }
        const resourceObject = {
            user_id: Cookies.get('user-id'),
            resourceType: resourceType,
            name: $('#resource-name-id').val(),
            location: $('#resource-location').val(),
            description: description,
            questionOne: questionOne,
            questionTwo: questionTwo,
        };

        Resources.getInstance().postResource(resourceObject);
    }

    /**
     * Frontend validations
     * @return {[type]} [description]
     */
    validateRequireFields() {
        const resourceType = ('#div-resource-type button.selected-btn');
        const pictureElement = $('#resource-picture').prop('files');
        let stringValidations ='';
        if (resourceType.length === 0) {
            stringValidations += 'Please select a Resource Type, ';
        }
        if ($('#resource-location').val() === '') {
            stringValidations += 'Resource  Location is a required field, ';
        }
        if ($('#resource-name-id').val() === '') {
            stringValidations += 'Resource Name is  a required field, ';
        }
        if (pictureElement.length !== 0 &&
            pictureElement[0].size>2000000) {
            stringValidations += 'Picture Size limit 2Mb, ';
        }
        const type = $('#div-resource-type button.selected-btn').attr('name');
        if (type === 'SUPPLIES' ) {
            stringValidations += Resources.getInstance().validateDescriptionQuestionsValues('supplies');
        } else if (type === 'MEDICAL' ) {
            stringValidations += Resources.getInstance().validateDescriptionQuestionsValues('medical');
        } else if (type === 'SHELTER') {
            stringValidations += Resources.getInstance().validateDescriptionQuestionsValues('shelter');
        } else {
            return false;
        }
        return stringValidations;
    }

    /**
     * Method to validate questions fields are selected
     * @param id
     */
    validateDescriptionQuestionsValues(id) {
        let validateMessage = '';

        if ($('#'+id+'-description-id').val() === '') {
            validateMessage += 'Description is a mandatory field, ';
        }
        if ($('#'+id+'-q1-div input[type=\'radio\']:checked').length === 0) {
            validateMessage += 'Question 1 answers is a mandatory field, ';
        } else {
            if (id!=='medical') {
                if ($('#'+id+'-q2-div input[type=\'radio\']:checked').length === 0) {
                    validateMessage += 'Question 2 answer is a mandatory field, ';
                }
            }
        }
        return validateMessage;
    }
    /**
     * Saving resource information
     * @param resourceObject
     * @return {Promise<unknown>}
     */
    postResource(resourceObject) {
        const formData = new FormData();
        const fileElement = $('#resource-picture').prop('files');
        formData.append('user_id', Cookies.get('user-id'));
        formData.append('resourceType', $('#div-resource-type button.selected-btn').attr('name'));
        formData.append('name', $('#resource-name-id').val());
        formData.append('location', $('#resource-location').val());
        formData.append('description', resourceObject.description);
        formData.append('questionOne', resourceObject.questionOne);
        formData.append('questionTwo', resourceObject.questionTwo);

        if (fileElement.length !== 0) {
            formData.append('resourceImage',
                fileElement[0]);
        }

        Resources.getInstance().ajaxResourcePost(formData)
            .then()
            .catch((error) =>{
                alert('Error saving resource ' + error);
            });
    }

    /**
     * Ajax request to save resources values
     * @param formData
     * @returns {Promise<unknown>}
     */
    ajaxResourcePost(formData) {
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
            });
        });
    }
}


$(function() {
    Resources.getInstance().initializeFirstSelection();
});


