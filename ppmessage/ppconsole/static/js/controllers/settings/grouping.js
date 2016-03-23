angular.module("this_app")
    .controller("GroupingCtrl", function($scope, $state, $stateParams, $timeout, $filter, yvAjax, yvUser, yvTransTags, yvUtil, yvDebug, yvAppGroupingService, yvLogin){
        
        var currentGroup = {};

        $scope.get_all_service = _get_team_service_user_list;
        $scope.groupListFilter = groupListFilter;
        $scope.create_group = createGroup;
        
        $scope.remove_group = removeGroup; //remove the group from the list.
        $scope.isGroupEditable = isGroupEditable;
        
        $scope.switch_group = switchUsersToNewGroup; // switch users to selected group
        $scope.switchGroupListFilter = switchGroupListFilter;
        $scope.checkout_to_group = selectGroup; //checkout to the selected group.

        $scope.modify_group = modifyGroup; // modified the service time and style of group.
        $scope.update_group = updateGroupInfo; // update the group's name or description.
        
        $scope.update_group_error = { // update the group's name user input invalid error hint
            name_error: '',
            desc_error: ''
        };
        $scope.create_group_error = { // create the group's name or desc user input invalid error hint
            name_error: '',
            desc_error: ''
        };

        $scope.team = {
            group_list: [],
            current_list: {
                user_list: [],
                name: null,
                uuid: null,
                type: 'TEAM', //TEAM OR GROUP
            },
            service_user_list: [],
        };
        
        $scope.selectedAll = false;
        $scope.selected_list = []; //the user selected current
        $scope.selected_group = null; //which group we used currently to operated
        $scope.showCheckAllColumn = false;
        
        //show info to user after operation 
        var _note = function(index, tag) {
            $scope.set_flash_style(index);
            $scope.set_update_string($scope.lang[tag]);
        };

        $scope.show_create_group_modal = function() {

            // Clear all cached data before
            $scope.new_group_desc = "";
            $scope.new_group_name = "";
            $scope.create_group_error.name_error = '';
            $scope.create_group_error.desc_error = '';
            
            jQuery("#create_group").modal({show:true});
            return;
        };

        $scope.show_update_group_modal = function( group, index ) {
            // Make a copy of `group` here
            //
            // If we don't make a copy here, then `$scope.selected_group` will pointer to `$scope.team.group_list`,
            // so, if we change `$scope.selected_group`, `$scope.team_group_list` will change at the same time, even if we are not click
            // the `save` button
            $scope.selected_group = angular.copy( group );

            // clear any error generated before
            $scope.update_group_error.name_error = '';
            $scope.update_group_error.desc_error = '';
            
            jQuery("#update_group").modal({show:true});
            return;
        };

        $scope.handle_group_name = function(group_name, len) {
            if(group_name.length>len) {
                return group_name.substring(0,len) + "...";
            };
            return group_name;
        };
        
        $scope.show_identify = function(_email) {
            if(_email == yvUser.get_email()) {
                return '管理员';
            }else {
                return '客服';
            };
        };
        
        // the followed function is used to the checkall button.
        $scope.checkAll = function() {
            var len = $scope.team.current_list.user_list.length;
            $scope.selectedAll?_uncheck_all(len):_check_all(len);
            $scope.selectedAll = !$scope.selectedAll;
        };
        var _check_all = function(len) {
            $scope.selected_list = [];
            for ( var i=0; i < len; i++ ) {
                angular.element( "#current_list_" + String(i) ) [ 0 ].checked = true;
            };
            for(var i=0; i<len; i++) {
                $scope.selected_list.push($scope.team.current_list.user_list[i]);
            };
        };        
        var _uncheck_all = function(len) {
            for(var i=0; i<len; i++) {
                angular.element("#current_list_" + String(i))[0].checked = false;
            };
            $scope.selected_list = [];
        };

        var _begin_watch = function() {
            $scope.$watch('selected_list.length', function(newValue, oldValue) {
                if(newValue !== oldValue) {
                    newValue == $scope.team.current_list.user_list.length
                        ?$scope.selectedAll = true
                        :$scope.selectedAll = false;
                    return;
                }
            });
        };
        
        // the followd functions used to the select or unselect the user.
        // the selected_list will change during these process.
        $scope.select_user = function(index) {
            var target_id = "#current_list_" + String(index);
            angular.element(target_id)[0].checked?_add(index):_remove(index);
            return;
        };
        var _add = function(index) {
            $scope.selected_list.push($scope.team.current_list.user_list[index]);
        };
        var _remove = function(index) {
            var pos = $scope.selected_list.indexOf($scope.team.current_list.user_list[index]);
            $scope.selected_list.splice(pos, 1);
        };

        $scope.get_group_start_service_time = function(time_str) {
            var hour = time_str.split('-')[0].split(':')[0];
            return hour;
        };
        $scope.get_group_end_service_time = function(time_str) {
            var hour = time_str.split('-')[1].split(':')[0];
            return hour;
        };
        
        var _team = function() {
            var _own_team = yvUser.get_team();
            if (_own_team == null) {
                console.error("no team info");
                return;
            }
            _get_init_info();
            _begin_watch();
        };
        
        var _logined = function() {
            yvLogin.prepare( function( errorCode ) {
                _team();
            }, { $scope: $scope, onRefresh: _team } );
        };
        
        var _translate = function() {
            var _tag_list = [];
            for (var i in yvTransTags.en.application.grouping) {
                var _t = "application.grouping." + i;
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

        ////////// Initialize ///////////

        _init();
        
        ////////// Implementation ///////////

        function _get_init_info() {

            _get_group_list( _get_team_service_user_list );
            highlight();
            
        }

        function _get_group_list( successCallback, errorCallback ) {

            yvAppGroupingService.getGroupList( function( groupList ) {
                
                $scope.team.group_list.length = 0;
                angular.forEach( groupList, function( value, key ) {
                    $scope.team.group_list.push( value );
                } );

                successCallback && successCallback( groupList );
                
            }, function( error ) {
                
                yvDebug.w( error );
                errorCallback && errorCallback( {} );
                
            } );

        }

        function refreshGroupList( successCallback, errorCallback ) {
            _get_group_list( successCallback, errorCallback );
        }

        // this used to init the page and get the group list.
        function _get_team_service_user_list() {

            yvAppGroupingService.getTeamServiceUserList( function( users ) {
                
                $scope.team.service_user_list = users;
                $scope.team.current_list = {
                    user_list: users,
                    name: null,
                    uuid: null,
                    type: 'TEAM', //TEAM OR GROUP
                };
                highlight();

                // In team service list, user can not check all
                $scope.showCheckAllColumn = false;
                
            }, function( users ) {
                $scope.team.service_user_list = users;                
            } );

        }

        function _get_group_user_list( group_uuid ) {
            
            $scope.selected_list = [];
            yvAppGroupingService.getGroupServiceUserList( group_uuid, function( users ) {
                $scope.team.current_list.user_list = users;

                // enable check all column , when user in concrete group
                $scope.showCheckAllColumn = true;
                
            }, undefined, { reuse: true } ); // <= Try reuse local cached users

        }

        // create a new group.
        function createGroup() {

            var groupError = checkGroupError( $scope.new_group_name,
                                              $scope.new_group_desc );


            $scope.create_group_error.name_error = groupError.nameError;
            if ( groupError.nameError.length > 0 ) return;

            $scope.create_group_error.desc_error = groupError.descError;
            if ( groupError.descError.length > 0 ) return;

            yvAppGroupingService.createGroup( {
                new_group_name: $scope.new_group_name,
                new_group_desc: $scope.new_group_desc
            }, function( r ) {

                jQuery("#create_group").modal('hide');
                $scope.new_group_name = null;
                _note(0, "application.grouping.CREATE_GROUP_SUCCESS_TAG");

                refreshGroupList();                
                
            }, function( e ) {
                
                _note(2, "application.grouping.ENCOUNTER_AN_ERROR_TAG");
                
            } );

        }

        function removeGroup( group, index ) {

            yvAppGroupingService.removeGroup( group.uuid, function( r ) {
                
                _note(0, "application.grouping.REMOVE_GROUP_SUCCESS_TAG");
                refreshGroupList( _get_team_service_user_list );
                
            }, function( e ) {
                
                _note(2, "application.grouping.ENCOUNTER_AN_ERROR_TAG");
                
            } );
            
        };

        // group list filter, some group should not show in some cases
        // @see `grouping.html`
        function groupListFilter( value, index ) {
            return value.uuid !== yvAppGroupingService.UNGROUPED_GROUP_INFO.uuid;
        }

        function isGroupEditable( groupItem ) {
            return groupItem.uuid !== yvAppGroupingService.UNGROUPED_GROUP_INFO.uuid;
        }

        function switchGroupListFilter( value, index ) {
            return $scope.showCheckAllColumn && value.uuid !== currentGroup.uuid;
        }

        function switchUsersToNewGroup( group, index ) { 
            if ( $scope.selected_list.length == 0 ) {
                _note(1, "application.grouping.NO_GROUP_USER_SELECTED_TAG");
                return;
            };
            
            var _user_list = [];
            for ( var i=0; i < $scope.selected_list.length; i++ ) {
                _user_list.push( $scope.selected_list[i].uuid );
            }

            $scope.selectedAll = false;
            $scope.selected_list = [];
            var len = $scope.team.current_list.user_list.length;
            _uncheck_all(len);

            yvAppGroupingService.switchGroup( {
                group_uuid: group.uuid,
                user_list: _user_list,
                old_group_uuid: currentGroup.uuid
            }, function( r ) {
                
                _note(0, "application.grouping.ADD_GROUP_USER_SUCCESS_TAG");
                $scope.selected_list = [];
                
                refreshGroupList( function() {
                    selectGroup( currentGroup );
                } );
                
            }, function( e ) {
                
                _note(2, "application.grouping.ENCOUNTER_AN_ERROR_TAG");
                
            } );
        };

        function selectGroup( group, index ) {
            
            currentGroup = group;
            if ( yvUtil.isNull( index ) ) {
                index = autoDetectCurrentGroupIndex( group.uuid );
            }
            
            _get_group_user_list( group.uuid );

            // MUST apply `$timeout`, or sometimes will not working well ( i.e, when `switchUsersToNewGroup` )
            $timeout( function() { highlight( "colored_group_" + String( index ) ); } );
            
        }

        function modifyGroup( index ) {
            var _group = $scope.team.group_list[index];

            //check, match one or two digit
            var _pattern = RegExp("^[0-9]{1,2}$");
            if(!_pattern.test(_group.group_visible_order_for_ppcom) || !_pattern.test(_group.start_time) || !_pattern.test(_group.end_time)) {
                _note(1, "application.grouping.MODIFY_INFO_IS_NOT_SUITABLE_TAG");
                _get_group_list();
                return;
            };

            //check if starttime bigger than endtime
            if(_group.end_time>24 || _group.start_time>_group.end_time) {
                _note(1, "application.grouping.MODIFY_INFO_IS_NOT_SUITABLE_TAG");
                _get_group_list();
                return;
            };
            
            var _request = {
                app_uuid: yvUser.get_team().uuid,
                group_uuid: _group.uuid,
                group_visible_order_for_ppcom: _group.group_visible_order_for_ppcom,
                group_route_algorithm: _group.group_route_algorithm,
                group_visible_for_ppcom: _group.checked ? 'True' : 'False',
            };
            yvAjax.update_group(_request)
                .success(function(data) {
                    //NO ORG GROUP
                    //NO PARA
                    //SUCCESS
                    $scope.team.group_list[index].visible_for_ppcom = _request.group_visible_for_ppcom;
                    if(data.error_code == 0) {
                        _note(0, "application.grouping.UPDATE_GROUP_SUCCESS_TAG");
                    } else {
                        console.log(data);
                        _note(1, "application.grouping.ENCOUNTER_AN_ERROR_TAG");
                    };
                })
                .error(function(data) {
                    console.log(data);
                    _note(2, "application.grouping.ENCOUNTER_AN_ERROR_TAG");
                });
        }

        function updateGroupInfo() {

            var groupError = checkGroupError( $scope.selected_group.group_name,
                                              $scope.selected_group.group_desc,
                                              $scope.selected_group.uuid );

            $scope.update_group_error.name_error = groupError.nameError;
            if ( groupError.nameError.length > 0 ) return;

            $scope.update_group_error.desc_error = groupError.descError;
            if ( groupError.descError.length > 0 ) return;

            //update group info
            yvAppGroupingService.updateGroup( {
                app_uuid: yvUser.get_team().uuid,
                group_uuid: $scope.selected_group.uuid,
                group_name: $scope.selected_group.group_name,
                group_desc: $scope.selected_group.group_desc,
            }, function( data ) {
                jQuery( "#update_group" ).modal( 'hide' );
                if ( data.error_code == 0 ) {
                    _note( 0, "application.grouping.UPDATE_GROUP_SUCCESS_TAG" );
                    
                    refreshGroupList( function() {
                        selectGroup( currentGroup );
                    } );
                    
                } else {
                    _note( 1, "application.grouping.ENCOUNTER_AN_ERROR_TAG" );
                };
            }, function( e ) {
                _note( 2, "application.grouping.ENCOUNTER_AN_ERROR_TAG" );
            } );
        }

        //highlight to show which group selected currently
        function highlight( _id ) {
            _id = yvUtil.isNull( _id ) ? 'default_highlight' : _id;
            
            //remove border highlight first
            var _e = angular.element(".not_exist");
            for (var i=0; i<_e.length; i++) {
                angular.element(_e[i]).css('border-bottom', '1px solid #d9d9d9');
                angular.element("#default_highlight").css('border-bottom', '1px solid #d9d9d9');
            }
            angular.element("#" + _id).css('border-bottom', '3px solid red');
        }

        function autoDetectCurrentGroupIndex( groupId ) {
            
            // MUST sort `group_list` before find index to keep the same order
            // @see `html/application/grouping.html` Template Binding
            var copied = $filter('orderBy')( $scope.team.group_list, 'createtime' ),
                i;
            
            angular.forEach( copied, function( value, index ) {
                if ( i === undefined && value.uuid === groupId ) i = index;
            } );
            return i;
            
        }

        //
        // @param groupName
        // @param groupDesc
        // @param @optional groupId : used for check is `groupName` exist
        //
        function checkGroupError( groupName, groupDesc, groupId ) {

            // kee the same order as `yvAppGroupingService.ERROR`
            var nameErrorMapping = [

                '',
                $scope.lang["application.grouping.GROUP_NAME_EXISTED_TAG"],
                $scope.lang["application.grouping.NO_GROUP_NAME"], // 2
                $scope.lang["application.grouping.UNREGULAR_WORDS_TAG"],
                $scope.lang["application.grouping.WORDS_OUT_OF_LENGTH_TAG"]
                
            ],
                descErrorMapping = ( function( mapping ) {

                    var copied = angular.copy( mapping );
                    // replace default `ERROR.EMPTY` error hint
                    copied [ 2 ] = $scope.lang["application.grouping.NO_GROUP_DESC"];
                    return copied;
                    
                } )( nameErrorMapping ),
                
                nameError = nameErrorMapping [ yvAppGroupingService.checkGroupNameValid( groupId, groupName ) ],

                descError = descErrorMapping [ yvAppGroupingService.checkGroupDescValid( groupDesc ) ];

            return {
                nameError: nameError,
                descError: descError
            }
            
        }

        //////////// HELP US TO DEBUG FROM CONSOLE ///////////////////////////
        yvDebug
            .attach( 'yvAppGroupingService', yvAppGroupingService )
            .attach( 'yvAppGroupingController', {
                
                $scope: $scope,
                
                highlight: highlight,

                curGroup: function() { return currentGroup; },
                autoDetectCurrentGroupIndex: autoDetectCurrentGroupIndex,
                checkGroupError: checkGroupError
                
            } );
        
    });
