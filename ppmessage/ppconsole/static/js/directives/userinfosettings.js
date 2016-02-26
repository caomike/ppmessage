angular.module("this_app")
    .directive("yvUserinfosettings", function($compile, $parse, $timeout, $http, yvConstants) {
        return {
            restrict: "E",
            replace: "true",
            
            templateUrl: yvConstants.PORTAL_STATIC_PREFIX + "html/directive/userinfosettings.html",

            scope: {
            },

            link: function($scope, $element, $attrs) {
           
            },
            
            controller: function($scope, $rootScope) {

                // if you wanna use the directive:
                // broadcast an event named show_userinfo_modal,
                // and give the user uuid.    
                var _ajax_request = function(_method, _url, _data) {
                    return $http({
                        method: _method,
                        cache: false,
                        url: _url,
                        data: !_data ? {} : _data,
                    });
                },    

                // not finished yet.
                get_user_info = function(data) {
                    return _ajax_request("POST", "", data);
                },

                // success callback of get_user_info.
                getUserInfoSuccessCB = function(response) {
                    var info_data = response.data;
                    
                    $timeout(function() {
                        $scope.userinfo = {
                            name     : info_data.username,
                            tel      : info_data.usertel,
                            qq       : info_data.userqq,
                            other    : info_data.other,
                        };
                    });
                },

                // error callback of get_user_info
                getUserInfoErrorCB = function(data) {
                    alert('获取用户信息失败');
                },

                // not finished yet.
                set_user_info = function(data) {
                    return _ajax_request("POST", "", data);
                },

                // success callback of set_user_info.                
                setUserInfoSuccessCB = function(response) {
                    alert('保存成功!');
                    closemodal();
                },

                // error callback of set_user_info.                
                setUserInfoErrorCB = function(data) {
                    alert('保存失败，请稍后重试');
                };

                // reset each field of form.
                resetForm = function() {
                    for(i in $scope.userinfo) $scope.userinfo='';
                },

                // close the modal.
                closemodal = function() {
                    $timeout(function() {
                        jQuery('#set-user-info').modal('hide');                                                                
                    });
                },
               
                $scope.sub_user_info = function() {
                    var data = {
                        uuid    : $scope.uuid,
                        username: $scope.userinfo.name,
                        usertel : $scope.userinfo.tel,
                        userqq  : $scope.userinfo.qq,
                        other   : $scope.userinfo.other,
                    };

                    set_user_info(data)
                        .success(setUserInfoSuccessCB)
                        .error(setUserInfoErrorCB);
                };

                // recieve the event to show the modal.
                $scope.$on('show_userinfo_modal', function(event, uuid) {
                    
                    $timeout(function() {
                        jQuery('#set-user-info').modal('show');                                        
                        resetForm();
                    });

                    get_user_info({
                        user_uuid: $scope.uuid
                    }).success(getUserInfoSuccessCB)
                      .error(getUserInfoErrorCB);  

                });
            },

        };
        
    });
