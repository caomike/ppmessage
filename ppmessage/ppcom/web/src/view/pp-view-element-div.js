((function(View) {

    /**
     * @constructor
     */
    function PPDiv(attrs, ctrl) {
        View.PPElement.call(this, 'div', attrs, ctrl);
    }
    extend(PPDiv, View.PPElement);

    View.PPDiv = PPDiv;
    View.Div = PPDiv;
    
})(View));
