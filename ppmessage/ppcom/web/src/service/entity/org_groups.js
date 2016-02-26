Service.$orgGroups = (function() {

    var orgGroupList, // group array

        orgGroupDict = {}; // group in dictionary

    ///////// API /////////////
    
    return {
        asyncGetAppOrgGroupList: asyncGetAppOrgGroupList,
        // act as setter or getter
        conversationId: conversationId
    }

    ////// Implementation ////

    function asyncGetAppOrgGroupList (callback) {

        if (orgGroupList !== undefined) {
            $onResult( orgGroupList, callback );
            return;
        }
        
        Service.$api.getAppOrgGroupList({
            app_uuid: Service.$ppSettings.getAppUuid()
        }, function(response) {
            orgGroupList = response.list;
            
            groupArray2Dict( orgGroupList );
            
            $onResult( orgGroupList, callback );   
        }, function(error) {
            orgGroupList = [];
            $onResult( orgGroupList, callback );
        });
    }

    function groupArray2Dict ( groupArray ) {
        groupArray && $.each( groupArray, function ( index, item ) {

            orgGroupDict [ item.group_uuid ] = item;
            
        } );
    }

    // setter or getter
    function conversationId ( groupId, conversationIdentifier ) {

        if ( groupId && conversationIdentifier ) {
            orgGroupDict [ groupId ] = conversationIdentifier;
        } else {
            return orgGroupDict [ groupId ] && orgGroupDict [ groupId ].conversation_uuid ;
        }
        
    }
    
})();
