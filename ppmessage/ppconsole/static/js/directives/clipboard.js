angular.module("this_app")
    .directive("clipboard", function() {
        return {
            restrict: "A",
                        
            link: function($element) {
                console.log("entering....");
                var _id = $($element).attr("id");
                if(!_id) {
                    $($element).attr("id", 'clipboard' + Date.now());
                    _id = $($element).attr("id");
                };

                var client = new ZeroClipboard('#' + _id);

                client.on("ready", function( readyEvent ) {
                    console.log("begin copy");
                    client.on("success", function( event ) {
                        console.log("ok");
                    });
                    client.on("aftercopy", function( event ) {
                        console.log("end copy....");
                        //do something
                    });
                });
            },
        };
    })
;

