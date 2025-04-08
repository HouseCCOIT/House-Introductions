/*!
 * hoverIntent v1.8.0 // 2014.06.29 // jQuery v1.9.1+
 * http://cherne.net/brian/resources/jquery.hoverIntent.html
 *
 * You may use hoverIntent under the terms of the MIT license. Basically that
 * means you are free to use hoverIntent as long as this header is left intact.
 * Copyright 2007, 2014 Brian Cherne
 */
(function($){$.fn.hoverIntent=function(handlerIn,handlerOut,selector){var cfg={interval:100,sensitivity:6,timeout:0};if(typeof handlerIn==="object"){cfg=$.extend(cfg,handlerIn)}else{if($.isFunction(handlerOut)){cfg=$.extend(cfg,{over:handlerIn,out:handlerOut,selector:selector})}else{cfg=$.extend(cfg,{over:handlerIn,out:handlerIn,selector:handlerOut})}}var cX,cY,pX,pY;var track=function(ev){cX=ev.pageX;cY=ev.pageY};var compare=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);if(Math.sqrt((pX-cX)*(pX-cX)+(pY-cY)*(pY-cY))<cfg.sensitivity){$(ob).off("mousemove.hoverIntent",track);ob.hoverIntent_s=true;return cfg.over.apply(ob,[ev])}else{pX=cX;pY=cY;ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}};var delay=function(ev,ob){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t);ob.hoverIntent_s=false;return cfg.out.apply(ob,[ev])};var handleHover=function(e){var ev=$.extend({},e);var ob=this;if(ob.hoverIntent_t){ob.hoverIntent_t=clearTimeout(ob.hoverIntent_t)}if(e.type==="mouseenter"){pX=ev.pageX;pY=ev.pageY;$(ob).on("mousemove.hoverIntent",track);if(!ob.hoverIntent_s){ob.hoverIntent_t=setTimeout(function(){compare(ev,ob)},cfg.interval)}}else{$(ob).off("mousemove.hoverIntent",track);if(ob.hoverIntent_s){ob.hoverIntent_t=setTimeout(function(){delay(ev,ob)},cfg.timeout)}}};return this.on({"mouseenter.hoverIntent":handleHover,"mouseleave.hoverIntent":handleHover},cfg.selector)}})(jQuery);

