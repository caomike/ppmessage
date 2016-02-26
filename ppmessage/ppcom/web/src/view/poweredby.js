View.$poweredBy = ((function() {

    var id = 'pp-powered-by',
        elSelector = '#' + id;
    
    return {
        build: build,
        bindEvent: bindEvent
    }

    function build() {
        return new PPPoweredBy();
    }

    function bindEvent() {
        $( elSelector ).on( 'click', function() {
            Ctrl.$emojiSelector.get().showSelector(false);
            Ctrl.$groupMembers.hide();
        } );
    }

    /**
     * @constructor
     */
    function PPPoweredBy() {
        View.PPDiv.call( this, { id: id } );

        var ppMessage = Service.Constants.i18n('PPMESSAGE');
        var poweredBy = "Powered by <u class=\"pp-font\">" + ppMessage + "</u>";
        
        this.add(new View.PPElement('a', {
            href: Configuration.portal,
            target: '_blank'
        })
                 .add(new View.Span( {
                     'class': 'pp-powered-by-span pp-font'
                 })
                      .html(poweredBy)));
    }
    extend(PPPoweredBy, View.PPDiv);
    
} )());
