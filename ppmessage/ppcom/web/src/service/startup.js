/**
 * 加载PPCom的入口:
 *
 * 创建匿名用户、获取用户信息、更新device等
 *
 * new PP.PPStartUp().startUp(ppSettings, function() {
 *     console.log('StartUp successful!');
 * }, function(errorCode) {
 *     console.log('StartUp failed, errorCode: ' + errorCode);
 * });
 *
 */
((function(Service) {

    /**
     * @constructor
     */
    function PPStartUp($api, $device) {

        var ErrorHint = Service.ErrorHint,

            _createAnonymousUser = function(cookieId, succCB, failCB) {
                $api.createAnonymousUser({
                    app_uuid: Service.$ppSettings.getAppUuid(),
                    ppcom_trace_uuid: cookieId
                }, succCB, failCB);
            },

            /*
             * 如果 ppSettings.user_name 存在并且和服务器的 user_fullname 不同，那么会更新服务器的用户信息
             *
             * @param user: 根据 window.ppSettings 生成的本地的 user object
             * @param userNameFromServer: 匿名创建用户返回的默认user_fullname 或者 实名用户调用 getUserDetailInfo 返回的 user_fullname
             * @param succCB: success 回调
             * @param failCB: fail 回调
             */
            _updateUserInfo = function(userSettings, response, succCB, failCB) {
                if (userSettings.user_fullname || userSettings.user_avatar) {
                    var requestObj = {
                        user_uuid: userSettings.user_uuid,
                        user_fullname: userSettings.user_fullname,
                        user_icon: userSettings.user_avatar,
                        user_email: userSettings.user_email
                    };
                    $api.updateUser(requestObj, succCB, failCB);
                } else {
                    Service.$ppSettings.updateUserSettings({
                        user_fullname: response.user_fullname,
                        user_avatar: response.user_avatar
                    });
                    if (succCB) succCB();
                }
            },

            _createDevice = function(userSettings, succCB, failCB) {
                $api.createDevice({
                    app_uuid: Service.$ppSettings.getAppUuid(),
                    user_uuid: userSettings.user_uuid,
                    device_ostype: Service.$device.getOSType(),
                    ppcom_trace_uuid: userSettings.ppcom_trace_uuid,
                    device_id: Service.$device.getDeviceId()
                }, function(result) {
                    
                    $api.updateDevice({
                        device_uuid: result.device_uuid,
                        device_ostype: Service.$device.getOSType()
                    });
                    Service.$ppSettings.updateUserSettings({
                        device_uuid: result.device_uuid
                    });

                    succCB(result);
                }, function(response) {

                    var DEVICE_EXISTED_ERROR_CODE = 25;
                    
                    //Create device failed.
                    if (response && response['error_code']) {
                        if (response['error_code'] == DEVICE_EXISTED_ERROR_CODE) {
                            Service.$ppSettings.updateUserSettings({
                                device_uuid : response.device_uuid
                            });
                            succCB(response);
                            return;
                        }
                    }
                    if (failCB) failCB(response);
                });
            },

            // The final callback
            //
            // 1. update local user info
            // 2. fetch the MUST REQUEST INITIAL DATA from server to show `PPMessage`
            // 3. create `WebSocket` so listen for new message arrived
            // 4. draw view
            // 5. callback
            _getDefaultCreateDeviceSuccessCallback = function(userSettings, succCallback, errorCallback) {
                return function() {

                    // Store web_site user
                    Service.$user.setUser(userSettings);

                    // create dom
                    View.Style.init();
                    $(document.body).append(new View.PPContainer().getElement());

                    // start message receiver service
                    Service.$messageReceiverModule.start({
                        user_uuid: userSettings.user_uuid,
                        device_uuid: userSettings.device_uuid,
                        app_uuid: Service.$ppSettings.getAppUuid()
                    });

                    setTimeout(function() {
                        if (succCallback) succCallback();
                    });
                    
                }
            },

            _startUpAnonymousUser = function(userSettings, succCallback, errorCallback) {

                // 1. create anonymous user
                // 2. update user info
                // 3. create device
                // 4. update device
                // 5. create dom
                var cookieId = userSettings.ppcom_trace_uuid;
                
                _createAnonymousUser(cookieId, function(response) {
                    Service.$ppSettings.updateUserSettings({
                        user_uuid : response.user_uuid
                    });
                    _updateUserInfo(userSettings, {user_fullname:response.user_fullname, user_avatar: null}, null, null);
                    _createDevice(userSettings, _getDefaultCreateDeviceSuccessCallback(userSettings, succCallback, errorCallback), null);
                }, errorCallback);
            },

            _startUpNoneAnonymousUser = function(userSettings, succCallback, errorCallback) {

                // Validate Email
                if (!Service.$tools.validateEmail(userSettings.user_email)) {
                    if (errorCallback) errorCallback(Service.ErrorHint.ERROR_ILLEGAL_USER_EMAIL_STYLE);
                    return;
                }

                // 1. get user uuid
                // 2. get user detail info
                // 3. update user info
                // 4. create device
                // 5. update device
                // 6. create dom
                $api.getUserUuid({
                    user_email: userSettings.user_email,
                    user_fullname: userSettings.user_fullname
                }, function(response) {
                    $api.getUserDetailInfo({
                        user_uuid: response.user_uuid
                    }, function(response) {
                        Service.$ppSettings.updateUserSettings({
                            user_uuid : response.uuid
                        });
                        _updateUserInfo(userSettings, {user_fullname: response.fullname, user_avatar: response.icon}, null, null);
                        _createDevice(userSettings, _getDefaultCreateDeviceSuccessCallback(userSettings, succCallback, errorCallback), null);
                    }, function(error) {
                    });
                }, function() {
                    if (errorCallback) errorCallback(Service.ErrorHint.ERROR_ILLEGAL_USER_EMAIL);
                });
            };

        //-------------------------------
        //API
        //-------------------------------

        this.startUp = function(ppSettings, succCallback, errorCallback) {

            // check browser version
            if (Service.$device.isIE9OrLowerVersionBrowser()) {
                if (errorCallback) errorCallback(ErrorHint.ERROR_IE9_OR_LOWER_BROWSER);
                return;
            }
            
            //Make a copy
            var s = {};
            $.extend(true, s, ppSettings);

            //Use ppSettings init $ppSettings service
            Service.$ppSettings.init(s);
            //init view settings
            View.$settings.init(s);
            
            if (Service.$ppSettings.getAppUuid()) {

                // Use app_key and app_secret to init $api service
                Service.$api.init(Service.$ppSettings.getAppUuid(), Service.$ppSettings.getApiKey(), Service.$ppSettings.getApiSecret());
                
                //set language
                Service.$language.setLanguage(Service.$ppSettings.getLanguage());

                // 0. zero step
                Service.$api.getPPComToken(function(response) {
                    // 1. first step
                    Service.$api.getAppInfo({
                        app_uuid: Service.$ppSettings.getAppUuid(),
                    }, function(response) {
                        // Cache app info to root cache
                        Service.$app.set(response);
                        
                        var userSettings = Service.$ppSettings.getUserSettings();
                        //anonymous user
                        if (userSettings.is_anonymous) {
                            _startUpAnonymousUser(userSettings, succCallback, errorCallback);
                        } else {
                            _startUpNoneAnonymousUser(userSettings, succCallback, errorCallback);
                        }
                        
                    }, function(error) {
                        if (errorCallback) errorCallback(ErrorHint.ERROR_SERVICE_NOT_AVALIABLE);
                    });
                    
                }, function(error) {
                    if (errorCallback) errorCallback(ErrorHint.ERROR_SERVICE_NOT_AVALIABLE);
                });
            } else {
                if (errorCallback) errorCallback(ErrorHint.ERROR_ILLEGAL_APPUUID);
            }
        };
    }

    PPStartUp.bootServices = function(reboot) {
        Service.bootMe(reboot);
        View.bootMe(reboot);
    };

    Service.PPStartUp = PPStartUp;
})(Service));
