angular.module("this_app")
    .controller("MainCtrl", function(yvAjax) {
        var _init = function() {
            yvAjax.check_logined(null, null, "app.signin");
        };
        _init();
    }); 
