//
// [ View ] <-----------> [ Controller ] <------------> [ Entity ]
//
((function(Ctrl) {

    /**
     * @constructor
     */
    function PPBaseCtrl(modal) {
        
        var _modal = modal;

        this.empty = function(selector) {
            $( selector ).empty();
        };

        this.show = function(selector, show) {
            $( selector ).css('display', show ? 'block' : 'none');
        };

        this.getModal = function() {
            return _modal;
        };

        this.setModal = function(modal) {
            _modal = modal;
        };
        
    }
    
    Ctrl.PPBaseCtrl = PPBaseCtrl;
    
})(Ctrl));
