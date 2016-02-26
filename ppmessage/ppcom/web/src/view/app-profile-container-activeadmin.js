/**
 * Single Active Admin
 */
((function(View) {

    function AppProfileContainerActiveAdmin(activeAdmin) {
        View.PPDiv.call(this, {
            'class': 'pp-active-admin',
            user_uuid: activeAdmin.user_uuid
        });

        var isOnline = activeAdmin.is_online,
            stateClass = 'state ' + ( isOnline ? 'online' : 'offline' ),

            getStateDesc = function(isOnline) {
                return '[' + ( isOnline ? Service.Constants.i18n('ONLINE') : Service.Constants.i18n('OFFLINE') ) + ']';
            },
            
            stateDesc = getStateDesc(isOnline);

        this.add(new View.PPDiv('pp-admin-avatar')
                 .add(new View.PPElement('img', {
                     src: activeAdmin.user_avatar
                 })))
            .add(new View.PPDiv({'class': 'pp-active-admin-name pp-font pp-selectable'})
                 .text(activeAdmin.user_fullname))
            .add(new View.PPDiv({
                'class': stateClass + ' pp-font'
            }).text(stateDesc));

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // TODO Because `AppProfileContainerActiveAdmin` destroy and recreate when open a new group item,
        // we should `unsubscribe` to avoid memory leak here
        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        
        // Listen for user infochange event
        Service.$pubsub.subscribe('user/infochange/' + activeAdmin.user_uuid, function (topics, user) {

            var userInfo = user.getInfo(),
                
                $adminElement = $('#pp-active-admins').
                find('div[user_uuid=' + activeAdmin.user_uuid + ']'); // admin div

            // Change admin user name and icon
            if ($adminElement.length) {
                $adminElement.find('img').attr('src', userInfo.user_avatar);
                $adminElement.find('.pp-active-admin-name').text(userInfo.user_fullname);
            }
            
        });

        // Listen for user state change envent
        Service.$pubsub.subscribe('user/infochange/state/' + activeAdmin.user_uuid, function (topics, user) {

            var userInfo = user.getInfo(),
                
                $adminElement = $('#pp-active-admins').
                find('div[user_uuid=' + activeAdmin.user_uuid + ']'); // admin div

            // Change admin user name and icon
            if ($adminElement.length) {

                var $e = $adminElement.find('.state');

                if (userInfo.is_online) {
                    $e.removeClass('offline').addClass('online');
                } else {
                    $e.removeClass('online').addClass('offline');
                }
                $e.text(getStateDesc(userInfo.is_online));
            }
            
        });
    }
    extend(AppProfileContainerActiveAdmin, View.PPDiv);

    View.AppProfileContainerActiveAdmin = AppProfileContainerActiveAdmin;
    
})(View));
