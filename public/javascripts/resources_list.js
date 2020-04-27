/**
 * Class for Resource List
 */
class ResourcesList {
    /**
     * Initializing Resource Class
     */
    constructor() {
        this.instance = undefined;
        $(document).on('click', '#icon', function(event) {
            // eslint-disable-next-line no-invalid-this
            for (const cssClass of this.classList) {
                if (cssClass.includes('id')) {
                    const index = cssClass.indexOf('-');
                    const resourceId = cssClass.substring(index + 1);
                    ResourcesList.getInstance().getResourceById(resourceId);
                    break;
                }
            }
        });

        $('#addResourceIcon').on('click', (e) => {
            swapViewContent('resources-content');
        });

        // Click event, to update user list when the user switch between views
        $('.menu-content-changer').click(function(event) {
            event.preventDefault();
            // eslint-disable-next-line no-invalid-this
            const newID = $(this).data('view-id');
            if (newID === 'resources-list-content') {
                ResourcesList.getInstance().updateResourceListView();
            }
        });
    }
    /**
     * Singleton instance element
     * @return {[type]} [description]
     */
    static getInstance() {
        if (this.instance === undefined) {
            this.instance = new ResourcesList();
        }
        return this.instance;
    }

    /**
     * Method to initializae common elements
     */
    initializeCommonElements(resource) {
        // Changing labels
        $('.modal-body #resource-type-label').text('Resource Type:');
        $('.modal-body #picture-label').text('Picture:');
        ResourcesList.getInstance().addClassElements('hidden-main-content-block',
            $('.modal-body #div-steps'), $('.modal-body #resource-picture'), $('.modal-body #erasePicture'),
            $('.modal-body #resource-submit-btn'));

        ResourcesList.getInstance().removeClassElements('hidden-main-content-block',
            $('.modal-body #resource-location-div'), $('.modal-body #resource-picture-div'),
            $('.modal-body  #imageDiv'));
        ResourcesList.getInstance().readURL(resource.image);
        // Adding Location
        $('.modal-body #resource-location').text(resource.location).attr('readonly', true);
        // Adding resource name
        $('.modal-body #resource-name-id').val(resource.name).attr('readonly', true);
    }

    /**
     * Method to initialize resource view
     * @param resource
     */
    showResourceDetail(resource) {
        ResourcesList.getInstance().initializeCommonElements(resource);
        const resourceSelected= resource.resource_type.toLowerCase();
        let resourceOneToHide;
        let resourceTwoToHide;
        if (resource.resource_type === 'SUPPLIES') {
            resourceOneToHide = 'medical';
            resourceTwoToHide = 'shelter';
        } else if (resource.resource_type === 'MEDICAL') {
            resourceOneToHide = 'supplies';
            resourceTwoToHide = 'shelter';
        } else {
            resourceOneToHide = 'supplies';
            resourceTwoToHide = 'medical';
        }
        ResourcesList.getInstance().addClassElements('hidden-main-content-block',
            $('.modal-body #'+ resourceOneToHide +'-btn'), $('.modal-body #'+ resourceTwoToHide +'-btn'),
            $('.modal-body #'+ resourceOneToHide +'-content-div'), $('.modal-body #'+ resourceTwoToHide +'-content-div'));
        ResourcesList.getInstance().removeClassElements('hidden-main-content-block',
            $('.modal-body #'+ resourceSelected +'-btn'), $('.modal-body #'+ resourceSelected +'-content-div'));
        $('.modal-body #'+ resourceSelected +'-description-id').text(resource.description).attr('readonly', true);
        ResourcesList.getInstance().initializingQuestions(resource,resourceSelected);
        $('.modal-body #resources-content').removeClass('hidden-main-content-block').removeClass('hidden');
        $('#exampleModalCenter').modal('show');
    }

    /**
     * Method to set previous values to questions
     * @param resourceSelected
     */
    initializingQuestions(resource,resourceSelected) {
        let questionActivate;
        if (resource.question_one) {
            questionActivate = '-q1-yes';
        } else {
            questionActivate = '-q1-no';
        }
        ResourcesList.getInstance().setQuestionValue(resourceSelected + questionActivate);
        questionActivate = '';
        if (resource.resource_type !== 'MEDICAL' ) {
            if (resource.question_two) {
                questionActivate = '-q2-yes';
            } else {
                questionActivate = '-q2-no';
            }
            ResourcesList.getInstance().setQuestionValue(resourceSelected + questionActivate);
        }
    }

    /**
     * Activvate the checkbox of the selected question
     * @param id
     */
    setQuestionValue(id) {
        $('.modal-body #'+ id ).prop('checked', true).attr('readonly', true);
    }


    /**
     * Method to show the image on the page
     * @param image
     * @returns {Promise<void>}
     */
    async readURL(image) {
        const base64Flag = 'data:image/png;base64,';
        const imageStr =
            await ResourcesList.getInstance().arrayBufferToBase64(image.data.data);
        $('.modal-body  #image-preview').attr('src', base64Flag + imageStr);
    }

    /**
     * Convert image data to Base64 to render on the view
     * @param buffer
     * @returns {string}
     */
    arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };


    /**
     * Method to request an specific resource information
     * @param resourceId
     * @returns {Promise<unknown>}
     */
    getResourceById(resourceId) {
        return new Promise((resolve, reject) => {
            APIHandler.getInstance()
                .sendRequest('/resources/' + resourceId,
                    'get', null, true, null)
                .then((response) => {
                    ResourcesList.getInstance().showResourceDetail(response);
                    resolve(response);
                })
                .catch((error) => {
                    reject(error.message);
                });
        });
    }

    /**
     * Method to request all the resources registered
     * @returns {Promise<unknown>}
     */
    getResources() {
        return new Promise((resolve, reject) => {
            APIHandler.getInstance()
                .sendRequest('/resources/',
                    'get', null, true, null)
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    reject(error.message);
                });
        });
    }

    /**
     * Method to draw all resources on the list
     * @param resources
     */
    drawResources(resources) {
        const containerId = 'resources_list-content';
        $('#resources-list-div .no-results-message').addClass('hidden');
        // 1. find templates in html
        const resourceTemplate = document.querySelector('template#resources-template');
        // 2. find container
        const listContainer = document.getElementById(containerId);
        $('#' + containerId + ' li').remove();
        if (listContainer != undefined) {
            for (let i = 0; i < resources.length; i++) {
                const resource = resources[i];
                let template = null;
                // 4. online state
                if (resourceTemplate != undefined) {
                    template = resourceTemplate.content.cloneNode(true);
                }
                if (template != undefined && template != null) {
                    template.querySelector('.resource-name').innerText = resource.name;
                    template.querySelector('.fa-info-circle').classList.add('id-' + resource._id);
                    // set message counter from user
                    listContainer.appendChild(template);
                }
            }
            contentChangerEvent();
        }
    }

    /**
     * Update the resource view
     */
    updateResourceListView() {
        // get resource data
        ResourcesList.getInstance().getResources().then((resources) => {
            if (resources.length > 0) {
                ResourcesList.getInstance().drawResources(resources);
            }
        }).catch((err) => {
        });
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
}


$(function() {
    ResourcesList.getInstance().updateResourceListView();
});

