((function() {

    View._booted = false;

    View.bootMe = function(reboot) {
        if (!View._booted || reboot) {

            View.$settings = new View.PPSettings();
            View.$textUrlChecker = new View.TextUrlChecker();
            
            View._booted = true;
        }
    };

    View._pool = {};

    View.add = function(key, value) {
        View._pool[key] = value;
    };

    View.find = function(key) {
        return View._pool[key];
    };
    
})());
