//
// @description: for global data cache
//
// Service.$rootCache.set(Service.KEYS.XXX_XXX);
// var myValue = Service.$rootCache.get(Service.KEYS.XXX_XXX);
//
Service.$rootCache = (function() {

    var storage = {},

        get = function(key) {
            return storage[key];
        },

        set = function(key, value) {
            storage[key] = value;
        },

        exist = function(key) {
            return storage[key] !== undefined;
        };

    return {
        get:get,
        set:set,
        exist:exist
    }
    
})();