/* ====================
* jQuery Cookie Plugin
* https://github.com/carhartl/jquery-cookie
*
* Copyright 2011, Klaus Hartl
* Dual licensed under the MIT or GPL Version 2 licenses.
* http://www.opensource.org/licenses/mit-license.php
* http://www.opensource.org/licenses/GPL-2.0
* ==================== */
(function ($) {
    $.cookie = function (key, value, options) {

        // key and at least value given, set cookie...
        if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
            options = $.extend({}, options);

            if (value === null || value === undefined) {
                options.expires = -1;
            }

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = String(value);

            return (document.cookie = [
                encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        }

        // key and possibly options given, get cookie...
        options = value || {};
        var decode = options.raw ? function (s) { return s; } : decodeURIComponent;

        var pairs = document.cookie.split('; ');
        for (var i = 0, pair; pair = pairs[i] && pairs[i].split('='); i++) {
            if (decode(pair[0]) === key) return decode(pair[1] || ''); // IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, thus pair[1] may be undefined
        }
        return null;
    };
})(jQuery);


/* ====================
 * MN Legislature - navigation event management handler
 *      - Legislature-wide hover and mobile devices management
 *      - runs after DOM is constructed (in jQuery ready() function)
 *
 * To add possibly: /webos|blackberry|Windows|PhoneZuneWP7/ support
 * ==================== */
jQuery(document).ready(function () {
    //----------------- global variables
    var mobileSize = 480;                                                   //set cut-off for screen size of small mobile handheld devices           
    var tapOnly = false;                                                    //flag for handling taps & gestures on touch screen devices (true = tap, false = gesture or no tap)
    var skipHoverIntent = false;                                            //flag for ignoring mouse hover out behavior
    var ddCleanupSet;                                                       //flag for setting additional keypress event manageers if needed

    //----------------- setup large screens and tablets

    if (jQuery(window).width() > mobileSize) {
        var deviceAgent = navigator.userAgent.toLowerCase();                //identify the user agent
        var isMatch = (deviceAgent.match(/(ipad|android)/) != null);        //setup flag for match against device agent checks

        //check cookie to show mobile despite large screen
        if ($.cookie('usemobile') === 'yes') {                              //cookie flag, so show mobile view on full screen
            manageMobileView();
        }
        else {                                                              //no cookie or set to no, so show full view            
            if (!isMatch) {                                                 //setup for non-tablet - only add hoverintent to large screens, for mouse user interface
                var hoverConfig = {                 //setup hoverIntent - hoverConfig var sets timing/conditions for showing core navitgation drop-down into banner
                    sensitivity: 4,                 // = (number) sensitivity threshold (must be 1 or higher); if the mouse travels fewer than this number of pixels between polling intervals, then the "over" function will be called  
                    interval: 50,                   // = (number) milliseconds for onMouseOver polling interval; wait time between reading & comparing mouse coordinates    
                    timeout: 65,                    // = (number) milliseconds of delay before onMouseOut event fires
                    over: hoverOver,                // = (function) to call in onMouseOver event callback (REQUIRED)                        
                    out: hoverOut                   // = (function) to call in onMouseOut event callback (REQUIRED)
                };

                //add hoverIntent event manager to (1) each <li> for top-level leg navigation, and (2) office navigation links with 'tab index' menus
                jQuery('.leg_LegNav .leg_NavItem').hoverIntent(hoverConfig);
                jQuery('.leg_OfficeNavTop').closest('.leg_NavItem').hoverIntent(hoverConfig);

                //add keyboard navigation event management
                manageKeys();
            }
            else {                                                          //setup for tablet (ipad & android)                
                manageFullView();
            }
        }
    }   //end large screen & tablet setup


    //----------------- setup handheld MOBILE nav

    if (jQuery(window).width() <= mobileSize) {
        var mobileCookie = $.cookie('usemobile');

        //show mobile unless cookie flagged it otherwise
        if ((mobileCookie != 'no') || (mobileCookie == null)) {             //no cookie or set to no, so show mobile view
            manageMobileView();
        }
        else {                                                              //cookie flag, so show full screen view
            manageFullView();
        }
    }


    //----------------- setup search text boxes

    //set flag for removing default input box text
    jQuery('.leg_DefaultText').attr('isCleared', 'false');

    //setup text removal from search text boxes
    jQuery('.leg_DefaultText').focus(function () {
        var isCleared = (jQuery(this).attr('isCleared') == 'true');

        if (!isCleared) {
            jQuery(this).attr('value', '');
            jQuery(this).attr('isCleared', 'true');
            jQuery(this).css('font-style', 'normal');
        }
    });


    //----------------- setup cookie & handle switching between mobile/full display

    jQuery('.leg_ViewFull').click(function (event) {
        $.cookie('usemobile', 'no', { expires: 365, path: '/' });

        var href = $(location).attr('href');
        if (href.indexOf('#') > 0) {
            href = href.substring(0, href.indexOf('#'));                    //strip internal link
        }
        window.location.href = href;
    });

    jQuery('.leg_IconMobile').click(function (event) {
        $.cookie('usemobile', 'yes', { expires: 365, path: '/' });

        var href = $(location).attr('href');
        if (href.indexOf('#') > 0) {
            href = href.substring(0, href.indexOf('#'));                    //strip internal link
        }
        window.location.href = href;
    });

        
    //  ======================================================
    //  FUNCTIONS: event manageers
    //  ======================================================


    //purpose: setup event management for mobile view navigation
    //comments: uses CLICK event instead of hover
    function manageMobileView() {
        //----- Legislative nav

        //toggle top-level
        jQuery('#leg_mobile_LegNavHeader h2').click(function (event) {
            toggleNavHeader('leg_mobile_LegNavHeader', 'leg_LegNav');
            event.preventDefault();                                         //don't follow a link
        });

        //toggle core links
        jQuery('.leg_LegNavTop').click(function (event) {
            var returnStatus = handleNavCore(this, 'leg_LegNav', true);
            if (returnStatus == true) {
                return;
            }
            else {
                event.preventDefault();                                     //don't follow a link
            }
        });

        jQuery('.leg_LegNav .leg_mobile_Accordion').click(function (event) {
            handleNavCore(this, 'leg_LegNav', false);
            event.preventDefault();                                         //don't follow a link
        });


        //----- office nav

        //toggle top-level
        jQuery("#leg_mobile_OfficeNavHeader h2").click(function (event) {
            toggleNavHeader('leg_mobile_OfficeNavHeader', 'leg_OfficeNav');
            event.preventDefault();                                         //don't follow a link
        });

        //toggle core links
        jQuery('.leg_OfficeNavTop').click(function () {
            var returnStatus = handleNavCore(this, 'leg_OfficeNav', true);
            if (returnStatus == true) {
                return;
            }
            else {
                event.preventDefault();                                     //don't follow a link
            }
        });

        jQuery('.leg_OfficeNav .leg_mobile_Accordion').click(function (event) {
            handleNavCore(this, 'leg_OfficeNav', false);
            event.preventDefault();                                         //don't follow a link
        });

    }  //END manageMobileView()


    //purpose: setup event management for full screen view navigation on touchscreen devices
    //comments: uses CLICK event instead of hover (which requires mouse)
    function manageFullView() {

        //----- legislative nav
        jQuery('.leg_LegNav .leg_NavItem').click(function (event) {
            if (jQuery(this).find('a.leg_LegNavTop').hasClass('leg_LegNavTop_Hover') == true) {         //hover class already applied, so currently showing this dropdown
                return;                                                                                 //no intervention needed; if link clicked, browser will follow
            }
            else {               
                hideAllNav();                                                                           //hide all dropdowns
                showDropDown(this);                                                                     //show this dropdown   
                event.preventDefault();                                                                 //started showing a dropdown, prevent following link within this <li>
            }
        });

        //----- office nav
        jQuery('.leg_OfficeNavTop').closest('.leg_NavItem').click(function (event) {
            if (jQuery(this).find('a.leg_OfficeNavTop').hasClass('leg_OfficeNavTop_Hover') == true) {   //hover class already applied, so currently showing this dropdown
                return;                                                                                 //no intervention needed; if link clicked, browser will follow
            }
            else {               
                hideAllNav();                                                                           //hide all dropdowns
                showDropDown(this);                                                                     //show this dropdown   
                event.preventDefault();                                                                 //started showing a dropdown, prevent following link within this <li>
            }
        });

        //----- add event listening to remove nav dropdowns

        //setup flag for drop-down removal
        jQuery('.leg_FirstNav, .leg_Masthead, .leg_OfficeNav, .leg_PageContent, .leg_PageFooter, .leg_PageFooterAddr').not('.leg_OfficeNav > ul').bind('touchstart', function () {
            tapOnly = true;
        });

        //gesture in progress, set flag to not remove drop-downs on gestures
        jQuery('.leg_FirstNav, .leg_Masthead, .leg_OfficeNav, .leg_PageContent, .leg_PageFooter, .leg_PageFooterAddr').not('.leg_OfficeNav > ul').bind('touchmove', function () {
            tapOnly = false;
        });

        //remove drop-downs if a gesture didn't occur
        jQuery('.leg_FirstNav, .leg_Masthead, .leg_OfficeNav, .leg_PageContent, .leg_PageFooter, .leg_PageFooterAddr').not('.leg_OfficeNav > ul').bind('touchend', function () {
            if (tapOnly == true) {
                hideAllNav();
                tapOnly = false;                                            //reset
            }
        });

    }  //END manageFullView()


    //purpose: setup event management for keystroke navigation
    function manageKeys() {
        //----- setup flag
        ddCleanupSet = false;                                                                   //for additional keyboard & click event management (see setupDropDownClean function)

        //----- first nav
        jQuery('.leg_FirstNav a, .leg_FirstNav input').focus(function () {
            hideAllNav();
        });


        //----- legislative nav

        //top level - focus/blur
        jQuery('.leg_LegNavTop').focus(function () {
            //if not already showing, clear other nav "dropdowns" and show this one
            if (jQuery(this).hasClass('leg_LegNavTop_Hover') == false) {                        
                hideAllNav();
                showDropDown(jQuery(this).parent());
            }

            setupDropDownClean();
            jQuery(this).css('text-decoration', 'underline');
        });

        jQuery('.leg_LegNavTop').blur(function () {
            jQuery(this).css('text-decoration', '');
        });


        //top level - tab & arrow management
        jQuery('.leg_LegNavTop').on('keydown', function (event) {
            var navItem;
            var nextNode;

            navItem = jQuery(this).closest('.leg_NavItem');
            switch (event.which)
            {
                case 9:                                                                     //tab
                    if (event.shiftKey) {                                                   //reverse direction
                        nextNode = navItem.prev('.leg_NavItem').find('a.leg_LegNavTop');
                    }
                    else {
                        if (navItem.is(':last-child')) {                                    //end of top level links
                            nextNode = jQuery('.leg_Masthead').find('a:first');
                        }
                        else {
                            nextNode = navItem.next('.leg_NavItem').find('a.leg_LegNavTop');
                        }
                    }
                    break;

                case 40:                                                                    //arrow down
                    //go to first focusable element in core nav (dropdown menu)
                    nextNode = navItem.find('.leg_LegNavCore a:first, .leg_LegNavCore input:first').slice(0, 1);                    
                    break;

                default:
            }
        
            //set new focus if an alternative navigation is setup, otherwise allow default behavior
            if (jQuery(nextNode).length > 0) {
                jQuery(nextNode).focus();
                event.preventDefault();
            }            
        });


        //core nav links
        jQuery('.leg_LegNavCore a, .leg_LegNavCore input').focus(function () {
            var navItem = jQuery(this).parents('.leg_NavItem');

            //if not already showing, clear other nav "dropdowns" and show this one
            if (jQuery(navItem).find('.leg_LegNavTop').hasClass('leg_LegNavTop_Hover') == false) {              
                hideAllNav();
                showDropDown(navItem);
            }

            //only setup for anchor links; input field focus could instead be reached via mouse
            if (jQuery(this).is('a') == true) {
                setupDropDownClean();                                                           
                jQuery(this).css('text-decoration', 'underline');
            }
        });

        jQuery('.leg_LegNavCore a').blur(function () {
            jQuery(this).css('text-decoration', '');
        });


        //----- office nav

        //top level - focus/blur menu mgmt
        jQuery('.leg_OfficeNavTop').focus(function () {
            //if not already showing, clear other nav "dropdowns" and show this one
            if (jQuery(this).hasClass('leg_OfficeNavTop_Hover') == false) {
                hideAllNav();
                showDropDown(jQuery(this).closest('.leg_NavItem'));
            }

            setupDropDownClean();
            jQuery(this).css('text-decoration', 'underline');
        });

        jQuery('a.leg_OfficeNavLinkonly, .leg_OfficeNav input, .leg_OfficeNav select').focus(function () {
            hideAllNav();
            setupDropDownClean();
        });

        jQuery('.leg_OfficeNavTop').blur(function () {
            jQuery(this).css('text-decoration', '');
        });


        //top level - tab & arrow management
        jQuery('.leg_OfficeNavTop').on('keydown', function (event) {
            var navItem;
            var nextNode;

            navItem = jQuery(this).closest('.leg_NavItem');
            switch (event.which) {
                case 9:                                                                     //tab
                    if (event.shiftKey) {                                                   //reverse direction
                        nextNode = navItem.prev('.leg_NavItem').find('a.leg_OfficeNavTop, a.leg_OfficeNavLinkonly, input:last, select');
                    }
                    else {
                        if (navItem.is(':last-child')) {                                    //end of top level links
                            nextNode = jQuery('.leg_PageContent').find('a:first');
                        }
                        else {
                            nextNode = navItem.next('.leg_NavItem').find('a.leg_OfficeNavTop, a.leg_OfficeNavLinkonly, input:first, select');
                        }
                    }
                    break;

                case 40:                                                                    //arrow down
                    //go to first focusable element in core nav (dropdown menu)
                    nextNode = navItem.find('.leg_OfficeNavCore a:first');
                    break;

                default:
            }

            //set new focus if an alternative navigation is setup, otherwise allow default behavior
            if (jQuery(nextNode).length > 0) {
                jQuery(nextNode).focus();
                event.preventDefault();
            }
        });

        //other office nav focusable elements
        jQuery('.leg_OfficeNavLinkonly, .leg_OfficeNav select, .leg_OfficeNav .leg_NavItem input:first').on('keydown', function (event) {
            var nextNode;

            //tab backwards to last top level nav link (not link in dropdown menu), if necessary
            if ((event.shiftKey) && (event.which == 9)) {
                nextNode = jQuery(this).closest('.leg_NavItem').prev('.leg_NavItem').find('a.leg_OfficeNavTop');

                if (nextNode.length > 0) {
                    jQuery(nextNode).focus();
                    event.preventDefault();
                }
            }
        });

        
        //core nav links
        jQuery('.leg_OfficeNavCore a').focus(function () {
            var navItem = jQuery(this).parents('.leg_NavItem');

            //if not already showing, clear other nav "dropdowns" and show this one
            if (jQuery(navItem).find('.leg_OfficeNavTop').hasClass('leg_OfficeNavTop_Hover') == false) {
                hideAllNav();
                showDropDown(navItem);
            }

            setupDropDownClean();
            jQuery(this).css('text-decoration', 'underline');
        });

        jQuery('.leg_OfficeNavCore a').blur(function () {
            jQuery(this).css('text-decoration', '');
        });


        //----- masthead

        jQuery('.leg_Masthead a').focus(function () {
            hideAllNav();
            setupDropDownClean();
            jQuery(this).css('text-decoration', 'underline');
        });

        jQuery('.leg_Masthead a').blur(function () {
            jQuery(this).css('text-decoration', '');
        });
        
        jQuery('.leg_Masthead a:first').on('keydown', function (event) {
            //tab backwards to last top level nav link (not link in dropdown menu), if necessary
            if ((event.shiftKey) && (event.which == 9)) {
                jQuery('.leg_LegNav .leg_NavItem:last-child').find('a.leg_LegNavTop').focus();
                event.preventDefault();
            }
        });


        //----- page content - first focusable element
        jQuery('.leg_PageContent a:first, .leg_PageContent input:first, .leg_PageContent select:first').slice(0, 1).on('keydown', function (event) {
            var nextNode;

            //tab backwards to last top level nav link (not link in dropdown menu), if necessary
            if ((event.shiftKey) && (event.which == 9)) {
                nextNode = jQuery('.leg_OfficeNav .leg_NavItem:last-child').find('a.leg_OfficeNavTop');

                if (nextNode.length > 0) {
                    jQuery(nextNode).focus();
                    event.preventDefault();
                }
            }
        });



        //----------------- manageKeys functions

        //purpose: binds dropdown cleanup management to keyboard nav
        //  - conditionally set up if keypress nav is used
        //  - uses a flag for setting up event handlers one time only
        function setupDropDownClean() {
            if (ddCleanupSet == false) {
                jQuery('.leg_PageContent a, .leg_PageFooter a, .leg_PageFooterAddr a, .leg_PageContent input, .leg_PageContent select').focus(function () {
                    hideAllNav();
                });
                jQuery('body').on('click', function (event) {
                    if (!jQuery(event.target).parents('.leg_LegNav, .leg_OfficeNav').length) {                  //only hide if click did not bubble up from within nav elements
                        hideAllNav();
                    }
                });

                ddCleanupSet = true;
            }
        }
        
    }  //END manageKeys()
    


    //  =========================================
    //  FUNCTIONS: nav dropdowns
    //  =========================================


    //purpose: shows a core drop-down when mouse hovers over a nav
    //  -called through hoverIntent based on mouse movement
    //  -this = current .leg_LegNav ul li, or current .leg_OfficeNav ul li)   
    function hoverOver() {
        //handle previous keypress menu navigation if any (have a hover navItem object, and it is not the same as the one triggering the hover event)
        var navItem = jQuery('.leg_PageHeader').find('.leg_LegNavTop_Hover, .leg_OfficeNavTop_Hover').parents('.leg_NavItem');                        
        
        if (navItem.length > 0) {                                                               //have previous dropdown
            if (!(jQuery(navItem).get(0) === jQuery(this).get(0))) {                            //prev dropdown is not the same as the one to be shown, so clear it & show this one
                removeDropDown(navItem);
                jQuery(navItem).find('a').css('text-decoration', '');

                showDropDown(this);                                                             
            }
            else {                                                                              //prev dropdown is this one, set flag to skip removing it on hoverOut
                skipHoverIntent = true;
            }
        }
        else {                                                                                  //no previous dropdown to handle, just show this one
            showDropDown(this);
        }
    }


    //purpose: removes a core drop-down when mouse no longer hovers over it
    //  -wrapper called through hoverIntent based on mouse movement
    //  -this = current .leg_LegNav ul li, or current .leg_OfficeNav ul li)   
    function hoverOut() {
        if (!skipHoverIntent) {
            removeDropDown(this);
        }
        else {
            skipHoverIntent = false;                                                            //reset for next hoverIntent call
        }
    }


    //purpose: shows a core "dropdown"
    //  -handles both leg nav and office nav in one function, but only one "dropdown" will display through this function call
    //parameters:
    //  navItemNode         - element containing nav top and core (class should be "leg_NavItem")
    function showDropDown(navItemNode) {
        var core;
        var curHeight;

        //----- leg nav
        //shift over core leg nav, from underneath banner       
        core = jQuery(navItemNode).find('.leg_LegNavCore');
        if (core.length > 0) {            
            core.css({
                'height': '0',
                'left': '-1px'
            });  
            core.animate({ height: '140px' }, 'fast');

            //setup 'tab index' view
            jQuery(navItemNode).find('a.leg_LegNavTop').addClass('leg_LegNavTop_Hover');
        }

        //----- office nav
        //shift over core office nav
        core = jQuery(navItemNode).find('.leg_OfficeNavCore');
        if (core.length > 0) {
            curHeight = core.height();                                      //identify dynamic height
            core.css({
                'height': '0',
                'margin-left': '0'
            });
            core.animate({ height: curHeight }, 'fast');

            //setup 'tab index' view
            jQuery(navItemNode).find('a.leg_OfficeNavTop').addClass('leg_OfficeNavTop_Hover');
        }
    }


    //purpose: removes a core "dropdown"
    //  -handles both leg nav and office nav in one function
    //parameters:
    //  navItemNode         - element containing nav top and core (class of element should be "leg_NavItem")
    function removeDropDown(navItemNode) {        
        var core;
        var curHeight;

        //----- leg nav
        core = jQuery(navItemNode).find('.leg_LegNavCore');
        if (core.length > 0) {
           core.animate({ height: '0px' }, 125, function () {                                                       //callback function; fires after animation to reset dropdown
                jQuery(navItemNode).find('a.leg_LegNavTop').removeClass('leg_LegNavTop_Hover');                     //remove 'tab index' view
                jQuery(navItemNode).find('.leg_LegNavCore').css({
                    'left': '-4000px',                                                                              //shift core leg nav over to hide it, which shows banner
                    'height': '140px'                                                                               //restore original height
                });
           });
        }
        
        //----- office nav
        core = jQuery(navItemNode).find('.leg_OfficeNavCore');
        if (core.length > 0) {
            core.animate({ height: '0px' }, 125, function () {                                                      //callback function; fires after animation to reset dropdown
                jQuery(navItemNode).find('a.leg_OfficeNavTop').removeClass('leg_OfficeNavTop_Hover');               //remove 'tab index' view
                jQuery(navItemNode).find('.leg_OfficeNavCore').css({
                    'margin-left': '-4000px',                                                                       //shift core office nav over to hide it, which shows banner
                    'height': ''                                                                                    //restore original height
                });
            });
        }        
    }

    
    //purpose: removes core "dropdowns"
    //  -handles both leg nav and office nav in one function
    function hideAllNav() {
        var navItem;

        //----- leg nav
        navItem = jQuery('.leg_LegNav').find('.leg_LegNavTop_Hover').parent('.leg_NavItem');
        if (navItem.length > 0) {
            removeDropDown(navItem);
        }
        
        //----- office nav
        navItem = jQuery('.leg_OfficeNav').find('.leg_OfficeNavTop_Hover').parents('.leg_NavItem');
        if (navItem.length > 0) {
            removeDropDown(navItem);
        }
    }



    //  =========================================
    //  FUNCTIONS: mobile
    //  =========================================
    

    //purpose: handles expand/contract top-level nav links under a NavHeader
    //parameters:
    //  headerID        - ID of nav header element
    //  navClass        - class of nav links 
    function toggleNavHeader(headerID, navClass) {
        var navWrapper = jQuery(document).find('.' + navClass);

        navWrapper.toggle();                    //make nav links visible or hidden
        if (navWrapper.is(':visible')) {        //nav is now shown
            jQuery('#' + headerID).addClass('leg_mobile_NavHeader_Expanded');
        }
        else {                                  //nav is now hidden
            jQuery('#' + headerID).removeClass('leg_mobile_NavHeader_Expanded');

            //close out core/sub-navigation too
            navWrapper.find('.' + navClass + 'Core').toggle(false);
            navWrapper.find('.' + navClass + 'Top').css('text-decoration', 'none');
            navWrapper.find('a').removeClass('leg_mobile_Accordion_Expanded');
        }
    }


    //purpose: hides & closes up sub-navigation of top-level nav  
    //parameters:
    //  headerID        - ID of nav header element to close up
    //  navClass        - class of nav links to hide
    function closeNavHeader(headerID, navClass) {
        jQuery(document).find('#' + headerID).removeClass('leg_mobile_NavHeader_expanded');
        jQuery(document).find('.' + navClass).toggle(false);
        jQuery(document).find('.' + navClass + 'Core').toggle(false);               //close out core/sub-navigation too
    }


    //purpose: handles expand/contract nav core links, or following a link
    //parameters:
    //  toggleElement           - element being clicked for toggle
    //  classStub               - stub nav class name
    //  bFollow                 - flag for whether to follow link (instead of toggle) if nav core already expanded
    function handleNavCore(toggleElement, classStub, bFollow) {
        var navItem = jQuery(toggleElement).closest('.leg_NavItem');
        var navCore = jQuery(navItem).find('.' + classStub + 'Core');
        

        if (navCore.is(':visible')) {                   //core is currently shown
            if (bFollow) {
                return true;
            }
            navCore.toggle(false);                      //make core nav links hidden
            jQuery(navItem).find('.' + classStub + 'Top').css('text-decoration', 'none');
            jQuery(navItem).find('a.leg_mobile_Accordion').removeClass('leg_mobile_Accordion_Expanded');
        }
        else {                                          //core is currently hidden
            navCore.toggle(true);                       //make core nav links visible
            jQuery(navItem).find('a.leg_mobile_Accordion').addClass('leg_mobile_Accordion_Expanded');

            //link can be followed if core is expanded, so show link availability
            jQuery(navItem).find('.' + classStub + 'Top').css('text-decoration', 'underline');
        }

        return false;                                   //indicate to not follow a link
    }

});        /* END document ready navigation event management */
