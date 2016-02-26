Service.$conversation = ( function() {

    var conversationUsers = {
        // conversation-token: [ user_1, user_2 ]
    };

    //////// API ///////////
    
    return {
        asyncGetUser: asyncGetUser
    }

    ////// asyncGetUser ////
    // @param settings
    // {
    //     reuse: true/false - whether or not should reuse exist conversation users, default is false
    //     include: true/false - whether or not include current portal user, default is false
    // }
    function asyncGetUser( token, callback, settings ) {

        if ( settings && settings.reuse ) {
            if ( conversationUsers [ token ] !== undefined ) {
                $onResult( sort( filter( conversationUsers [ token ] ) ), callback );
                return;
            }
        }

        conversationUsers [ token ] = undefined; // remove all cached user datas
        
        Service.$api.getConversationUserList( {
            app_uuid: Service.$ppSettings.getAppUuid(),
            conversation_uuid: token
        }, function( r ) {

            if ( r && r.error_code === 0 ) {
                conversationUsers [ token ] = ( function() {
                    
                    var users = [];
                    r.list && $.each( r.list, function( index, item ) {
                        var userInfoAdapter = Service.$users.adapter( item );
                        users.push( Service.$users.getOrCreateUser( userInfoAdapter ).getInfo() );
                    } );
                    return users;
                    
                } ());
            } else {
                conversationUsers [ token ] = [];
            }

            $onResult( sort( filter( conversationUsers [ token ] ) ), callback );
            
        }, function( e ) {

            conversationUsers [ token ] = [];

            $onResult( sort( filter( conversationUsers [ token ] ) ), callback );
            
        } );

        function filter( users ) {

            // if `settings.include` === `true`
            // then include `portal` user
            if ( settings && settings.include ) {
                return users;
            }

            return excludePortalUser( users );
            
        }
        
    }

    ///////// tools ////////
    function sort( users ) {
        return users;
    }

    function excludePortalUser( users ) {
        if ( !users ) return users;

        // make a copy
        var userArray = users.slice(),
            i;
        $.each( userArray, function( index, item ) {
            if ( item.user_uuid === Service.$user.quickId() ) {
                i = index;
            }
        } );

        // arrayObject.splice(index,howmany,item1,.....,itemX)
        if ( i !== undefined ) userArray.splice( i, 1 );

        return userArray;
        
    }
    
} )();
