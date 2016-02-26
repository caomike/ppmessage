((function(View) {

    /**
     * @constructor
     */
    function PPMessenger() {
        View.PPDiv.call(this, {
            id: 'pp-messenger',
            style: 'display:none'
        }, null);

        this.add(new View.PPDiv('pp-messenger-box-container')
                 .add(View.$conversation.build()));
    }
    extend(PPMessenger, View.PPDiv);

    View.PPMessenger = PPMessenger;
    
})(View));
