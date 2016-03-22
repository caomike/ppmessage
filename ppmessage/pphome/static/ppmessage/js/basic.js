// PPHome namespace
var PPHome = PPHome || {
    version: '0.0.4-dev'
};

//////////////////////////
// PPHome.Header
//////////////////////////
PPHome.Header = ( function() {

    ///////// API & Initialize /////////////
    
    return {
        NavigationBar: NavigationBar(),

        initialize: initialize,
        
        showRegisterButton: showRegisterButton,
        hideRegisterButton: hideRegisterButton
    };

    ///////// Implementation /////////////

    function NavigationBar() {

        return {
            highlight: highlight
        }

        function highlight( index ) {
            $( '.nav li a' ).removeClass( 'highlight' );
            $( '.nav li a' ).eq( index ).addClass( 'highlight' );
        }
        
    }

    function initialize() {
        bindEventToMobileNavToggleIcon();
    }

    function bindEventToMobileNavToggleIcon() {
        $( '.mobile-nav-toggle' ).on( 'click', function( e ) {

            var $header = $( '.header' ),
                isActive = $header.hasClass( 'active' );
            
            if ( isActive ) {
                $header.removeClass( 'active' );
            } else {
                $header.addClass( 'active' );
            }
            
        } );
    }

    function showRegisterButton() {
        $( document.body ).removeClass( 'nav-light' ).addClass( 'nav-dark' );
    }

    function hideRegisterButton() {
        $( document.body ).removeClass( 'nav-dark' ).addClass( 'nav-light' );
    }
    
} )();

//////////////////////////
// PPHome.Footer
//////////////////////////
PPHome.Footer = ( function() {

    var lang;

    return {
        initialize: initialize
    }

    function initialize() {
        lang = getLanguageFromUrl();
        console.log(lang);
        var $locales = $( '.locales' );
        $locales.val( lang );
        $locales.on( 'change', function( e ) {
            
            var oldLang = lang,
                newLang = $( this ).children( 'option:selected' ).val(),
                
                href = window.location.href,
                newHref = href.replace( oldLang, newLang );

            if ( newLang !== oldLang ) {
                window.location = newHref;   
            }
            
        } );
        
    }

    function getLanguageFromUrl() {
        var path = window.location.pathname;
        var lang = 'en_US'; // default

        if (path.indexOf("en_US") != -1) {
            lang = 'en_US';
        } else if (path.indexOf("zh_CN") != -1) {
            lang = 'zh_CN';
        }
        return lang;
    }
    
} )();

//////////////////////////
// PPHome.Device
//////////////////////////
PPHome.Device = ( function() {

    // device width <= 800px, we consider it as a mobile device
    var MOBILE_SIZE_LIMIT = 800,
        
        userAgent = navigator.userAgent,
        platform = navigator.platform,

        isIOS = /iPhone|iPad|iPod/i.test(userAgent),
        isAndroid = /Android/i.test(userAgent),
        isWP = /Windows Phone/i.test(userAgent) || /iemobile/i.test(userAgent) || /WPDesktop/i.test(userAgent),

        isMac = platform.toUpperCase().indexOf('MAC') >= 0,
        isWin = platform.toUpperCase().indexOf('WIN') > -1,
        isLin = platform.toUpperCase().indexOf('LINUX') > -1;

    ///////// API ////////
    return {
        size: size,
        os: os,
        
        isMobileSize: isMobileSize,
        isPCSize: isPCSize
    }

    function size() {
        return $( window ).width();
    }

    function isMobileSize() {
        return size() <= MOBILE_SIZE_LIMIT;
    }

    function isPCSize() {
        return !isMobileSize();
    }

    // @return
    // 'iOS' or 'Android'  or 'WP' or 'Win' or 'Mac' or 'Lin'
    function os() {
        if ( isIOS ) return 'iOS';
        if ( isAndroid ) return 'Android';
        if ( isWP ) return 'WP';
        if ( isMac ) return 'Mac';
        if ( isWin ) return 'Win';
        if ( isLin ) return 'Lin';

        return 'Win';
    }
    
} )();

PPHome.PPCom = ( function() {
    var PPMESSAGE_APP = {
        uuid: "a600998e-efff-11e5-9d9f-02287b8c0ebf"
    };

    $(document).ready(function(){
        if (window.PP) {
            PP.boot({
                app_uuid: PPMESSAGE_APP.uuid
            }, function(isSuccess, errorCode) {
                console.log("PPCOM boot: ", errorCode);
            });
        }
    });
    
}) ();

PPHome.Header.initialize();
PPHome.Footer.initialize();
