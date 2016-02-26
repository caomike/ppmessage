((function(View) {
    
    function Img(attrs, ctrl) {
        View.PPElement.call(this, 'img', attrs, ctrl);
    }
    extend(Img, View.PPElement);

    View.Img = Img;
    
})(View));
