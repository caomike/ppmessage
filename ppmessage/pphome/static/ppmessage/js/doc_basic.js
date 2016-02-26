PPHome.DocBasic = ( function() {

    return {
        initialize: initialize,
        active: active
    };
    
    function initialize() {
        if ( PPHome.Device.isMobileSize() ) {
            var $navBody = $( '.main .nav > ul' );
            
            $( '.main .nav .toggler' )
                .on( 'click', function( e ) {
                    if ( $navBody.is( ':visible' ) ) {
                        $navBody.hide();
                    } else {
                        $navBody.show();
                    }
                } );
        }
    }
    
    function active( keyword ) {
        $( '.main .nav a' ).removeClass( 'active' );
        $( '.main .nav a[href*="' + keyword + '"]' ).addClass( 'active' );
    }
    
} )();

PPHome.DocBasic.initialize();
