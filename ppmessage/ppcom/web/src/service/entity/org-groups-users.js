Service.$orgGroupUsers = ( function () {

    var groupUsers = {}; // key: group_uuid, value: [ {user_1}, {user_2}, ... ]

    ////////// API /////////////
    return {
        asyncGet: asyncGet
    }

    /////// Implementation /////
    
    function asyncGet ( groupId, callback ) {
        
        if ( !groupId ) {
            $onResult ( [], callback );
            return;
        }

        if ( groupUsers [ groupId ] ) {
            $onResult ( groupUsers [ groupId ], callback );
            return;
        }

        Service.$api.getOrgGroupUserList ( {
            app_uuid: Service.$ppSettings.getAppUuid(),
            group_uuid: groupId
        } , function ( response ) {

            groupUsers [ groupId ] = [];
            
            if ( ( response.error_code === 0 ) && response.list ) {
                $.each ( response.list, function ( index, item ) {
                    var user = Service.$users.adapter ( item );
                    groupUsers [ groupId ].push( Service.$users.getOrCreateUser( user ).getInfo() );
                } );
            }

            $onResult( groupUsers [ groupId ], callback );
            
        }, function ( error ) {
            $onResult( [], callback );
        } );
    }
    
} )();
