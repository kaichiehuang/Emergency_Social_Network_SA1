class ResourcesList {
    static instance= undefined;
    constructor() {
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

     showResourceDetail(resource) {
        // Changing labels
        $('.modal-body #resource-type-label').text('Resource Type:');
        $('.modal-body #picture-label').text('Picture:');

        // /Hide steps buttons
        $('.modal-body #div-steps').addClass('hidden-main-content-block');
        // SHOWING LOCATION IN THE SAME PAGE
        $('.modal-body #resource-location-div')
            .removeClass('hidden-main-content-block');
        // SHOWING PICTURE IN THE SAME PAGE
        $('.modal-body #resource-picture-div')
            .removeClass('hidden-main-content-block');
        // REMOVING PICTURES INPUTS
        $('.modal-body #resource-picture')
            .addClass('hidden-main-content-block');
        $('.modal-body #erasePicture')
            .addClass('hidden-main-content-block');
        $('.modal-body #resource-submit-btn')
            .addClass('hidden-main-content-block');
        // /ADDING PICTURE
        $('.modal-body  #imageDiv').removeClass('hidden-main-content-block');
        ResourcesList.getInstance().readURL(resource.image);
        // Adding Location
        $('.modal-body #resource-location').text(resource.location);
        $('.modal-body #resource-location').attr('readonly', true);
        // Adding resource name
        $('.modal-body #resource-name-id').val(resource.name);
        $('.modal-body #resource-name-id').attr('readonly', true);
        switch (resource.resource_type) {
        case 'SUPPLIES':
            // Hiding RESOURCES TYPE BUTTONS
            $('.modal-body #supplies-btn')
                .removeClass('hidden-main-content-block');
            $('.modal-body #medical-btn').addClass('hidden-main-content-block');
            $('.modal-body #shelter-btn').addClass('hidden-main-content-block');

            // HIDING DIVS OF ANOTHER RESOURCE TYPE
            $('.modal-body #supplies-content-div')
                .removeClass('hidden-main-content-block');
            $('.modal-body #medical-content-div')
                .addClass('hidden-main-content-block');
            $('.modal-body #shelter-content-div')
                .addClass('hidden-main-content-block');
            // SUPPLY DESCRIPTION
            $('.modal-body #supplies-description-id')
                .text(resource.description);
            $('.modal-body #supplies-description-id')
                .attr('readonly', true);
            // SUPPLY QUESTION ONE
            if (resource.question_one) {
                $('.modal-body #supplies-q1-yes').prop('checked', true);
                $('.modal-body #supplies-q1-yes').attr('readonly', true);
            } else {
                $('.modal-body #supplies-q1-no').prop('checked', true);
                $('.modal-body #supplies-q1-no').attr('readonly', true);
            }
            // SUPPLY QUESTION TWO
            if (resource.question_two) {
                $('.modal-body #supplies-q2-yes').prop('checked', true);
                $('.modal-body #supplies-q2-yes').attr('readonly', true);
            } else {
                $('.modal-body #supplies-q2-no').prop('checked', true);
                $('.modal-body #supplies-q2-no').attr('readonly', true);
            }


            break;
        case 'MEDICAL':
            // Hiding RESOURCES TYPE BUTTONS
            $('.modal-body #medical-btn')
                .removeClass('hidden-main-content-block');
            $('.modal-body #supplies-btn')
                .addClass('hidden-main-content-block');
            $('.modal-body #shelter-btn')
                .addClass('hidden-main-content-block');

            $('.modal-body #medical-content-div')
                .removeClass('hidden-main-content-block');
            $('.modal-body #supplies-content-div')
                .addClass('hidden-main-content-block');
            $('.modal-body #shelter-content-div')
                .addClass('hidden-main-content-block');
            // MEDICAL description
            $('.modal-body #medical-description-id')
                .text(resource.description);
            $('.modal-body #medical-description-id')
                .attr('readonly', true);
            // MEDICAL QUESTION ONE
            if (resource.question_one) {
                $('.modal-body #medical-q1-yes').prop('checked', true);
                $('.modal-body #medical-q1-yes').attr('readonly', true);
            } else {
                $('.modal-body #medical-q1-no').prop('checked', true);
                $('.modal-body #medical-q1-no').attr('readonly', true);
            }

            break;
        case 'SHELTER':
            // Hiding RESOURCES TYPE BUTTONS
            $('.modal-body shelter-btn')
                .removeClass('hidden-main-content-block');
            $('.modal-body #supplies-btn')
                .addClass('hidden-main-content-block');
            $('.modal-body #medical-btn')
                .addClass('hidden-main-content-block');

            $('.modal-body #shelter-content-div')
                .removeClass('hidden-main-content-block');
            $('.modal-body #medical-content-div')
                .addClass('hidden-main-content-block');
            $('.modal-body #supplies-content-div')
                .addClass('hidden-main-content-block');
            // SHELTER description
            $('.modal-body #shelter-description-id')
                .text(resource.description);
            $('.modal-body #shelter-description-id')
                .attr('readonly', true);
            // SHELTER QUESTION ONE
            if (resource.question_one) {
                $('.modal-body #shelter-q1-yes').prop('checked', true);
                $('.modal-body #shelter-q1-yes').attr('readonly', true);
            } else {
                $('.modal-body #shelter-q1-no').prop('checked', true);
                $('.modal-body #shelter-q1-no').attr('readonly', true);
            }
            // SHELTER QUESTION TWO
            if (resource.question_two) {
                $('.modal-body #shelter-q2-yes').prop('checked', true);
                $('.modal-body #shelter-q2-yes').attr('readonly', true);
            } else {
                $('.modal-body #shelter-q2-no').prop('checked', true);
                $('.modal-body #shelter-q2-no').attr('readonly', true);
            }

            break;
        default:
            break;
        }

        $('.modal-body #resources-content')
            .removeClass('hidden-main-content-block');
        $('.modal-body #resources-content')
            .removeClass('hidden');
        $('#exampleModalCenter').modal('show');
    }


     async readURL(image) {
        const base64Flag = 'data:image/png;base64,';
        const imageStr =
            await  ResourcesList.getInstance().arrayBufferToBase64(image.data.data);
        $('.modal-body  #image-preview').attr('src', base64Flag + imageStr);
    }

     arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };


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
                    template.querySelector('.resource-name').innerText =
                        resource.name;
                    template.querySelector('.fa-info-circle')
                        .classList.add('id-' + resource._id);
                    // set message counter from user
                    listContainer.appendChild(template);
                }
            }
            contentChangerEvent();
        }
    }

    // todo pass this to a class AddressBook that has an attribute currentUser
     updateResourceListView() {
        // get resource data
        ResourcesList.getInstance().getResources().then((resources) => {
            if (resources.length > 0) {
                ResourcesList.getInstance().drawResources(resources);
            }
        }).catch((err) => {
        });
    }
}


$(function() {
    ResourcesList.getInstance().updateResourceListView();
});

