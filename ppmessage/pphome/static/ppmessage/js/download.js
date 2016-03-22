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
        
        $( '.download-mobile-app' ).click(function () {
            var width = 300;
            var height = 220;
            var to_left = (window.screen.width - width) / 2;
            var to_top = (window.screen.height - height) / 2;
            var features = "width=" + width + ",height=" + height + ",left=" + to_left + ",top=" + to_top;
            var target = null;
            var list = window.location.href.split("/");
            list.pop();
            list.push("download_mobile_app.html");
            target = list.join("/");
            window.open(target, "scan-qrcode", features);
        });
    }
    
} )();

PPHome.Header.NavigationBar.highlight( 2 );
PPHome.DownloadPage.initialize();
