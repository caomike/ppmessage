((function(Service) {

    function PPDebug() {
        
        var _DEBUG_ = true,
            _TEMPORARY_CLOSE_ = false,
            self = this,

            supportConsole = !(typeof console === "undefined" || typeof console.log === "undefined"),
            supportConsoleApply = supportConsole && !(typeof console.log.apply === "unknown" || typeof console.log.apply === "undefined"),
            
            highlightBegin = '↓↓↓↓↓↓↓↓↓↓',
            highlightStyle = "font-size:28px; color:blue;";

        this.h = function() {
            if (!supportConsole) return;
            
            if (_DEBUG_) {
                var cssStr = "%c" + highlightBegin;
                this.d(cssStr, highlightStyle);
            }
            return this;
        }
        
        this.d = function() {
            if (!supportConsole) return;
            
            if (_DEBUG_) {
                if (!_TEMPORARY_CLOSE_) {
                    var args = Array.prototype.slice.call(arguments);
                    supportConsoleApply ? console.log.apply(console, args) : console.log(args);
                } else {
                    _TEMPORARY_CLOSE_ = false;
                }
            }
            return this;
        };

        this.error = function() {
            if (!supportConsole) return;
            
            if (_DEBUG_) {
                if (!_TEMPORARY_CLOSE_) {
                    var args = Array.prototype.slice.call(arguments);
                    supportConsoleApply ? console.error.apply(console, args) : console.error(args);
                } else {
                    _TEMPORARY_CLOSE_ = false;
                }
            }
            return this;                    
        };

        /*
         * temporarily close debug
         *
         * call this method before `this.d()`
         *
         * Example:
         * Service.Debug.close(true).d('----I will not show----');
         */
        this.close = function(close) {
            // _TEMPORARY_CLOSE_ = (close != undefined) ? close : false;
            return this;
        };

        this.debug = function(d) {
            _DEBUG_ = d;
            return this;
        };
    }

    Service.$debug = new PPDebug();
    
})(Service));
