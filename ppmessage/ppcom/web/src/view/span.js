((function(View) {
    
    function Span(attrs, ctrl) {
        View.PPElement.call(this, 'span', attrs, ctrl);
    }
    extend(Span, View.PPElement);

    View.Span = Span;
    
})(View));
