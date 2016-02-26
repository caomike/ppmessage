/**
 * http://gsgd.co.uk/sandbox/jquery/easing/
 */
(function($) {

    $.extend($.easing, {
        easeInQuart: function (x, t, b, c, d) {
            return c*(t/=d)*t*t*t + b;
        }
    });
    
})($);
