((function(Service) {

    var json = (function() {

        var jQuery = $;

        // Takes a well-formed JSON string and returns the resulting JavaScript value
        function parse(json) {
            return jQuery.parseJSON(json);
        }

        // converts a JavaScript value to JSON string
        function stringify(javaScript) {
            return JSON.stringify(javaScript);
        }

        return {
            parse: parse,
            stringify: stringify
        }
        
    })();
    
    Service.$json = json;
    
})(Service));
