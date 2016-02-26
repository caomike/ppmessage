((function(Service) {

    function BaseStorage() {
    }
    BaseStorage.reposity = {};

    /**
     * 静态方法
     */
    BaseStorage.clear = function() {
        BaseStorage.reposity = {};        
    };

    BaseStorage.prototype.get = function(key) {
        return BaseStorage.reposity[key];
    };

    BaseStorage.prototype.set = function(key, value) {
        BaseStorage.reposity[key] = value;
    };

    BaseStorage.prototype.remove = function(key) {
        delete BaseStorage.reposity[key];
    };

    Service.BaseStorage = BaseStorage;
    
})(Service));
