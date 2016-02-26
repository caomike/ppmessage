((function(Ctrl) {

    Ctrl.$hoverCardCategorySingle = (function() {

        return {
            delegateHoverCardClickEvent: onHoverCardClick,
            delegateHoverCardInitEvent: onHoverCardInit,
            interceptLauncherClickEvent: interceptLauncherClickEvent,
            onShow: onShow
        }

        function onShow() {

            // Dynamically load the users on the welcome hovercard 
            
            var vipConversation = Service.$conversationManager.vipConversation();
            if ( vipConversation ) {
                
                Service.$conversation.asyncGetUser( vipConversation.token, function( userArray ) {

                    View.$hoverCardContentCategorySingle.updateUsers( userArray );
                    
                }, { reuse: true }); // <= reuse the exist users in local
                
            }
            
        }
        
        function interceptLauncherClickEvent($hoverCardController) {
            return false;
        }

        function onHoverCardClick($hoverCardController) {
            Ctrl.$launcher.get().hideLauncher();
            View.$launcherPreview.text( '' ).hide();
            $hoverCardController.smoothTranisationToMessagePanel();
        }

        function onHoverCardInit(appWelcomeInfo) {

            // Listen user info change event
            // appWelcomeInfo &&
            //     appWelcomeInfo.activeAdmins &&
            //     $.each(appWelcomeInfo.activeAdmins, function(index, item) {
            
            //         Service.$pubsub.subscribe('user/infochange/' + item.user_uuid, function (topics, user) {

            //             var userInfo = user.getInfo();

            //             // Change hovercard admin user_avatar
            //             $('.pp-launcher-hovercard-admins')
            //                 .find('div[user_uuid=' + item.user_uuid + ']')
            //                 .find('img')
            //                 .attr('src', userInfo.user_avatar);                     
            
            //         });
            
            //     });
        }
        
    })();
    
})(Ctrl));
