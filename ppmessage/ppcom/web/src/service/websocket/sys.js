Service.$notifySys = (function () {

    var SUB_TYPE = 'LOGOUT';
    
    ////// API /////////////
    
    return {
        get: logoutMessageDispatcher
    }

    // {mt: "SYS", bo: "57bedf0e-a88f-11e5-b287-00163e00061e", ms: "LOGOUT"}
    // 'bo' meaning: 'device_uuid'
    function logoutMessageDispatcher ( $notifyService, sysMessage ) {

        return {
            
            dispatch: dispatch
        }

        function dispatch () {

            if ( sysMessage ) {

                if ( isLogoutMessage( sysMessage ) ) {
                    $notifyService.reset();
                }

            }
            
        }

        function isLogoutMessage ( jsonMessageBody ) {
            // TODO
            // check jsonMessageBody.bo ( divice_uuid ) is current user's device_uuid
            return jsonMessageBody && jsonMessageBody.ms && jsonMessageBody.ms === SUB_TYPE;
        }
    }
    
})();
