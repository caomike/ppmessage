//// this is data service for `GroupingCtrl` ///////
(function() {

    yvAppGroupingService.$inject = [ 'yvLog', 'yvAjax', 'yvUser', 'yvUtil', 'yvCallbackService', 'yvAppPeopleService' ];
    function yvAppGroupingService( yvLog, yvAjax, yvUser, yvUtil, yvCallbackService, yvAppPeopleService ) {

        var UNGROUPED_GROUP_INFO = { uuid: 'group_uuid_no_group', group_name: '未分组' },
            jQuery = $,

            groups = {
                
                // 'group-id-1': { group_info }
                // `UNGROUPED_GROUP_INFO.uuid`: { group_info }
                // ...
                //

                // { group_info } :
                // {
                //     uuid: group_uuid,
                //     group_name: xxx,
                //     group_users: [ user_a, user_b, ... ]
                // }
                
            },

            ERROR = {
                OK: 0, // no error
                EXIST: 1, // group name exist
                EMPTY: 2, // empty
                ILLEGAL_NAME: 3, // contains some special characters
                TOO_LONG: 4 // too long > 64
            },

            LENGTH_MAX_LIMIT = 64;

        //////// API /////////////
        return {
            UNGROUPED_GROUP_INFO: UNGROUPED_GROUP_INFO,
            ERROR: ERROR,

            all: all,

            createGroup: createGroup,
            removeGroup: removeGroup,
            switchGroup: switchGroup,
            updateGroup: updateGroup,
            
            getGroupList: getGroupList,
            getTeamServiceUserList: getTeamServiceUserList,
            getGroupServiceUserList: getGroupServiceUserList,

            checkGroupNameValid: checkGroupNameValid,
            checkGroupDescValid: checkGroupDescValid
        }

        ///// Implementation //////

        ///// getGroupList //////
        function all() {
            return groups;
        }

        function createGroup( settings, successCallback, errorCallback ) {
            
            yvAjax.create_org_group( {
                app_uuid: yvUser.get_team().uuid,
                group_name: settings.new_group_name,
                group_desc: settings.new_group_desc,
            } )
                .success( function(data) { noError( data ) ? onSuccess( data ) : onError( data ); } )
                .error( onError );

            function onSuccess( r ) {
                successCallback && successCallback();
            }

            function onError( e ) {
                errorCallback && errorCallback();
            }
            
        }

        function removeGroup( groupId, successCallback, errorCallback ) {

            var groupUsers = ( function( users ) {

                var usersIdArray = [];
                angular.forEach( users, function( value, index ) {
                    usersIdArray.push( value.uuid );
                } );
                return usersIdArray;
                
            } )( groups [ groupId ].user_list || [] );
            
            // 1. remove all group users in this group
            // 2. remove this group            
            yvAjax.remove_group_user( {
                app_uuid: yvUser.get_team().uuid,
                group_uuid: groupId,
                user_list: groupUsers,
            })
                .success( function( r ) {
	                noError( r ) ? internalRemoveGroup( groupId, onSuccess, onError ) : onError( r );                    
                } )
                .error( onError );

            function internalRemoveGroup( groupId, successCallback, errorCallback ) {

                yvAjax.remove_group( {
                    app_uuid: yvUser.get_team().uuid,
                    group_uuid: groupId
                } )
                    .success( function( r ) {
                        noError( r ) ? onSuccess( r ) : onError( e );
                    } )
                    .error( onError );

                function onSuccess( r ) {
                    successCallback && successCallback( r );
                }

                function onError( e ) {
                    errorCallback && errorCallback( e );
                }
                
            }

            function onSuccess( r ) {
                successCallback && successCallback( r );
            }

            function onError( e ) {
                errorCallback && errorCallback( e );
            }
            
        }

        // @param {
        //     group_uuid: `target group`
        //     old_group_uuid: `origin group`
        //     user_list: `user ids array that you want to move`
        // }
        function switchGroup( settings, successCallback, errorCallback ) {

            if ( settings.group_uuid === UNGROUPED_GROUP_INFO.uuid ) { // Move user from concrete group => ungrouped group
                removeGroupUser( { group_uuid: settings.old_group_uuid, user_list: settings.user_list }, onSuccess, errorCallback );
            } else { // Move user from concrete group 1 ( or ungrouped group ) => concrete group 2
                addGroupUser( settings, onSuccess, errorCallback );
            }

            function onSuccess( r ) {
                removeUsersFromGroup( settings.old_group_uuid, settings.user_list ); // remove old users from old group, update local cache
                yvCallbackService.success( r, successCallback );
            }

        }

        function addGroupUser( settings, successCallback, errorCallback ) {
            
            yvAjax.add_group_user( {
                app_uuid: yvUser.get_team().uuid,
                group_uuid: settings.group_uuid,
                user_list: settings.user_list
            } )
                .success( function( data ) {
                    yvCallbackService.response( data, successCallback , errorCallback );
                } )
                .error( function( e ) {
                    yvCallbackService.error( e, errorCallback )
                } );
        }

        function removeGroupUser( settings, successCallback, errorCallback ) {

            yvAjax.remove_group_user( {
                app_uuid: yvUser.get_team().uuid,
                group_uuid: settings.group_uuid,
                user_list: settings.user_list
            } )
                .success( function( data ) {
                    yvCallbackService.response( data, successCallback , errorCallback );
                } )
                .error( function( e ) {
                    yvCallbackService.error( e, errorCallback )
                } );
            
        }

        function updateGroup( settings, successCallback, errorCallback ) {
            yvAjax.update_group( settings )
                .success( function( data ) {
                    yvCallbackService.response( data, successCallback, errorCallback );
                } )
                .error( function( e ) {
                    yvCallbackService.error( e, errorCallback )
                } );
        }
        
        function getGroupList( successCallback, errorCallback ) {

            groups = {}; // clear all cached group's info

            // 1. get group list
            yvAjax.get_group_list( { app_uuid: yvUser.get_team().uuid } )
                .success( function( data ) {

                    if ( noError( data ) ) {
                        onSuccessGetGroupList( data );
                    } else {
                        onErrorGetGroupList( data );
                    }

                })
                .error( onErrorGetGroupList );

            function onSuccessGetGroupList( data ) {
                
                var groupLists = data.list.sort( compare ) || [];
                angular.forEach( groupLists, function( value, index ) {
                    
                    var workTimes = workTime( value );
                    
                    value.start_time = workTimes.start_time;
                    value.end_time = workTimes.end_time;
                    
                    // store group info to local
                    groups [ value.uuid ] = value;
                    
                } );
                
                // 2. get all users
                getTeamServiceUserList( function( users ) {
                    successCallback && successCallback( groups );
                    
                }, function( error ) {

                    onErrorGetGroupList( error );
                    
                } );

            }

            function onErrorGetGroupList( data ) {
                errorCallback && errorCallback( {} );
            }

            function workTime( item ) {
                var serviceTime = item.group_work_time_str;
                return {
                    start_time: serviceTime.split( '-' )[ 0 ].split( ':' )[0],
                    end_time: serviceTime.split( '-' )[ 1 ].split( ':' )[0]
                };
            }
        }

        //// getTeamServiceUserList /////
        function getTeamServiceUserList( successCallback, errorCallback ) {
            
            yvAppPeopleService.getAppServiceUsers( function( users ) {
                
                fixUsers( users );
                updateGroupUsers( users );
                yvCallbackService.success( users, successCallback );
                
            } , errorCallback );
            
        }

        ////// getGroupServiceUserList //////
        // @param grouId : xxx or `UNGROUPED_GROUP_INFO.uuid`
        // @param options : {
        //     reuse: true/false, whether or not reuse users when find in local, default is false
        // }
        function getGroupServiceUserList( groupId, successCallback, errorCallback, options ) {

            var o = angular.extend( { reuse: false } , options );

            // local cached
            if ( groups[ groupId ] !== undefined && groups[ groupId ].user_list !== undefined ) {
                if ( o.reuse ) {
                    successCallback && successCallback( groups[ groupId ].user_list );
                    return;
                }
            }

            // fetched users from server
            if ( groupId === UNGROUPED_GROUP_INFO.uuid ) {
                getUnGroupedServiceUserList();
            } else {
                getGroupedServiceUserList();            
            }

            function getUnGroupedServiceUserList() {
                getTeamServiceUserList( function( users ) {

                    var unGroupedUsers = [];
                    angular.forEach( users, function( value, index ) {
                        value.group_uuid === UNGROUPED_GROUP_INFO.uuid && unGroupedUsers.push( value );
                    } );

                    successCallback && successCallback( unGroupedUsers );
                    
                }, function ( e ) {
                    errorCallback && errorCallback( [] );
                } );
            }

            function getGroupedServiceUserList() {
                
                yvAjax.get_group_user_list( { app_uuid: yvUser.get_team().uuid, group_uuid: groupId } )
                    .success( function( r ) {
                        noError( r ) ?
                            successCallback && successCallback( fixUsers( r.list ) ) :
                            errorCallback && errorCallback( [] );
                    })
                    .error(function( e ) {
                        errorCallback && errorCallback( [] );
                    });
                
            }
            
        }

        /////// Tools /////////
        
        // is response has error
        function noError( r ) {
            return r && r.error_code === 0;
        }

        function compare( a, b ) {
            return a.updatetime < b.updatetime ? -1 : 1;
        }

        function fixUsers( users ) {

            angular.forEach( users, function( value, key ) {

                if ( yvUtil.isNull( value.group ) ) { // user belongs to `UNGROUPED` group
                    value.group_uuid = UNGROUPED_GROUP_INFO.uuid;
                    value.user_group_name = UNGROUPED_GROUP_INFO.group_name;
                } else {
                    value.group_uuid = value.group.uuid;
                    value.user_group_name = value.group.group_name;
                }
                
            } );
            
            return users;
        }

        function exist( array, user ) {
            var find = false;
            $.each( array, function( index, item ) {
                if ( !find && user.uuid === item.uuid ) {
                    find = true;
                }
            } );
            return find;
        }

        function updateGroupUsers( users ) {
            
            angular.forEach( users, function( value, index ) {

                // make sure ungrouped group exist
                if ( value.group_uuid === UNGROUPED_GROUP_INFO.uuid &&
                     groups [ UNGROUPED_GROUP_INFO.uuid ] === undefined) {
                    groups [ UNGROUPED_GROUP_INFO.uuid ] = UNGROUPED_GROUP_INFO;
                }

                // make sure user_list is initialized
                if ( groups [ value.group_uuid ].user_list === undefined ) {
                    groups [ value.group_uuid ].user_list = [];
                }

                // store users
                if ( !exist( groups [ value.group_uuid ].user_list, value ) ) {
                    groups [ value.group_uuid ].user_list.push( value );
                }
                
            } );
            
        }

        function removeUsersFromGroup( groupId, userIdsArray ) {
            
            var oldUserList = groups [ groupId ].user_list || [];
            angular.forEach( oldUserList, function( value, index ) {
                var i = -1;
                if ( ( i = jQuery.find( value.uuid, userIdsArray ) ) !== -1 ) {
                    oldUserList.splice( i, 1 );
                }
            } );
            
        }

        // Check group name or group description is valid when modify or create new group
        // @return errorCode
        // @see ERROR
        function checkGroupNameValid( groupId, groupName ) {
            
            var errorCode = ERROR.OK;
            if ( checkExist( groupId, groupName ) ) {
                errorCode = ERROR.EXIST;
            } else {
                errorCode = checkValid( groupName );
            }
            return errorCode;
        }

        // @return errorCode
        function checkGroupDescValid( groupDesc ) {
            return checkValid( groupDesc );
        }

        // @return is `groupName` exist in `groupList`
        function checkExist( groupId, groupName ) {
            var exist = false;
            angular.forEach( groups, function( value, key ) {
                if ( exist === false &&
                     value.group_name === groupName ) {

                    if ( ( !yvUtil.isNull( groupId ) && groupId !== value.uuid ) || // provided `groupId`, so we need make sure not the same group
                         yvUtil.isNull( groupId ) ) { // not provided `groupId`, so if we find, we consider `groupName` is exist
                        exist = true;   
                    }
                    
                }
            } );
            return exist;
        }

        // @return errorCode
        function checkValid( name ) {
            var errorCode = ERROR.OK;

            if ( yvUtil.isNull( name ) || name.length <= 0 ) {
                errorCode = ERROR.EMPTY;
            } else if ( !yvUtil.regexp_check( name ) ) {
                errorCode = ERROR.ILLEGAL_NAME;
            } else if ( name.length > LENGTH_MAX_LIMIT ) {
                errorCode = ERROR.TOO_LONG;
            }

            return errorCode;
            
        }
        
    }

    angular.module("this_app.services").factory("yvAppGroupingService", yvAppGroupingService);

} )();
