$yvUtilService.$inject = ["$rootScope", "$translate", "$http", "$base64", "yvConstants", "yvLog"];
function $yvUtilService($rootScope, $translate, $http, $base64, yvConstants, yvLog) {

    var _is_test_host = function(host) {
        if (host.indexOf("ppmessage.cn") == -1) {
            return true;
        }
        return false;
    },

        // Message util
        messageUtil = (function() {

            return {
                getMessageSummary: function(lang, type, messageBody) {
                    
                    if (!lang || !type || !messageBody) return '';

                    var typeArray = lang;
                    
                    switch (type) {
                    case 'TEXT':
                        return messageBody;

                    case 'FILE':
                        return '[' + typeArray['statistics.historymessages.MESSAGE_FILE_TYPE_TAG'] + '] ' + JSON.parse(messageBody).name;

                    case 'IMAGE':
                        return '[' + typeArray['statistics.historymessages.MESSAGE_IMAGE_TYPE_TAG'] + ']';

                    case 'TXT':
                        return '[' + typeArray['statistics.historymessages.MESSAGE_TXT_TYPE_TAG'] + ']';

                    default:
                        return '';
                    }
                },

                getMessageFormatedDate: function(messageJsonBody) {
                    if (!messageJsonBody) return '';

                    return dateUtil.moment(messageJsonBody.updatetime).format('YYYY-MM-DD HH:mm');
                }
            }
            
        })(),

        // Icon Util
        iconUtil = (function() {

            var DEFAULT = yvConstants.DEFAULT_USER_ICON;

            return {

                // iconUtil.getIcon(); // return `yvConstants.DEFAULT_USER_ICON`
                // iconUtil.getIcon('xxx-xxx-xxx-xxx-xx'); // return '/download/xxx-xxx-xxx-xxx-xx';
                // iconUtil.getIcon('http://abc.com/logo.png'); // return 'http://abc.com/logo.png';
                getIcon : function(icon) {

                    if (!icon) return DEFAULT;

                    var isHttpLink = /(^https?:\/\/)|(^w{3})/.test(icon);
                    return isHttpLink ? icon : fileUtil.getFileDownloadUrl(icon);
                    
                }
                
            }
            
        })(),

        // Date util
        dateUtil = (function() {
            return {
                // `time`: '2015-12-03 11:12:02 123432'
                moment: function(time) {
                    return moment(time, 'YYYY-MM-DD HH:mm:ss SSS');
                }
            }
        })(),

        // File util
        fileUtil = (function() {

            return {
                
                getFileDownloadUrl: function(fid, fname) {
                    var url = '/download/' + fid;
                    fname && (url += "?file_name=" + fname);
                    return url;
                },

                // download large txt content
                getRemoteTextFileContent: function(url, successCallback, errorCallback) {
                    return $http({
                        method: "GET",
                        cache: false,
                        url: url,
                        cache: false,
                    })
                        .success(function(response) {
                            if (successCallback) successCallback(response);
                        })
                        .error(function(error) {
                            if (errorCallback) errorCallback(error);
                        });
                }
            }
            
        })(),

        validator = ( function() {

            var MIN_LENGTH = 1,
                MAX_LENGTH = 16,
                ERR_CODE = {
                    OK: 0, // everything is ok
                    MIN_LENGTH_LIMIT: 1, // password is too short
                    MAX_LENGTH_LIMIT: 2, // password is too long
                    CONTAIN_WHITESPACE_AT_HEAD_OR_TAIL: 3, // password can not contains whitespace at head and tail
                    REPEAT_PASSWORD_MIS_MATCH : 4 // second password miss match the first one
                };
            
            return {

                ERR_CODE: ERR_CODE,

                // @param password : your password
                validatePassword: function( password ) {
                    if ( !password || password.length < MIN_LENGTH ) return ERR_CODE.MIN_LENGTH_LIMIT;
                    if ( password.length > MAX_LENGTH ) return ERR_CODE.MAX_LENGTH_LIMIT;
                    if ( /(^\s+)|(\s+$)/g.test( password ) ) return ERR_CODE.CONTAIN_WHITESPACE_AT_HEAD_OR_TAIL;
                    return ERR_CODE.OK;
                },

                // @param password : your password
                // @param @optional repeatPassword : your repeat password
                validateRepeatPassword: function( password, repeatPassword ) {
                    var errorCode = this.validatePassword( password );
                    if ( errorCode !== ERR_CODE.OK ) return errorCode;
                    if ( password !== repeatPassword ) return ERR_CODE.REPEAT_PASSWORD_MIS_MATCH;
                    return ERR_CODE.OK;
                }
            }
            
        } )();

    return {
        
        translate: function(scope, var_name, langs, on_trans) {
            var _trans = function() {
                $translate(langs).then(function(_t) {
                    scope[var_name] = _t;
                    if (on_trans)
                        on_trans();
                });
            };

            var _remove_trans = $rootScope.$on('$translateChangeSuccess', _trans);
            _trans();

            scope.$on("$destroy", function() {
                _remove_trans();
            });
        },

        noti: function(nstring, success) {
            var _t = "danger";
            if (success) {
                _t = "success";
            }
            
            $.bootstrapGrowl(nstring, {
                ele: 'body', // which element to append to
                type: _t, // (null, 'info', 'danger', 'success')
                offset: {from: 'top', amount: 20}, // 'top', or 'bottom'
                align: 'center', // ('left', 'right', or 'center')
                width: 400, // (integer, or 'auto')
                delay: 4000, // Time while the message will be displayed. It's not equivalent to the *demo* timeOut!
                allow_dismiss: true, // If true then will display a cross to close the popup.
                stackup_spacing: 10 // spacing between consecutively stacked growls.
            });
        },

        uuid: function() {
            var d = new Date().getTime();
            var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x7|0x8)).toString(16);
            });
            return id;
        },

        get_view_port: function() {
            var e = window,
                a = 'inner';
            if (!('innerWidth' in window)) {
                a = 'client';
                e = document.documentElement || document.body;
            }
            
            return {
                width: e[a + 'Width'],
                height: e[a + 'Height']
            };
        },

        is_valid_email: function (email) {
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            return re.test(email);
        },

        base64_decode: function(input) {
            return $base64.decode(input);
        },

        base64_encode: function(input) {
            return $base64.encode(input);
        },
        
        http_protocol: function(host) {
            if(_is_test_host(host)) {
                return "http://";
            }
            return "https://";
        },

        ws_protocol: function(host) {
            if(_is_test_host(host)) {
                return "ws://";
            }
            return "wss://";
        },

        // check if a string contain unregular words
        regexp_check: function(str) {
            var pattern = RegExp("[\\u4E00-\\u9FFF\\dA-z@\-\_\\s*]+","i");
            if( !str || !str.match(pattern)) {
                return false;
            };
            var reg_length = str.match(pattern).toString().length;
            if (reg_length == str.length)
                return true;
            else
                return false;
        },

        formateTimestamp: function(time) {
            var dateString = moment(time).format('YYYY-MM-DD HH:mm:ss');
            return dateString;
        },
        
        // ---------------
        // Message Utils
        // ---------------

        messageUtil: messageUtil,

        // ---------------
        // Icon Utils
        // ---------------

        iconUtil: iconUtil,

        // ---------------
        // Moment Utils
        // ---------------

        dateUtil: dateUtil,

        // ---------------
        // File Utils
        // ---------------
        fileUtil: fileUtil,

        // ---------------
        // Validator Utils
        // ---------------
        validator: validator,

        isNull: function( any ) {
            return any === undefined || any === null;
        }
        
    };
}

angular.module("this_app.services")
    .factory("yvUtil", $yvUtilService);
