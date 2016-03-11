((function(Service) {

    function PPAPI() {

        var _apiToken = null,
            _apiKey = null,
            _apiSecret = null,
            _appUuid = null,

            // Internal Server Error
            _onError = function(response, fail) {
                Service.$debug.d('[PPAPI] [Error]: ', response);
                Service.$errorHint.warn(Service.ErrorHint.ERROR_SERVICE_NOT_AVALIABLE);
                if (fail) fail(response);
            },

            _onApiError = function(response, fail) {
                Service.$debug.d('[PPAPI] [Fail]: ', response);
                if (fail) fail(response);
            },
            
            _onApiSuccess = function(response, success) {
                Service.$debug.d('[PPAPI] [Success]: ', response);
                if (success) success(response);
            },
            
            _onResponse = function(response, success, fail) {
                if (response && (response['error_code'] !== undefined)) {
                    var succ = false;
                    switch(response['error_code']) {
                    case 0:
                        succ = true;
                        break;
                        
                    // case 25: // no imapp info
                    //     Service.$errorHint.warn(Service.ErrorHint.ERROR_ILLEGAL_APPKEY_OR_SECRET);
                    //     break;
                        
                    default:
                        break;
                    }

                    if (succ) {
                        _onApiSuccess(response, success);                                
                    } else {
                        _onApiError(response, fail);
                    }
                } else {
                    _onApiError(response, fail);
                }
            },
            
            _onBeforeSend = function(url, data) {
                Service.$debug.d('[PPAPI] [Request]: ', url, data);
            };
                        
        this._post = function(url, data, success, fail) {

            if (_apiToken == null) {
                Service.$debug.d('[PPAPI] [Error]: ', "no token");
                Service.$errorHint.warn(Service.ErrorHint.ERROR_SERVICE_NOT_AVALIABLE);
                return;
            }
           
            var urlPath = Configuration.api + url;
            $.support.cors = true;

            // DON'T set `dataType` to `json` here !!!
            //
            // If you set `dataType: 'json'`, then when you send `??`, jQuery will throw a `parsererror` exception
            // 
            // As the jQuery offical doc says:
            // The JSON data is parsed in a strict manner; any malformed JSON is rejected and a parse error is thrown
            //
            // @see http://api.jquery.com/jquery.ajax/
            // @see http://stackoverflow.com/questions/5061310/jquery-returning-parsererror-for-ajax-request
            $.ajax({
                url: urlPath,
                type: 'post',
                data: Service.$json.stringify(data),
                headers: {
                    "Content-Type": "application/json;charset=utf-8",
                    "Authorization": "OAuth " + _apiToken,
                },
                cache: false,
                crossDomain : true,
                beforeSend: function() {
                    _onBeforeSend(urlPath, data);
                },
                success: function(response) {
                    _onResponse(response, success, fail);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    _onError(textStatus, fail);
                }
            });
        };

        this.init = function(appUuid, apiKey, apiSecret) {
            _appUuid = appUuid;
            _apiKey = apiKey;
            _apiSecret = apiSecret;            
        };

        this.getPPComToken = function(success, fail) {
            var urlPath = Configuration.auth + "/token";
            var requestData = "client_id=" + _apiKey + "&client_secret=" + _apiSecret + "&grant_type=client_credentials"
            
            $.support.cors = true;
            $.ajax({
                url: urlPath,
                type: 'post',
                data: requestData,
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                cache: false,
                crossDomain : true,
                beforeSend: function() {
                    _onBeforeSend(urlPath, requestData);
                },
                success: function(response) {
                    _apiToken = response.access_token;
                    _onApiSuccess(response, success);
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    _onError(textStatus, fail);
                }
            });
        };

        /*
         * @param data: 
         *     {
         *         email: xxx@xxx.com,
         *         fullname: xxx,
         *     }
         */
        this.createUser = function(data, success, fail) {
            this._post("/PP_CREATE_USER", {
                user_email: data.email,
                user_fullname: data.fullname,
                user_create_from_browser: true
            }, success, fail);
        };

        this.updateUser = function(data, success, fail) {
            this._post("/PP_UPDATE_USER", {
                user_uuid: data.user_uuid,
                user_fullname: data.user_fullname,
                user_email: data.user_email,
                user_icon: data.user_icon
            }, success, fail);
        };

        this.getConversationList = function(data, success, fail) {
            this._post("/PP_GET_USER_CONVERSATION_LIST", $.extend({}, data), success, fail);
        };

        this.getConversation = function(data, success, fail) {
            this.getConversationList(data, success, fail);
        };

        // data : { user_uuid: xxx, app_uuid: xxx, member_list: [ 'xxxxx', 'xxxxx' ], group_uuid: xxx }
        this.createConversation = function(data, success, fail) {
            this._post("/PP_CREATE_CONVERSATION", $.extend( {}, data ), success, fail);
        };

        this.sendMessage = function(data, success, fail) {
            this._post("/PP_SEND_MESSAGE", data, success, fail);
        };

        /*
         * Make user online
         */
        this.online = function(data, success, fail) {
            this._post("/PP_ONLINE", {
                user_uuid: data.user_uuid,
                device_uuid: data.device_uuid
            }, success, fail);
        };

        /*
         * Make user offline
         * Service.API.offline({user_uuid: '6708b117-4664-11e5-9804-0c4de9b21073', device_uuid: '6708b117-4664-11e5-9804-0c4de9b21073'});
         */
        this.offline = function(data, success, fail) {
            this._post("/PP_OFFLINE", {
                user_uuid: data.user_uuid,
                device_uuid: data.device_uuid
            }, success, fail);
        };

        /*
         * Get unacked messages
         */
        this.getUnackedMessages = function(data, success, fail) {
            this._post("/GET_UNACKED_MESSAGES", {
                app_uuid: data.app_uuid,
                from_uuid: data.user_uuid,
                device_uuid: data.device_uuid
            }, success, fail);
        };

        // { list: [ 'xxx', 'xxxx' ] }
        this.ackMessage = function(data, success, fail) {
            this._post("/ACK_MESSAGE", $.extend( {}, data ), success, fail);
        };

        this.createAnonymousUser = function(data, success, fail) {
            this._post("/PP_CREATE_ANONYMOUS", {
                app_uuid: data.app_uuid,
                ppcom_trace_uuid: data.ppcom_trace_uuid
            }, success, fail);
        };

        // {
        //     app_uuid: xxx,
        //     user_uuid: xxx,
        //     device_ostype: xxx,
        //     ppcom_trace_uuid: xxx,
        //     device_id: xxx
        // }
        this.createDevice = function(data, success, fail) {
            this._post("/PP_CREATE_DEVICE", $.extend( true, {}, data ), success, fail);
        };

        //TODO dynamically determine ostype
        //
        // @device_os_type: `Service.$device.getOSType()`;
        this.updateDevice = function(data, success, fail) {
            this._post("/PP_UPDATE_DEVICE", {
                device_uuid: data.device_uuid,
                device_ostype: data.device_ostype
            }, success, fail);
        };

        /*
         * Get user_uuid by the third-web-site's user_email
         */
        this.getUserUuid = function(data, success, fail) {
            this._post("/PP_GET_USER_UUID", {
                user_email: data.user_email,
                user_fullname: data.user_fullname
            }, success, fail);
        };

        this.getUserDetailInfo = function(data, success, fail) {
            this._post("/GET_YVOBJECT_DETAIL", {
                type: 'DU',
                uuid: data.user_uuid
            }, success, fail);
        };

        /**
         * Get message conversation historys
         */
        this.getMessageHistory = function(data, success, fail) {
            this._post("/PP_GET_HISTORY_MESSAGE", {
                conversation_uuid: data.conversation_uuid,
                page_offset: data.page_offset,
                page_size: data.page_size,
                max_id: data.max_id
            }, success, fail);
        };

        /**
         * Get ImappInfo
         */
        this.getAppInfo = function(data, success, fail) {  
            this._post("/PP_GET_APP_INFO", {
                app_uuid: data.app_uuid
            }, success, fail);
        };

        /**
         * Get welcome team
         */
        this.getWelcomeTeam = function(data, success, fail) {
            this._post("/PP_GET_WELCOME_TEAM", {
                language: data.language
            }, success, fail);
        };

        // data: { app_uuid: xxx }
        this.getAppOrgGroupList = function(data, success, fail) {
            this._post('/PP_GET_APP_ORG_GROUP_LIST', $.extend({}, data), success, fail);
        };

        // data: { app_uuid: xxx, group_uuid: xxx }
        this.getOrgGroupUserList = function ( data, success, fail ) {
            this._post( '/PP_GET_ORG_GROUP_USER_LIST', $.extend( {}, data ), success, fail );
        };

        // data: { app_uuid: xxx, group_uuid: xxx }
        this.getOrgGroupConversationId = function ( data, success, fail ) {
            this._post( '/PP_GET_ORG_GROUP_CONVERSATION', $.extend( {}, data ), success, fail );
        };

        // data: { app_uuid: xxx, user_uuid: xxx }
        this.getDefaultConversation = function ( data, success, fail ) {
            this._post( '/PP_GET_DEFAULT_CONVERSATION', $.extend( {}, data ), success, fail );
        };

        // data: { app_uuid: xxx, conversation_uuid: xxx }
        this.getConversationUserList = function ( data, success, fail ) {
            this._post( '/PP_GET_CONVERSATION_USER_LIST', $.extend( {}, data ), success, fail );
        };

        this.getAppUuid = function() {
            return _appUuid;
        };

        this.getApiToken = function() {
            return _apiToken;
        };

    }

    Service.$api = new PPAPI();
    
})(Service));
