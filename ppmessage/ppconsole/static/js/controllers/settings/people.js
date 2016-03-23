angular.module("this_app")
    .controller("ApplicationPeopleCtrl", function($scope, $cookies, $stateParams, $state, $timeout, $translate, yvAjax, yvUtil, yvUser, yvTransTags, yvConstants, yvDebug, yvAppPeopleService, yvLogin) {

        var list = [];

        var app_uuid = null;
        var user_uuid = null;

        $scope.create_user_direct = getInitialCreateUserModalData(); // Store the data that need to create user

        var _note = function(index, tag) {
            $scope.set_flash_style(index);
            $scope.set_update_string($scope.lang[tag]);
        };
        
        var search = function(emails){
            var lastIndex = emails.length - 1;
            var index = null;
            var search_show = $(".modal-body");
            $("#invite_email").keydown(function(event){
                var key = event.keyCode;
                if ($.trim($(this).val()).length == 0) {
                    return;
                };
                if(key == 13){
                    if(emails!==null && index!==null){
                        $timeout(function(){
                            $scope.set_invite_email_value(emails[index]);
                        });
                    }else{
                        $timeout(function(){
                            $scope.set_invite_email_value("");
                            $scope.join_in_directly = true;
                            $scope.send_invite_email = true;
                        });
                    };
                    return;
                }else if(key == 38){
                    if(index === null){
                        index = lastIndex;
                    }else if(index == 0){
                        index = lastIndex;
                    }else{
                        index--;    
                    }
                    search_show.find("li").eq(index).css("font-size", "20px").siblings().css("font-size", "14px");
                }else if(key == 40){
                    if(index == null){
                        index = 0;
                    }else if(index == lastIndex){
                        index = 0;
                    }else{
                        index++;    
                    }
                    search_show.find("li").eq(index).css("font-size", "20px").siblings().css("font-size", "14px");
                }else{
                    search_show.find("li").css("font-size", "14px");
                };
            });
        };

        var send_invite_email = function(){
            var is_email = yvUtil.is_valid_email($scope.invite_email);
            if(!user_uuid || !app_uuid || !$scope.invite_email || !is_email){
                return;
            }
            var _i = yvAjax.ajax_send_invite_email(user_uuid, app_uuid, $scope.invite_email);
            _i.success(function(data) {
                if(data.error_code == 0){
                    jQuery("#invite_user").modal('hide');
                    _note(0, "application.people.SEND_INVITATION_EMAIL_SUCCESSFULLY_TAG");
                }else{
                    jQuery("#invite_user").modal('hide');
                    _note(1, "application.people.SEND_INVITATION_EMAIL_FAILED_TAG");
                    console.error(data);
                    return;
                };
                
            });

            _i.error(function(data) {
                jQuery("#invite_user").modal('hide');
                _note(2, "application.people.SEND_INVITATION_EMAIL_FAILED_TAG");
                console.error(data);
                return;
            });
        };

        $scope.email_handler = function(email) {
            if (email.length <= 22){
                return email;
            }
            return email.substring(0,18) + "..";
        }
        
        $scope.show_invite_modal = function() {
            $scope.join_in_directly = true;
            $scope.send_invite_email = true;
            $scope.invite_email = null;
            $scope.emails = null;
            jQuery("#invite_user").modal({show:true});
            return;
        };
        
        $scope.show_batch_modal = function() {
            jQuery("#batch_create_user").modal( { show:true } );
            $scope.create_user_direct = {}; // clear any data stored before when show `create user modal`
        };
        
        $scope.set_invite_email_value = function(email) {
            $scope.invite_email = email;
            $scope.emails = null;
            $scope.join_in_directly = true;
            $scope.send_invite_email = false;
            $scope.invite_member = create_app_user;
        };
        
        $scope.create_user_directly = function() {

            // Check name is valid
            var name_error = '';
            if ( !$scope.create_user_direct.name ) {
                name_error = "姓名不能为空";
            } else if ( String($scope.create_user_direct.name).length > 20 ) {
                name_error = "长度超过限制";
            } else if ( !yvUtil.regexp_check($scope.create_user_direct.name) ) {
                name_error = "包含非常规字符";
            }
            $scope.create_user_direct.name_error = name_error;
            if ( name_error.length > 0 ) return;

            // Check email is valid
            var email_error = '';
            if (!$scope.create_user_direct.email){
                email_error = "邮箱不能为空";
            } else if (String($scope.create_user_direct.email).length > 32){
                email_error = "长度超过限制";
            } else if (!yvUtil.is_valid_email($scope.create_user_direct.email)){
                email_error = "邮箱无效";
            }
            $scope.create_user_direct.email_error = email_error;
            if ( email_error.length > 0 ) return;

            // Check password valid
            var password_error = '';
            if (!$scope.create_user_direct.password){
                password_error = "密码不能为空";
            } else if (String($scope.create_user_direct.password).length > 16){
                password_error = "长度超过限制";
            } else if (!yvUtil.regexp_check($scope.create_user_direct.password)){
                password_error = "包含非常规字符";
            }
            $scope.create_user_direct.password_error = password_error;
            if ( password_error.length > 0 ) return;

            // Check repeat password valid
            var password_repeat_error = '';
            if ($scope.create_user_direct.password != $scope.create_user_direct.password_repeat){
                password_repeat_error = "密码不一致";
            }
            $scope.create_user_direct.password_repeat_error = password_repeat_error;
            if ( password_repeat_error.length > 0 ) return;

            var user_uuid = yvUser.get_uuid();
            var app_user_info = {
                "user_status": "SERVICE",
                "is_service_user": true,
                "app_uuid": yvUser.get_team().uuid,
                "user_email": $scope.create_user_direct.email,
                "user_fullname": $scope.create_user_direct.name,
                "user_password": sha1( $scope.create_user_direct.password ),
            };

            yvAppPeopleService.createServiceUser( app_user_info, function( data ) {

                var note = "application.people.CREATE_APP_USER_SUCCESSFULLY_TAG",
                    noteIndex = 0;
                
                switch ( data.error_code ) {
                    
                case yvAjax.API_ERR.NO_ERR:
                    break;

                case yvAjax.API_ERR.EX_USER:
                    note = "application.people.ALREADY_IS_APP_USER_TAG"
                    noteIndex = 1;
                    break;

                case yvAppPeopleService.UP_TO_MAX_SERVICE_USERS_ERROR_CODE:
                    note = "application.people.QUOTA_REACH_TO_UPPER_LIMIT_TAG"
                    noteIndex = 1;                    
                    break;

                default:
                    note = "application.people.CREATE_APP_USER_FAILED_TAG";
                    noteIndex = 1;
                    break;
                    
                }

                jQuery( "#batch_create_user" ).modal( 'hide' );
                $scope.page_app_user();
                _note( noteIndex, note );
                
            }, function( data ) {

                jQuery("#batch_create_user").modal('hide');

                $scope.page_app_user();

                _note(2, "application.people.CREATE_APP_USER_FAILED_TAG");
                console.error(data);
                
            } );


        };
        
        $scope.get_invite_email_list = function(invite_email){

            if(!invite_email){
                $scope.emails = null;
                return;
            }

            var _i = yvAjax.ajax_invite_handler($.trim(invite_email));            
            _i.success(function(data) {
                $scope.emails = data.email_list;
                search($scope.emails);
                if (data.error_code == 0) {
                    $scope.join_in_directly = true;
                    $scope.send_invite_email = false;
                    $scope.invite_member = create_app_user;
                } else {
                    $scope.join_in_directly = false;
                    $scope.send_invite_email = true;
                    $scope.invite_member = send_invite_email;
                };
            });

            _i.error(function(data) {
                console.error(data);
                return;
            });

        };

        $scope.should_show_remove_button = function() {
            var list = [];
            angular.forEach($scope.group, function (member) {
                if(member.selected) {
                    this.push(member);
                }
            }, list);
            if (list.length > 0) {
                return true;
            }
            return false;
        };

        $scope.show_remove_modal = function() {
            $scope.to_be_removed_users = [];
            angular.forEach($scope.group, function (member) {
                if(member.selected) {
                    this.push(member);
                }
            }, $scope.to_be_removed_users);
            
            if(!$scope.to_be_removed_users.length){
                return;
            };

            console.log("to_be_removed_users", $scope.to_be_removed_users);
            jQuery("#remove_user").modal({show:true});
            return;
        };

        $scope.checkAll = function () {
            if ($scope.selectedAll) {
                $scope.selectedAll = true;
            } else {
                $scope.selectedAll = false;
            }
            angular.forEach($scope.group, function (member) {
                if(!member.is_owner_user==1) {
                    member.selected = $scope.selectedAll;
                }
            });
        };

        $scope.$watch(function(scope){
            var flag = true;
            angular.forEach(scope.group, function(member) {
                if(member.selected) {
                    flag = false;
                }            
            });
            return flag;
        }, function(newVal, oldVal, scope){
            var flag = true;
            angular.forEach(scope.group, function(member) {
                if(member.selected) {
                    flag = false;
                }
            });
            if(flag)
                scope.selectedAll = false;
        });

        $scope.remove_users = function(to_be_removed_users) {
            if (to_be_removed_users == null || to_be_removed_users.length == 0) {
                return;
            }
            var _uuids = [];
            angular.forEach( to_be_removed_users, function( member ) {
                this.push( member.uuid );
            }, _uuids );

            var _r = yvAjax.leave_app(_uuids, yvUser.get_team().uuid);
            _r.success(function(data) {
                console.log(data);
                if (data.error_code == 0) {
                    jQuery("#remove_user").modal('hide');
                    $scope.selectedAll = false;
                    $scope.page_app_user();
                    _note(0, "application.people.REMOVE_APP_USER_SUCCESSFULLY_TAG");
                } else {
                    jQuery("#remove_user").modal('hide');
                    $scope.selectedAll = false;
                    $scope.page_app_user();
                    _note(1, "application.people.REMOVE_APP_USER_FAILED_TAG");
                    console.error(data);
                    return;
                }
            });
            _r.error(function(data) {
                jQuery("#remove_user").modal('hide');
                $scope.selectedAll = false;
                $scope.page_app_user();
                _note(2, "application.people.REMOVE_APP_USER_FAILED_TAG");
                console.error(data);
                return;
            });
        };

        $scope.page_app_user = function(newPageNumber){
            var search_value = $scope.search_value || "";            
            var page_number = $scope.page_number = newPageNumber || 1;

            $scope.items_per_page = 12;

            yvAppPeopleService.getAppServiceUsersWithPagination( {

                sort: true,
                filter_keyword: $.trim( search_value ),
                start_page: ( page_number - 1 ),
                length: $scope.items_per_page
                
            }, function( response ) {
                
                $scope.group = response.users;
                $scope.total_items = response.total;
                
            }, function( e ) {
                
                $scope.group = [];
                $scope.total_items = 0;
                
            } );

            // var _request = {};
            // _request["app_uuid"] = yvUser.get_team().uuid;
            
            // _request["columns[0][name]"] = "user_fullname";
            // _request["columns[1][name]"] = "user_email";
            // _request["columns[2][name]"] = "user_uuid";
            // _request["columns[3][name]"] = "user_icon";
            // _request["columns[4][name]"] = "is_owner_user";
            
            // _request["order[0][column]"] = 0;
            // _request["order[0][dir]"] = "ASC";
            // _request["search[value]"] = $.trim(search_value);
            // _request["start"] = _request["length"] * (page_number-1);

            // console.log(_request);
            
            // var _p = yvAjax.page_app_user(_request);

            // _p.success(function(data) {
            //     $scope.group = data.data;
            //     $scope.total_items = data.recordsFiltered;
            // });

            // _p.error(function(data) {
            //     console.error(data);
            //     return;
            // });

        }

        var _team = function() {
            var _own_team = yvUser.get_team();
            if (_own_team == null) {
                console.error("no team info");
                return;
            }
            $scope.page_app_user();
        };
        
        var _logined = function() {
            yvLogin.prepare( function( errorCode ) {
                _team();
            }, { $scope: $scope, onRefresh: _team } );
        };
        
        var _translate = function() {
            var _tag_list = [];
            for (var i in yvTransTags.en.application.people) {
                var _t = "application.people." + i;
                _tag_list.push(_t);
            }
            $scope.translate = function() {};
            yvUtil.translate($scope, 'lang', _tag_list, $scope.translate);
        };
        
        var _init = function() {
            $scope.refresh_settings_menu();
            _translate();
            _logined();
        };

        ///////// Initialize ///////////

        _init();

        //////// Internal Implementation ////

        function getInitialCreateUserModalData() {
            return {
                name_error: '',
                email_error: '',
                password_error: '',
                password_repeat_error: ''
            }
        }

        yvDebug.attach( 'yvAppPeopleController', { $scope: $scope } );
        
    }); // end ctrl
