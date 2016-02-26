/**
 * After run the build command `sh merge.sh`:
 * { css } will be replaced by the content of ppcom/jquery/assets/css/output.min.css
 */
((function(View) {

    function CssStyle() {
        View.PPElement.call(this, 'style', {
            id: 'pp-styles',
            type: 'text/css'
        });
        
        this.text("@charset \"UTF-8\" {css}");
    }
    extend(CssStyle, View.PPElement);

    View.CssStyle = CssStyle;
    
})(View));
