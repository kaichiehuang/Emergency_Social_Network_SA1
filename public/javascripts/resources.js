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
            if (valid.length === 0) {
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
            Resources.getInstance().addRemoveClassElements('hidden-main-content-block', 'add',
                $('#imageDiv'));
        });


        $('#resource-picture').on('change', (e) => {
            Resources.getInstance().readURL();
            Resources.getInstance().addRemoveClassElements('hidden-main-content-block', 'remove',
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
        Resources.getInstance().addRemoveClassElements('selected-btn', 'add', $('#' + idElementSelected + '-btn'));
        Resources.getInstance().addRemoveClassElements('selected-btn', 'remove', $('#' + idElementOneHide + '-btn'),
            $('#' + idElementTwoHide + '-btn'));
    }
    /**
     * Initialize button events for Resource Type
     */
    initializeResourceTypeButtons() {
        $('#supplies-btn, #medical-btn, #shelter-btn').on('click', (e) => {
            let select;
            let hideOne;
            let hideTwo;
            if (e.currentTarget.id === 'supplies-btn') {
                select = 'supplies';
                hideOne = 'shelter';
                hideTwo = 'medical';
            } else if (e.currentTarget.id === 'medical-btn') {
                select = 'medical';
                hideOne = 'supplies';
                hideTwo = 'shelter';
            } else {
                select = 'shelter';
                hideOne = 'medical';
                hideTwo = 'medical';
            }
            Resources.getInstance().buttonSelectionElements(select, hideOne,
                hideTwo);
            Resources.getInstance().addRemoveClassElements('hidden-main-content-block', 'remove',
                $('#' + select + '-content-div'));
            Resources.getInstance().addRemoveClassElements('hidden-main-content-block', 'add',
                $('#' + hideOne + '-content-div'), $('#' + hideTwo + '-content-div'));
        });
    }
    /**
     * Initialize buttons for steps events
     */
    initializeStepButtonEvents() {
        $('#step-one-btn, #step-two-btn, #step-three-btn').on('click', (e) => {
            let buttonSelected;
            let buttonideOne;
            let butonHideTwo;
            let hideTwo = '';
            let hideOne = '';
            let hideThree = '';
            let showOne = '';
            let showTwo = '';
            if (e.target.id === 'step-one-btn') {
                buttonSelected = 'step-one';
                buttonideOne = 'step-two';
                butonHideTwo = 'step-three';
                hideOne = $('#resource-location-div');
                hideTwo = $('#resource-picture-div');
                showOne = $('#step-one-content');
                showTwo = $('#div-resource-type');
            } else if (e.target.id === 'step-two-btn') {
                buttonSelected = 'step-two';
                buttonideOne = 'step-one';
                butonHideTwo = 'step-three';
                showOne = $('#resource-location-div');
                hideOne = $('#step-one-content');
                hideTwo = $('#resource-picture-div');
                hideThree = $('#div-resource-type');
            } else {
                buttonSelected = 'step-three';
                buttonideOne = 'step-one';
                butonHideTwo = 'step-two';
                showOne = $('#resource-picture-div');
                hideOne = $('#step-one-content');
                hideTwo = $('#resource-location-div');
                hideThree = $('#div-resource-type');
            }
            Resources.getInstance().buttonSelectionElements(buttonSelected, buttonideOne,
                butonHideTwo);
            Resources.getInstance().addRemoveClassElements('hidden-main-content-block', 'remove',
                showOne, showTwo);
            Resources.getInstance().addRemoveClassElements('hidden-main-content-block', 'add',
                hideOne, hideTwo, hideThree);
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
     * @param operation
     * @param showElement
     */
    addRemoveClassElements(nameClass, operation, ...showElement) {
        for (const element of showElement) {
            if (element !== '' && operation === 'add') {
                element.addClass(nameClass);
            }
            if (element !== '' && operation === 'remove') {
                element.removeClass(nameClass);
            }
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
        const description = $('#' + resourceType + '-description-id').val();
        const questionOne = $('#' + resourceType + '-q1-div input[type=\'radio\']:checked').val();
        // Only medical supplies type has one question
        if (resourceType !== 'medical') {
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
        const resourceType = $('#div-resource-type button.selected-btn');
        const pictureElement = $('#resource-picture').prop('files');
        let stringValidations = '';
        if (resourceType.length === 0) {
            stringValidations += 'Please select a Resource Type, ';
        }
        if ($('#resource-location').val() === '') {
            stringValidations += 'Resource  Location is a required field, ';
        }
        if ($('#resource-name-id').val() === '') {
            stringValidations += 'Resource Name is  a required field, ';
        }
        if (pictureElement.length !== 0 && pictureElement[0].size > 5000000) {
            stringValidations += 'Picture Size limit 2Mb, ';
        }
        const selectedResource = resourceType.attr('name').toLowerCase();
        stringValidations += Resources.getInstance().validateDescriptionQuestionsValues(selectedResource);
        return stringValidations;
    }

    /**
     * Method to validate questions fields are selected
     * @param id
     */
    validateDescriptionQuestionsValues(id) {
        let validateMessage = '';
        if ($('#' + id + '-description-id').val() === '') {
            validateMessage += 'Description is a mandatory field, ';
        }
        if ($('#' + id + '-q1-div input[type=\'radio\']:checked').length === 0) {
            validateMessage += 'Question 1 answers is a mandatory field, ';
        } else if (id !== 'medical' && $('#' + id + '-q2-div input[type=\'radio\']:checked').length === 0) {
            validateMessage += 'Question 2 answer is a mandatory field, ';
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
            .catch((error) => {
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
                $('#resources-content-menu').removeClass('active');
                $('#public-chat-content-menu').addClass('active');
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


