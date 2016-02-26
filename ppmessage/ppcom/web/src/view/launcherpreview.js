View.$launcherPreview = (function() {

    var id = 'pp-launcher-preview',
        closeElId = 'pp-launcher-preview-close',
        previewBodyElId = 'pp-launcher-preview-outer-2',
        
        selector = '#' + id,
        previewTextEl = 'pp-launcher-preview-p',
        previewTextElCls = '.' + previewTextEl,

        self = {
            build: build,
            init: init,

            show: show,
            hide: hide,
            text: text    
        };

    ///////// API ////////////////
    
    return self;

    /////// Implementation ///////

    function init() {
        // on message arrived
        Service.$pubsub.subscribe( 'msgArrived/launcher', function( topics, ppMessage ) {
            if ( !Service.$device.inMobile() ) {
                self.show().text( ppMessage.getMessageSummary() );
            }
        });
        return self;
    }

    function build() {
        return new PPLauncherPreview();
    }

    function show() {
        $( selector ).show();
        return self;
    }

    function hide() {
        $( selector ).hide();
        return self;
    }

    function text(text) {
        $( previewTextElCls ).text(text);
        return self;
    }

    /**
     * @constructor
     */
    function PPLauncherPreview() {
        var PPDiv = View.Div;
        
        PPDiv.call(this, { id: id, style: 'display:none' } );

        this.add(new PPDiv('pp-launcher-preview-outer')
                 .add(new PPDiv({ id: previewBodyElId })
                      .add(new PPDiv('pp-launcher-preview-outer-3')
                           .add(new PPDiv({
                               id: closeElId,
                               style: 'background-image:url(' + Configuration.assets_path + 'img/icon-preview-close.png)'
                           }))
                           .add(new PPDiv('pp-launcher-preview-p-outer')
                                .add(new View.Span({
                                    className: previewTextEl
                                })))))
                 .add(new PPDiv('pp-launcher-preview-triangle')));

        // Build Event
        $timeout( buildEvent );

        function buildEvent() {

            var $close = $('#' + closeElId),
                $previewBody = $('#' + previewBodyElId);
            
            $previewBody
                .bind('mouseover', function() {
                    $close.show();
                })
                .bind('mouseleave', function() {
                    $close.hide();
                });

            $close
                .bind('click', function() {
                    hide();
                });
            
        }
    }
    extend(PPLauncherPreview, View.PPDiv);
    
})();
