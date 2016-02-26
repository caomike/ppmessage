((function(View) {
    
    function P(attrs, ctrl) {
        View.PPElement.call(this, 'p', attrs, ctrl);
    }
    extend(P, View.PPElement);

    View.P = P;
    
})(View));
