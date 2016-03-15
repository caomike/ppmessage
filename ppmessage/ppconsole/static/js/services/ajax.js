$yvAjaxService.$inject = ["$state", "$timeout", "$http", "$cookies", "yvUser", "yvConstants", "yvUtil", "yvLog"];
function $yvAjaxService($state, $timeout, $http, $cookieStore, yvUser, yvConstants, yvUtil, yvLog) {

    var _admin = {
        session_uuid: null,
        uuid: null,
        name: null,
        fullname: null,
        icon: null,
    };

    var _post_auth = function(_data) {
        var _auth_url = "/ppauth/token";
        var _auth_data = "grant_type=password&user_email=" + _data.user_email
            + "&user_password=" + _data.user_password
            + "&client_id=" + yvConstants.PPCONSOLE_API.key;
        var _auth_config = {};
        
        _auth_config.url = _auth_url;
        _auth_config.method = "POST";
        _auth_config.data = _auth_data;
        _auth_config.headers = {
            "Content-Type": "application/x-www-form-urlencoded",
        };
        yvLog.d("AUTH POST url: %s, data: %o.", _auth_config.url, _auth_config.data);
        return $http(_auth_config);
    };
    
    var _apiPost = function(_url, _data) {
        _data = _data || {};

        var apiUrl = '/api' + _url;
        var accessToken = $cookieStore.get("cookie_ppconsole_{WEB_ROLE}_access_token");
        accessToken = accessToken.replace(/\"/g, "");
    
        yvLog.d(accessToken);
        return $http({
            headers: {
                "Content-Type": "application/json;charset=utf-8",
                "Authorization": "OAuth " + accessToken,
            },
            method: 'POST',
            cache: false,
            url: apiUrl,
            data: _data
        });
    };

    // default state for unlogined page
    var _check_logined = function(that, logined, unlogined, state) {
        var _user_uuid = $cookieStore.get("cookie_ppconsole_{WEB_ROLE}_user_uuid");
        if (!_user_uuid) {
            if (unlogined) {
                unlogined();
                return
            }
            if (state) {
                $timeout(function() {
                    $state.go(state);
                });
            }
            return;
        }

        _user_uuid = _user_uuid.replace(/\"/g, "");
        var _loggedin = that.get_{WEB_ROLE}_detail_with_password(_user_uuid);

        var _error = function() {
            $timeout(function() {
                yvUser.set_logined(false);
                if (unlogined) {
                    unlogined();
                } else {
                    if (state) {
                        $timeout(function() {
                            $state.go(state);
                        });
                    }
                }
            });
        };
        
        _loggedin.success(function(data) {
            if (data.error_code == 0) {
                $timeout(function() {
                    yvUser.set_login_data(data);
                    if (logined) {
                        logined();
                    }
                });
            } else {
                _error();
            }
            return;
        });

        _loggedin.error(function(data) {
            _error();
        });

    };

    // @see mdm/mdm/api/error.py API_ERR
    var API_ERR = {
        NO_ERR: 0,
        NO_PARA: 6,
        EX_USER: 22
    };

    return {
        login: function(user) {
            return _post_auth(user);
        },

        check_logined: function(logined, unlogined, state) {
            return _check_logined(this, logined, unlogined, state);
        },

        ppconsole_get_overview_number : function(app_uuid) {
            return _apiPost("/PPCONSOLE_GET_OVERVIEW_NUMBER", {app_uuid: app_uuid});
        },

        ppconsole_get_real_time_customer_number : function(app_uuid) {
            return _apiPost("/PPCONSOLE_GET_REAL_TIME_CUSTOMER_NUMBER", {app_uuid: app_uuid});
        },

        ppconsole_get_real_time_service_number : function(app_uuid) {
            return _apiPost("/PPCONSOLE_GET_REAL_TIME_SERVICE_NUMBER", {app_uuid: app_uuid});
        },

        ppconsole_get_real_time_message_number : function(app_uuid) {
            return _apiPost("/PPCONSOLE_GET_REAL_TIME_MESSAGE_NUMBER", {app_uuid: app_uuid});
        },

        ppconsole_get_service_number_by_range : function(app_uuid, begin, end) {
            return _apiPost("/PPCONSOLE_GET_SERVICE_NUMBER_BY_RANGE", {app_uuid: app_uuid, begin_date: begin, end_date: end});
        },

        ppconsole_get_customer_number_by_range : function(app_uuid, begin, end) {
            return _apiPost("/PPCONSOLE_GET_CUSTOMER_NUMBER_BY_RANGE", {app_uuid: app_uuid, begin_date: begin, end_date: end});
        },

        ppconsole_get_message_number_by_range : function(app_uuid, begin, end) {
            return _apiPost("/PPCONSOLE_GET_MESSAGE_NUMBER_BY_RANGE", {app_uuid: app_uuid, begin_date: begin, end_date: end});
        },

        logout: function(user_uuid) {
            return _apiPost("/PPCONSOLE_LOGOUT", {user_uuid: user_uuid});
        },

        get_user_detail: function(user_uuid) {
            return _apiPost("/PP_GET_USER_DETAIL", {user_uuid: user_uuid});
        },

        get_user_detail_with_password: function(user_uuid) {
            return _apiPost("/PP_GET_USER_DETAIL", {user_uuid: user_uuid, return_password: true});
        },

        get_admin_detail: function(user_uuid) {
            return _apiPost("/PP_GET_ADMIN_DETAIL", {user_uuid: user_uuid});
        },

        get_admin_detail_with_password: function(user_uuid) {
            return _apiPost("/PP_GET_ADMIN_DETAIL", {user_uuid: user_uuid, return_password: true});
        },

        create_app: function(user_uuid, app_name) {
            return _apiPost("/PP_CREATE_APP", {user_uuid: user_uuid, app_name: app_name});
        },

        remove_app: function(user_uuid, app_uuid, app_key) {
            return _apiPost("/PP_REMOVE_APP", {user_uuid: user_uuid, app_uuid: app_uuid, app_key: app_key});
        },

        leave_app: function(user_list, app_uuid) {
            return _apiPost("/PP_LEAVE_APP", {user_list: user_list, app_uuid: app_uuid});
        },

        is_email_valid: function(email) {
            return _apiPost("/PP_IS_EMAIL_VALID", {user_email: email});
        },

        get_app_owned_by_user: function(user_uuid) {
            return _apiPost('/PP_GET_APP_OWNED_BY_USER', {user_uuid: user_uuid});
        },
        
        update_app_info: function(requestParams) {
            return _apiPost('/PP_UPDATE_APP_INFO', requestParams);
        },

        create_user: function(requestParams) {
            return _apiPost("/PP_CREATE_USER", requestParams);
        },

        update_user: function(requestParams) {
            return _apiPost('/PP_UPDATE_USER', requestParams);
        },

        remove_user: function(user_uuid) {
            return _apiPost("/PP_REMOVE_USER", {user_uuid: user_uuid});
        },

        // requestParams: {app_uuid: xxxxx}
        get_app_conversation_list: function(requestParams) {
            return _apiPost('/PP_GET_APP_CONVERSATION_LIST', requestParams);
        },

        // get single conversation's history messages
        get_history_messages: function(requestParams) {
            return _apiPost('/PP_GET_HISTORY_MESSAGE', requestParams);
        },

        //create group
        create_org_group: function(requestParams) {
            return _apiPost('/PP_CREATE_ORG_GROUP', requestParams);
        },

        get_group_list: function(requestParams) {
            return _apiPost('/PP_GET_APP_ORG_GROUP_LIST', requestParams);
        },

        get_group_detail: function(requestParams) {
            return _apiPost('/PP_GET_ORG_GROUP_DETAIL', requestParams);
        },

        get_group_user_list: function(requestParams) {
            return _apiPost('/PP_GET_ORG_GROUP_USER_LIST', requestParams);
        },

        update_group: function(requestParams) {
            return _apiPost('/PP_UPDATE_ORG_GROUP', requestParams);
        },

        // if "app_uuid" not in _body or "group_uuid" not in _body or "user_list" not in _body:
        remove_group: function(requestParams) {
            return _apiPost('/PP_REMOVE_ORG_GROUP', requestParams);
        },

        add_group_user: function(requestParams) {
            return _apiPost('/PP_ADD_ORG_GROUP_USER', requestParams);
        },

        remove_group_user: function(requestParams) {
            return _apiPost('/PP_REMOVE_ORG_GROUP_USER', requestParams);
        },

        get_no_group_user_list: function(requestParams) {
            return _apiPost('/PP_GET_NO_GROUP_USER_LIST', requestParams);
        },

        get_team_service_user_list: function(requestParams) {
            return _apiPost('/PP_GET_APP_SERVICE_USER_LIST', requestParams);
        },

        get_api_info: function(requestParams) {
            return _apiPost('/PP_GET_API_INFO', requestParams);
        },

        ///////////// API_ERR_CODE ////////////////
        API_ERR: API_ERR
        
    };
} // end $yvAjaxService

angular.module("this_app.services").factory("yvAjax", $yvAjaxService);
