function PPModule(jQuery) {
    
    var fn,

        buildFn = function(jQuery) { // build a NEW ppmessage instance
            return PPMessage(jQuery);
        },
        
        getFn = function(jQuery) { // get a fn
            if (!existFn()) {
                fn = buildFn(jQuery);

                // Faciliate our debug to see the inner world of `PP` object by call `PP.fn.xxx`
                // Consider to remove this line when put `PP` on release mode
                PP.fn = fn;
            }
            return fn;
        },

        existFn = function() { // Does fn exist ?
            return fn !== undefined;
        },

        cleanFn = function() { // Clear fn
            fn = undefined;
        },

        PP = {

            /**
             * major.minor.status.revision
             *
             * status: 0 for alpha
             *         1 for beta
             *         2 for release candiate
             *         3 for (final) release
             */
            version : '0.1.0.31',

            /**
             * Boot PPCom with ppSettings
             */
            boot : function(ppSettings, callback) {
                ppSettings = ppSettings || window.ppSettings;
                ppSettings && getFn(jQuery).Service.$publicApi.boot(ppSettings, callback);
            },

            /**
             * Show PPCom MessageBox
             */
            show : function() {
                existFn(jQuery) && getFn(jQuery).Service.$publicApi.show();
            },

            /**
             * Hide PPCom MessageBox
             */
            hide : function() {
                existFn(jQuery) && getFn(jQuery).Service.$publicApi.hide();
            },

            /**
             * PPCom MessageBox onShow event callback
             */
            onShow : function(event) {
                existFn(jQuery) && getFn(jQuery).Service.$publicApi.onShow(event);
            },

            /**
             * PPCom MessageBox onHide event callback
             */
            onHide : function(event) {
                existFn(jQuery) && getFn(jQuery).Service.$publicApi.onHide(event);
            },

            /**
             * This method will effectively clear out any user data that you have been passing through the JS API. 
             * You should call the shutdown method anytime a user logs out of your application.
             *
             * [Note]: This will cause PPCom fully dismiss from your application.
             */
            shutdown : function() {
                existFn(jQuery) && getFn(jQuery).Service.$publicApi.shutdown();
                cleanFn();
            },

            /**
             * Update PPCom by ppSettings
             */
            update : function(ppSettings) {
                ppSettings = ppSettings || window.ppSettings;
                if ( existFn(jQuery) && getFn(jQuery).Service.$publicApi.update(ppSettings) ) {
                    PP.shutdown();
                    PP.boot(ppSettings);
                }
            }

        };

    return PP;
    
}
