+( function() {

    yvLoginedUser.$inject = [];
    function yvLoginedUser() {

        var user,
            
            isLogin = false;

        return {
            isLogined: isLogined,
            setLogined: setLogined,
            get: get,
            update: update,
            logout: logout,
            isAdminUser: isAdminUser,

            userUUID: userUUID
        }

        function isLogined() {
            return isLogin;
        }

        function setLogined ( l ) {
            isLogin = l;
        }

        function get () {
            return user;
        }

        function update ( u ) {
            user = u;
        }

        function logout () {
            user = null;
            isLogin = true;
        }

        function isAdminUser() {
            var adminUser = false;
            if ( get() ) {
                if ( get().user_status === 'ADMIN' ) {
                    adminUser = true;
                }
            }
            return adminUser;
        }

        function userUUID() {
            if ( get() ) {
                return get().uuid;
            }
            return undefined;
        }
        
    }

    angular.module("this_app.services").factory( "yvLoginedUser", yvLoginedUser );
    
}() )
