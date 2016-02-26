//////////////////////////
// PPHome.DownloadPage
//////////////////////////
PPHome.DownloadPage = ( function() {

    return {
        initialize: initialize
    }

    function initialize() {
        
        $( '.nav li a.register' ).detach();
        $( 'body' ).removeClass( 'nav-light' ).addClass( 'nav-dark' );

        var mobile = PPHome.Device.size() <= 948;

        if ( mobile ) {
            $( '.download-wrapper a.button-download' )
                .attr( 'href', PPHome.Device.os() );
        } else {
            $( '.download-wrapper' )
                .on( 'click', function( e ) {
                    $( this ).trigger( 'mouseover' );
                } )
                .on( 'mouseover', function( e ) {
                    $( 'ul.dropdown-list' ).show();
                } )
                .on( 'mouseleave', function( e ) {
                    $( 'ul.dropdown-list' ).hide();
                } );
        }
        
    }
    
} )();

PPHome.Header.NavigationBar.highlight( 2 );
PPHome.DownloadPage.initialize();
