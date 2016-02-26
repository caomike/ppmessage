/**
 * 创建和删除Cookie
 *
 * Example:
 *
 * var cookie = new Service.PPCookies();
 * cookie.set('key', 'value', {
 *     expires: 7 // 7 day
 * });
 * cooki.get('key'); // return value
 *
 */
((function(Service) {

    /**
     * constructor
     */
    function PPCookies() {
    }

    PPCookies.prototype._api = function(key, value, attributes) {
        //write
        if (arguments.length > 1) {
            attributes = attributes || {};
            if (typeof attributes.expires === 'number') {
                var expires = new Date();
                expires.setMilliseconds(expires.getMilliseconds() + attributes.expires * 1000);
				attributes.expires = expires;
            }
            return (document.cookie = [
				key, '=', value,
				attributes.expires && '; expires=' + attributes.expires.toUTCString(), // use expires attribute, max-age is not supported by IE
				attributes.path    && '; path=' + attributes.path,
				attributes.domain  && '; domain=' + attributes.domain,
				attributes.secure ? '; secure' : ''
			].join(''));
        }

        //read
        var result;
        var cookies = document.cookie ? document.cookie.split('; ') : [];
        var i = 0;
        for (; i < cookies.length; i++) {
            var parts = cookies[i].split('=');
            var name = parts[0];
            var value = parts[1];

            if (name === key) {
                result = value;
                break;
            }
        }

        return result;
    };

    /**
     * 设置Cookie
     */
    PPCookies.prototype.set = function(key, value, attributes) {
        return this._api(key, value, attributes);
    };

    /**
     * 根据Key从Cookie中取值
     */
    PPCookies.prototype.get = function(key) {
        return this._api(key);
    };

    Service.PPCookies = PPCookies;
    
})(Service));
