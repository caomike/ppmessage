((function(View) {

    /**
     * @constructor
     */
    function PPContainer() {
        var PPDiv = View.PPDiv;
        PPDiv.call(this, {
            id: 'pp-container',
            'class': 'pp-container pp-box-sizing pp-location'
        });

        this.add(new View.CssStyle())
            .add(View.$launcher.build())
            .add(new View.PPMessenger());
    }
    extend(PPContainer, View.PPDiv);

    View.PPContainer = PPContainer;
    
})(View));
