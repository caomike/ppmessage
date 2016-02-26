View.$groupMember = (function() {

    var groupMembersSelector = '.pp-container .group-members',
        mobileOnlineIcon = Configuration.assets_path + 'img/state_mobile_online.png';
    
    return {
        build: build
    }

    /////// Implementation ////////

    function build( user ) {

        var container = new View.PPDiv( {
            className : 'member'
        } );

        container.add( buildAvatar( user ) );
        container.add( buildName( user ) );

        return container;
        
    }

    function buildAvatar( user ) {

        var container = new View.Div( { className: 'pp-wrapper' } ),
            isOnline = user.is_online;

        container.add( new View.Img( {
            
            className: 'pp-avatar' +
                ( isOnline ? '' : ' grayscale' ), // if not online, apply `gray style` to the user avatar, `grayscale` not support `IE 10+`
            
            src: user.user_avatar,
            user_uuid: user.user_uuid } ) );

        if ( isOnline ) {
            if ( user.is_mobile_online ) {
                container.add( new View.Img( { className: 'pp-state pp-active', src: mobileOnlineIcon } ) );    
            } else if ( user.is_mobile_online ) {
                // add pc online icon
            }
        }

        return container;
    }

    function buildName( user ) {
        return new View.Div( {
            className: 'name'
        } ).text( user.user_fullname );
    }

    function imgSelector( user ) {
        return groupMembersSelector + ' img[user_uuid=' + user.user_uuid + ']';
    }
    
} )();
