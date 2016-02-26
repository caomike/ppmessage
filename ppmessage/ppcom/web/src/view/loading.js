View.$loading = (function() {

    /**
     * @constructor
     */
    function PPLoading() {
        var PPDiv = View.PPDiv;
        
        PPDiv.call(this, {
            id: id,
            'class': id + ' pp-box-sizing'
        });

        this.add(new PPDiv({
            id: 'pp-loading-spinner',
            style: 'background-image:url(' + Configuration.assets_path + 'img/spinner.png)'
        }));

    }
    extend(PPLoading, View.PPDiv);

    var id = 'pp-loading',
        elSelector = '#' + id,

        show = function() {
            $(elSelector).fadeIn();
        },

        hide = function() {
            $(elSelector).fadeOut();
        },

        build = function() {
            return new PPLoading();
        };

    return {
        build: build,

        show: show,
        hide: hide
    }
    
})();
