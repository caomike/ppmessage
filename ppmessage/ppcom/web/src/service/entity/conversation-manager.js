//
// @documentation
//     every conversation has several filed named `type`, `token`, `ts`
//
//     `type`:
//     - `TYPE.GROUP`
//     - `TYPE.CONVERSATION`
//
//     `token`: as the conversation's unique identifier:
//     - `TYPE.GROUP`: `token` === `group_uuid`
//     - `TYPE.CONVERSATION`: `token` === `conversation_uuid`
//
//     `ts`: used for sort conversations
//
//     every conversation which `type` is `TYPE.CONVERSATION` has several filed named `active`, `vip`
//
//     `active`: there is only ONE `active` conversation at the same time:
//     - true ( means this conversation is the user begin to chat or chatting with now )
//     - false
//
//     `vip`: means this conversation is the default conversation that will show on the welcome hovercard
//     - true
//     - false
//
Service.$conversationManager = ( function() {

    var TYPE = { GROUP: 'GROUP', CONVERSATION: 'CONVERSATION' },
        WEIGHT_GROUP = 10000, // let `TYPE.GROUP` has more priority then `TYPE.CONVERSATION` when sort `conversationList`
        conversationList = [],
        activeToken,
        hasLoadedAllGroupListAndConversationList = false;

    ////////// API ///////////
    return {
        TYPE: TYPE,

        all: all, // ONLY for debug, you should't call this method, instead of call `asyncGetList` to assure fully correct
        
        asyncGetDefaultConversation: asyncGetDefaultConversation,
        activeConversation: activeConversation, // acts as setter and getter
        vipConversation: findDefault,
        asyncGetList: asyncGetList,
        find: findByToken,

        asyncGetConversation: asyncGetConversation
    }

    ///////// all //////////////
    function all() {
        return sort( conversationList );
    }

    //////// asyncGetDefaultConversation /////////////
    function asyncGetDefaultConversation( callback ) {

        if ( findDefault() ) {
            $onResult( findDefault(), callback );
            return;
        }

        Service.$api.getDefaultConversation( {
            app_uuid: Service.$ppSettings.getAppUuid(),
            user_uuid: Service.$user.getUser().getInfo().user_uuid
        } , function ( response ) {

            if ( response && response.error_code === 0 ) {
                
                push( conversation( response, true ) );

                active( response[ 'token' ] );
            }

            $onResult( findDefault(), callback );
            
        } , function ( error ) {

            $onResult( findDefault(), callback );
            
        } );
    }

    //////// activeConversation ///////////
    function activeConversation( token ) {

        // act as a getter method
        if ( token === undefined ) {
            if ( activeToken !== undefined ) {
                return findByToken( activeToken );
            }

            return undefined;    
        } else { // act as a setter method
            active( token );
        }
        
    }

    /////// asyncGetList //////////////
    function asyncGetList( callback ) {

        if ( hasLoadedAllGroupListAndConversationList ) {
            $onResult( sort( conversationList ), callback );
            return;
        }
        
        // 1. asyncGetOrgGroups
        Service.$orgGroups.asyncGetAppOrgGroupList( function( groupList ) {

            var list = ( groupList || [] ).slice();
            list && $.each( list, function( index, item ) {
                item.user_count > 0 && push( group( item ) ); // make sure `group.user_count` > 0
            } );

            // 2. asyncGetAllConversations
            Service.$api.getConversationList( {
                user_uuid: Service.$user.getUser().getInfo().user_uuid,
                app_uuid: Service.$ppSettings.getAppUuid()
            }, function ( response ) {

                if ( response && response.error_code === 0 ) {
                    var list = ( response.list || [] ).slice();
                    list && $.each( list, function( index, item ) {
                        push( conversation( item ) );
                    } );
                }

                // 3. success callback
                hasLoadedAllGroupListAndConversationList = true;
                $onResult( sort( conversationList ), callback );
                return;
                
            }, function ( error ) {

                // 3. error callback
                hasLoadedAllGroupListAndConversationList = true;
                $onResult( sort( conversationList ), callback );
                return;
                
            } );
            
        } );
    }

    ///////// asyncGetConversation ///////
    
    // @param config {
    //     user_uuid: xxx, create a conversation with `member_list`
    //     group_uuid: xxx : create a `group` conversation
    // }
    // provided `user_uuid` OR `group_uuid`, don't provide both
    function asyncGetConversation( config, callback ) {
        if ( config.user_uuid !== undefined && config.group_uuid !== undefined ) throw new Error();

        var exist = ( config.user_uuid !== undefined ) ? find( config.user_uuid ) : // find by user_uuid
            ( config.group_uuid != undefined ) ? findByGroupId( config.group_uuid ) : undefined; // find by group_uuid

        if ( !Service.$tools.isNull( exist ) ) {
            $onResult( exist, callback );
            return;
        }

        Service.$api.createConversation( {
            user_uuid: Service.$user.getUser().getInfo().user_uuid,
            app_uuid: Service.$ppSettings.getAppUuid(),
            conversation_type: Service.Constants.MESSAGE.TO_TYPE,
            group_uuid: ( config.group_uuid !== undefined ) ? config.group_uuid : undefined,
            member_list: ( config.user_uuid !== undefined ) ? [ config.user_uuid ] : undefined
        }, function( r ) {
            if ( r && r.error_code === 0 ) {
                
                push( conversation( r ) );

                $onResult( findByToken( r.uuid ) , callback );
                
            } else {
                $onResult( undefined, callback );
            }
            
        }, function( e ) {
            $onResult( undefined, callback );
        } );

        // try to match `assigned_uuid` to `userId`
        function find( userId ) {

            var r;
            $.each( conversationList, function( index, item ) {
                if ( item.assigned_uuid === userId ) {
                    r = item;
                }
            } );
            return r;
            
        }

        function findByGroupId( groupId ) {

            // find conversation id by group id
            var conversationId;
            $.each( conversationList, function( index, item ) {
                if ( item.type === TYPE.GROUP &&
                     item.uuid === groupId ) {
                    conversationId = item.conversation_uuid;
                }
            } );

            return conversationId && findByToken( conversationId );
            
        }
        
    }

    ////////// set `token` to active /////////
    function active( token ) {
        
        var conversation = findByToken( token );
        if ( conversation !== undefined ) {
            
            $.each( conversationList, function ( index, item ) {
                item.active = false;
            } );

            conversation.ts = Date.now();
            conversation.active = true;
            activeToken = token;
            
        }

        vip( token );
        
    }

    function vip( token ) {

        var conversation = findDefault(),
            appWelcome,
            appName;
        
        if ( conversation !== undefined ) {
            
            appWelcome = conversation.app_welcome;
            appName = conversation.app_name;
            
            conversation.vip = false;
            delete conversation.app_welcome;
            delete conversation.app_name;
            
        }

        var newer = findByToken( token );
        if ( newer ) {

            // move welcome info and `vip` flag to the newer conversation
            newer.vip = true;
            newer.app_welcome = appWelcome;
            newer.app_name = appName;
            
        }
        
    }

    ///// let `item` become an `TYPE.CONVERSATION`
    function conversation( item, vip ) {
        
        item [ 'type' ] = TYPE.CONVERSATION;
        item [ 'token' ] = item.uuid;
        item [ 'ts' ] = Service.$tools.getTimestamp( item.updatetime );
        item [ 'vip' ] = ( typeof vip === 'boolean' ) ? vip : false;
        
        return item;
    }

    ////// let `item` become an `TYPE.GROUP`
    function group( item ) {

        item [ 'type' ] = TYPE.GROUP;
        item [ 'token' ] = item.uuid;
        item [ 'ts' ] = Service.$tools.getTimestamp( item.updatetime );
        
        return item;
        
    }

    function findByToken( token ) {

        var find,
            i,
            len = conversationList.length;

        for ( i = 0; i < len; ++i ) {
            if ( token === conversationList [ i ].token ) return conversationList [ i ];
        }
        
        return undefined;
        
    }

    function findDefault() {

        var find,
            i,
            len = conversationList.length;
        
        for ( i = 0 ; i < len ; ++i ) {
            if ( conversationList [ i ].vip ) return conversationList [ i ];
        }

        return undefined;
        
    }

    function sort( conversations ) {

        if ( !conversations || conversations.length <= 1 ) return conversations;
        return conversations.sort( compare );

        function compare( a, b ) {

            var weightA = weight( a ),
                weightB = weight( b );

            if ( weightA > weightB ) return -1;
            if ( weightA < weightB ) return 1;
            
            var timestampA = a.ts,
                timestampB = b.ts;

            return timestampB - timestampA;
        }

        function weight( a ) {
            return ( a.type === TYPE.GROUP ) ? WEIGHT_GROUP : 0;
        }
    }

    function push( conversation ) {

        var existItem;
        $.each( conversationList, function ( index, item ) {
            if ( existItem === undefined && item.token === conversation.token ) {
                existItem = item;
            }
        } );

        if ( existItem === undefined ) {
            conversationList.push( conversation );
        } else {
            conversation.vip = existItem.vip; // prevent `vip` override
            $.extend( existItem, conversation );
        }
        
    }
    
} )();
