//////////////////////////
// PPHome.Banner
//////////////////////////
PPHome.Banner = ( function() {

    var bannerImgWidth = 0,

        api = {
            initialize: initialize,
            bindOnScrollEvent: bindOnScrollEvent,
            
            fitWindow: fitWindow
        };

    return api;

    function initialize() {
        fitWindow();
        bindArrowHintEvent();
        
        return api;
    }

    // detect banner img's height by current window's height
    function fitWindow() {
        var windowHeight = $( window ).height(),
            $banner = $( '.main .banner' );

        bannerImgWidth = windowHeight;
        $banner.css( { height: windowHeight } );
        return api;
    }

    function bindOnScrollEvent() {
        var headerHeight = $( '.header' ).height();
        
        $( window ).scroll( function( e ) {
            var showRegisterButton = PPHome.Device.isPCSize() &&
                $( window ).scrollTop()  + headerHeight >= bannerImgWidth;

            if ( showRegisterButton ) {
                PPHome.Header.showRegisterButton();
            } else {
                PPHome.Header.hideRegisterButton();
            }
            
        } );
        return api;
    }

    function bindArrowHintEvent() {

        var $el = $( 'a.gweb-smoothscroll-control' );
        
        $el.on( 'click' , function( e ) {
            
            $('html, body').animate( {
                scrollTop: $( '#start' ).offset().top
            }, 500);
            
        } );

        $( window ).scroll( function( e ) {
            if ( $( window ).scrollTop() > $( '.header' ).height() ) {
                $el.fadeOut();
            } else {
                $el.fadeIn();
            }
        } );
        
    }
    
} )();

PPHome.Banner.initialize();
