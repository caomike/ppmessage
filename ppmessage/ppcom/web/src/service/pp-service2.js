/**
 * 使用`Service.bootMe()`来初始化服务。
 *
 */
((function() {

    Service._booted = false;

    Service.bootMe = function(reboot) {
        if (!Service._booted || reboot) {
            
            Service.$cookies = new Service.PPCookies();
            Service.$tools = new Service.PPTools();
            Service.$errorHint = new Service.ErrorHint();
            Service.$publicApi = new Service.PublicAPI();
            
            Service.$startUp = new Service.PPStartUp(Service.$api, Service.$device);

            Service._booted = true;
        }
    };
    
})());
