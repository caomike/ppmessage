// TODO: refactor
Ctrl.$launcher = (function() {

    var _launcherIcon = "",
        _clickToOpenConversation = "",
        _launcherImgWidth = 50; //50 * 50

    function PPLauncherCtrl() {

        var self = this,

            _showHoverCard = function() {
                Ctrl.$hoverCard.get().showHoverCard();
            },

            _hideHoverCard = function() {
                Ctrl.$hoverCard.get().hideHoverCard();
            };

        this.onClickEvent = function() { // Launcher onClick event
            // If hoverCard delegate launcher click event, we will not show MessageBox
            if (!Ctrl.$hoverCard.get().interceptLauncherClickEvent()) {
                this.showMessageBox();
            }
        },

        this.shouldShowLauncherWhenInit = function() { // 是否默认显示小泡
            return View.$settings.isShowLauncher();
        },

        // Open messageBox and hide Launcher
        this.showMessageBox = function() {

            var messageOnShowingOld = messageOnShowing;
            
            // clear data and hide launcher
            self.hideLauncher();
            View.$launcher.showMessageBox();

            if ( Ctrl.$conversationPanel.mode() === Ctrl.$conversationPanel.MODE.CONTENT ) {
                Ctrl.$conversationContent
                    .show( Service.$conversationManager.activeConversation(), { fadeIn: false, delay: 0 }, function() {
                        View.$composerContainer.focus(); // focus
                    } );
            }
            
        },

        this.onMouseOverEvent = function() {
            _isMouseOver = true;

            if (!this.shouldShowHoverCardOnMouseOver()) {
                return;
            }

            Ctrl.$hoverCard.get().isInited() && _showHoverCard();
        },

        this.onMouseLeaveEvent = function() {
            _isMouseOver = false;
            _hideHoverCard();
        },

        this.isMouseOver = function() {
            return _isMouseOver;
        },

        this.recordOpenConversationItem = function(message) {
            _clickToOpenConversation = message;
        },

        this.getLauncherIcon = function() {
            return _launcherIcon || Service.Constants.ICON_DEFAULT_LAUNCHER;
        },

        this.getLauncherBottomMargin = function() {
            return View.$settings.getLauncherBottomMargin();
        },

        this.getLauncherRightMargin = function() {
            return View.$settings.getLauncherRightMargin();
        },

        this.shouldShowHoverCardOnMouseOver = function() {
            return !Service.$device.isMobileBrowser() && Ctrl.$conversationPanel.mode() === Ctrl.$conversationPanel.MODE.CONTENT;
        },

        this.launcherInit = function() {
        },

        this.setLauncherIcon = function(icon) {
            _launcherIcon = icon;
            $('#pp-launcher-icon').attr('src', this.getLauncherIcon());
        },

        /**
         * 当前小泡是否处于显示状态
         *
         */
        this.isLauncherShow = function() {
            //Note: 不能使用 `$('#pp-launcher-button').hasClass('pp-launcher-button-maximize')` 来判断，因为在一开始`pp-launcher-button`，这两个`class`均没有
            return this.shouldShowLauncherWhenInit() && !$('#pp-launcher-button').hasClass('pp-launcher-button-minimized');
        },

        this.onLauncherInit = function() {
        },

        // unreadNumber <= 0: hidden; unreadNumber>0: show
        this.setUnreadBadgeNum = function(unreadNumber) {
            var show = unreadNumber > 0;
            _unreadBadgeNum = show ? (unreadNumber > 99 ? 99 : unreadNumber) : 0;
            show ? $( '#pp-launcher-badge' ).show() : $( '#pp-launcher-badge' ).hide();
            $('#pp-launcher-badge').text(_unreadBadgeNum);
        },

        this.getUnreadBadgeNum = function() {
            return _unreadBadgeNum;
        },

        this.clear = function() {
            _unreadBadgeNum = 0;
            _launcherIcon = "";
            _clickToOpenConversation = "";
        },

        /**
         * Hide launcher
         */
        this.hideLauncher = function() {
            View.$launcher.hideLauncher();

            this.setUnreadBadgeNum(0);
            this.setLauncherIcon("");

            // clearn message on showing
            messageOnShowing = undefined;
        };

        // on message arrived ...
        Service.$pubsub.subscribe('msgArrived/launcher', function(topics, ppMessage) {
            
            self.setUnreadBadgeNum( self.getUnreadBadgeNum() + 1 );
            self.setLauncherIcon( ppMessage.getBody().user.avatar );
            self.recordOpenConversationItem( ppMessage.getBody() );

            // record the new one
            // so when we click launcher, directyle open chating panel, rather than group list panel
            messageOnShowing = ppMessage.getBody();
            
        });
        
    };

    var _unreadBadgeNum = 0,
        _isMouseOver = false,
        messageOnShowing,

        instance,

        get = function() {
            if (!instance) {
                instance = new PPLauncherCtrl();
            }
            return instance;
        };
    
    return {
        get: get,
    }
    
})();
