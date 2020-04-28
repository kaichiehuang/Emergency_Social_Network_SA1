/**
 *  group class Users list      ---->  user-list-components
 *  group class Public chat     ---->  public-chat-components
 *  group class Private chat    ---->  private-chat-components
 *  group class Announcements   ---->  announcements-components
 *
 *
 */
let currentContentPageID = '';
let userJWT = null;
let userAcknowledgement = null;
let currentUser = null;
/**
 * On load init
 * @param  {[type]} ) {               if (Cookies.get('username') ! [description]
 * @return {[type]}   [description]
 */
$(function() {
    if (Cookies.get('username') !== undefined) {
        $('.user-name-reference').html(Cookies.get('username'));
    }
    socket = io('/');
    // initialize current user
    currentUser = new User();
    currentUser._id = Cookies.get('user-id');
    // init events for content change
    menuContentChangerEvent();
    globalContentChangerEvent();
    showElementEvent();
    hideElementEvent();
    // init JWT token
    userJWT = Cookies.get('user-jwt-esn');
    // user is not logged in
    if (userJWT == null || userJWT == undefined || userJWT == '') {
        if (window.location.pathname !== '/') {
            window.location.replace('/');
        }
    }
    // user is logged in
    else {
        // TODO test if cookie is expired
        userAcknowledgement = Cookies.get('user-acknowledgement');
        if (window.location.pathname == '/') {
            if (userAcknowledgement === 'true') {
                window.location.replace('/app');
            } else {
                swapViewContent('acknowledgement-page-content', 'main-content-block');
            }
        }
        User.getInstance().initCurrentUser();
        $('.hideadble-menu-item a').click(function(event) {
            $('.menu-less').parent().addClass('hidden');
            $('.menu-more').parent().removeClass('hidden');
            $('.hideadble-menu-item').removeClass('active-hideadble-menu-item').addClass('hidden');
            $(this).parent().addClass('active-hideadble-menu-item').removeClass('hidden');
        });
        $('.menu-more').click(function(event) {
            $('.menu-more').parent().addClass('hidden');
            $('.menu-less').parent().removeClass('hidden');
            $('.hideadble-menu-item:not(.active-hideadble-menu-item)').removeClass('hidden');
        });
        $('.menu-less').click(function(event) {
            $('.menu-less').parent().addClass('hidden');
            $('.menu-more').parent().removeClass('hidden');
            $('.hideadble-menu-item:not(.active-hideadble-menu-item)').addClass('hidden');
        });
    }
});


/**
 * Event registration for menu content changer buttons
 * @return {[type]} [description]
 */
function menuContentChangerEvent() {
    $('.menu-content-changer').click(function(event) {
        $('.menu-content-changer').removeClass('active');
        $('#status-button').removeClass('active');
        $(this).addClass('active');
        event.preventDefault();
        executeSwapContent($(this));
    });
}

/**
 * Event registration for content changer buttons that dont
 * @return {[type]} [description]
 */
function globalContentChangerEvent() {
    $('.content-changer').click(function(event) {
        executeSwapContent($(this));
    });
}

/**
 * Swaps content following id to display of group class to display and classes to hide
 * @param  {[type]} element [description]
 * @return {[type]}         [description]
 */
function executeSwapContent(element) {
    const viewID = element.data('view-id');
    const subViewID = element.data('sub-view-id');
    const groupClass = element.data('view-group-class');
    let hideViewClass = element.data('hide-view-class');
    let hideSubViewClass = element.data('sub-view-hide-class');
    let hideGroupClass = element.data('group-hide-class');
    if (hideViewClass == undefined) {
        hideViewClass = 'main-content-block';
    }
    if (hideSubViewClass == undefined) {
        hideSubViewClass = 'hideable-group-component';
    }
    if (hideGroupClass == undefined) {
        hideGroupClass = 'hideable-group-component';
    }
    if (viewID != undefined && viewID != '') {
        swapViewContent(viewID, hideViewClass);
    }
    if (subViewID != undefined && subViewID != '') {
        swapViewContent(subViewID, hideSubViewClass);
    }
    if (groupClass != undefined && groupClass != '') {
        swapGroupContent(groupClass, hideGroupClass);
    }
}

/**
 * [showElementEvent description]
 * @return {[type]} [description]
 */
function showElementEvent() {
    $('.visible-controller').change(function(e) {
        const idToDisplay = $(this).data('id-to-display');
        const classToDisplay = $(this).data('class-to-display');
        showElements(idToDisplay, classToDisplay);
    });
    $('.visible-controller').click(function(e) {
        const idToDisplay = $(this).data('id-to-display');
        const classToDisplay = $(this).data('class-to-display');
        showElements(idToDisplay, classToDisplay);
    });
}

/**
 * [showElementEvent description]
 * @return {[type]} [description]
 */
function hideElementEvent() {
    $('.hide-controller').change(function(e) {
        const idToHide = $(this).data('id-to-hide');
        const classToHide = $(this).data('class-to-hide');
        hideElements(idToHide, classToHide);
    });
    $('.hide-controller').click(function(e) {
        const idToHide = $(this).data('id-to-hide');
        const classToHide = $(this).data('class-to-hide');
        hideElements(idToHide, classToHide);
    });
}

/**
 * hide and show actions
 */
/**
 * Swaps visible content. It receives an ID to show and hides everything with the class  main-content-block
 * @param  {[type]} viewID [description]
 * @return {[type]}       [description]
 */
function swapViewContent(viewID, classToHide) {
    if (classToHide == undefined) {
        classToHide = 'main-content-block';
    }
    $('.' + classToHide).addClass('hidden');
    $('#' + viewID).removeClass('hidden');
    $('.' + classToHide).addClass('hidden-main-content-block');
    $('#' + viewID).removeClass('hidden-main-content-block');
    oldContentPageID = currentContentPageID;
    currentContentPageID = viewID;
}

/**
 * [swapGroupContent description]
 * @param  {[type]} newGroupClass [description]
 * @return {[type]}               [description]
 */
function swapGroupContent(newGroupClass, classToHide) {
    $('.' + classToHide).addClass('hidden');
    $('.' + newGroupClass).removeClass('hidden');
    currentContentGroupClass = newGroupClass;
}
/**
 * Shows elements with a matching class or ID
 * @param  {[type]} idToDisplay    [description]
 * @param  {[type]} classToDisplay [description]
 * @return {[type]}                [description]
 */
function showElements(idToDisplay, classToDisplay) {
    if ($('#' + idToDisplay).length > 0) {
        $('#' + idToDisplay).removeClass('hidden');
    }
    if ($('.' + classToDisplay).length > 0) {
        $('.' + classToDisplay).removeClass('hidden');
    }
}
/**
 * Hides elements with a matching class or ID
 * @param  {[type]} idToHide    [description]
 * @param  {[type]} classToHide [description]
 * @return {[type]}             [description]
 */
function hideElements(idToHide, classToHide) {
    if ($('#' + idToHide).length > 0) {
        $('#' + idToHide).addClass('hidden');
    }
    if ($('.' + classToHide).length > 0) {
        $('.' + classToHide).addClass('hidden');
    }
}
