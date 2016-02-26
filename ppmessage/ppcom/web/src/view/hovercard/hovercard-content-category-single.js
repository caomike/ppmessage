((function(View) {

    View.$hoverCardContentCategorySingle = (function() {

        /**
         * build self
         */
        var updateHoverCard = function(appProfile) {
            var controller = Ctrl.$hoverCard.get(),
                hoverCardSelector = '#pp-launcher-hovercard',
                $container = $( hoverCardSelector );

            controller.updateInitState(true);

            $container
                .empty()
                .css('cursor', 'pointer')
                .append(getHoverCardCloseButtonHtml(controller).getElement()[0].outerHTML)
                .append(new View.PPDiv('pp-launcher-hovercard-welcome')
                        .add(getHoverCardAdminsHtml(appProfile.activeAdmins))
                        .add(getHoverCardWelcomeTextHtml(appProfile.appTeamName, appProfile.appWelcomeText))
                        .getElement()[0].outerHTML)
                .append(getHoverCardTextAreaHtml(controller).getElement()[0].outerHTML);
        },

            getHoverCardCloseButtonHtml = function(controller) { // close button

                var className = 'pp-launcher-hovercard-close',
                    backgroundImg = 'background-image: url(' + Configuration.assets_path + 'img/icon-close-white.png)',
                    backgroundColor = 'background-color: ' + View.Style.Color.hovercard_close_btn,
                    show = controller.isShowCloseButton() ? 'display:block' : 'display:none',
                    closeBtnName = Service.Constants.i18n('CLOSE');
                
                return new View.PPDiv({
                    'class': className + ' pp-font',
                    selector: '.' + className,
                    style: backgroundImg + ';' + backgroundColor + ';' + show,
                    event: {
                        click: function(e) {
                            controller.onHovercardCloseButtonClickEvent(e);
                        }
                    }
                }).text(closeBtnName);
            },

            /**
             * Get hoverCard welcome text 
             */
            getHoverCardWelcomeTextHtml = function(appTeamName, appWelcomeText) {
                return new View.PPDiv('pp-launcher-hovercard-text')
                    .add(new View.PPDiv('pp-launcher-hovercard-app-name').text(appTeamName)) // App Name
                    .add(new View.PPDiv('pp-launcher-hovercard-welcome-text').text(appWelcomeText));
            },

            /**
             * Get hoverCard textarea
             */
            getHoverCardTextAreaHtml = function(controller) {
                var placeHolder = Service.Constants.i18n('HOVER_CARD_TEXTAREA_HINT');
                return new View.PPDiv({
                    id: 'pp-launcher-hovercard-textarea',
                    className: 'pp-launcher-hovercard-textarea pp-box-sizing'
                })  // child-2
                    .add(new View.PPElement('textarea', {
                        placeholder: placeHolder,
                        id: 'pp-launcher-hovercard-textarea-textarea',
                        className: 'pp-launcher-hovercard-textarea-textarea pp-box-sizing-borderbox',
                        event: {
                            focus: function() {
                                controller.onTextareaFocus();
                            },
                            blur: function() {
                                controller.onTextareaUnFocus();
                            }
                        }
                    }));
            },

            /**
             * Server avatar
             */
            getHoverCardAdminsHtml = function(activeAdmins) {
                var container = new View.PPDiv('pp-launcher-hovercard-admins');
                var maxZIndex = 2147483003; //z-index
                var imgWidth = getHoverCardAdminAvatarWidth(activeAdmins);
                var imgStyle = 'width:' + imgWidth + '; height:' + imgWidth;
                var maxCount = 3;
                
                activeAdmins && $.each(activeAdmins, function(index, item) {
                    if (index < maxCount) {
                        container.add(new View.PPDiv({
                            'class': 'pp-launcher-admin-avatar',
                            style: 'z-index:' + (maxZIndex--),
                            user_uuid: item.user_uuid
                        })
                                      .add(new View.PPElement('img', {
                                          src: item.user_avatar,
                                          style: imgStyle
                                      })));
                    }
                });
                return container;
            },

            /**
             * Server avatar width
             */
            getHoverCardAdminAvatarWidth = function(activeAdmins) {
                var imgWidth = '46px';
                if (activeAdmins) {
                    var len = activeAdmins.length;
                    switch (len) {
                    case 1:
                        imgWidth = '84px';
                        break;

                    case 2:
                        imgWidth = '56px';
                        break;

                    default:
                        imgWidth = '46px';
                    }
                }
                return imgWidth;
            };

        return {
            updateHoverCard: updateHoverCard,
            updateUsers: updateUsers  
        }

        function updateUsers( users ) {

            users = users || [];
            $( '#' + 'pp-launcher-hovercard-admins' )
                .empty()
                .append( getHoverCardAdminsHtml( users ).getHTML() );
            
        }
        
    })();

    
})(View));
