Service.$app = (function() {

    var POLICY_BROADCAST = 'broadcast',
        POLICY_GROUP = 'group',

        appInfo,
        
        set = function(info) {
            appInfo = info;
        },

        get = function() {
            return appInfo;
        };
    
    return {

        POLICY_BROADCAST: POLICY_BROADCAST,
        POLICY_GROUP: POLICY_GROUP,
        
        set: set,

        policy: function() { // policy
            return POLICY_BROADCAST; // ( get() && get().app_route_policy ) || POLICY_BROADCAST; 
        },

        app: get, // appInfo

        appName: function() {// appName
            return get().app_name; 
        },

        appId: function() {
            return get().app_uuid;
        }
    }
    
})();
