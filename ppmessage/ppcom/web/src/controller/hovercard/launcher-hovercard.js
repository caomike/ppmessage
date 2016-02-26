/**
 *
 * [Example]:
 * var launcherHoverCardCtrl = Ctrl.$hoverCard;
 * launcherHoverCardCtrl.showHoverCard(); // 显示HoverCard
 * launcherHoverCardCtrl.hideHoverCard(); // 隐藏HoverCard
 *
 */
Ctrl.$hoverCard = (function() {

    function HoverCardController() {
        Ctrl.PPBaseCtrl.call(this);

        var _timeoutEvent = null,
            _isShowing = false,
            _isPageLoadEndShowing = false, // When PPCom load end, hoverCard will show automatically if need
            _inited = false,

            self = this,

            // jQuery Elements Selectors
            ppMessageSelector = '#pp-messenger',
            hovercardSelector = '#pp-launcher-hovercard',
            conversationSelector = '#pp-conversation',
            welcomeSelector = '#pp-launcher-hovercard-welcome',
            textareaSelector = '#pp-launcher-hovercard-textarea-textarea',
            textareaContainerSelector = '#pp-launcher-hovercard-textarea',
            textareaFocusClass = 'pp-textarea-focus',
            closeBtnSelector = '#pp-container .pp-launcher-hovercard-close',

            closeButtonIsClickedCookieKey = 'pp-showed-hovercard',
            closeButtonIsClickedCookieExpire = 30 * 24 * 3600, // 30 days

            $hoverCardView, // We use this to update html content in hovercard
            $hoverCardController, // We use this to delegate hovercard's events

            _clearTimeoutEvent = function() { //清除定时事件
                if (_timeoutEvent != null) {
                    $clearTimeout(_timeoutEvent);
                    _timeoutEvent = null;
                    return;
                }
            },

            _hasTimeoutEventPending = function() { //是否有定时事件正在执行
                return _timeoutEvent != null;
            },

            // -------------------------
            // CLOSE BUTTON EVENT START
            // -------------------------
            
            isShowCloseButton = function() { // is show close button ?
                return false;
                // var clicked = Service.$cookies.get(closeButtonIsClickedCookieKey);
                // return !clicked || clicked !== 'true';
            },

            isShowHoverCardOnPageLoadEnd = function() { // show Hovercard when inited finish ?
                return false;
                // return isShowCloseButton();
            },

            updateCloseButtonCookieState = function() { // store clicked-close-button info to cookie

                if (Service.$cookies.get(closeButtonIsClickedCookieKey) === undefined) {
                    
                    Service.$cookies.set(closeButtonIsClickedCookieKey, 'true', {
                        expires: closeButtonIsClickedCookieExpire
                    });
                    
                }

            },

            notifyUserActiveClickPPCom = function() { // user has active click `PPMessage`
                _isPageLoadEndShowing = false;

                // updateCloseButtonCookieState(); // mark user clicked
                // $(closeBtnSelector).hide(); // hide close button
            },

            // Delegate Launcher click event
            interceptLauncherClickEvent = function() {
                return $hoverCardController && $hoverCardController.interceptLauncherClickEvent(self);
            };

        /**
         * HoverCard Initialization Event
         */
        this.onHoverCardInit = function() {

            Service.$conversationManager.asyncGetDefaultConversation( function( response ) {

                if ( response ) {
                    
                    self.updateInitState(true); // Notify welcome info has download successful

                    var view = View.$hoverCardContentCategorySingle,
                        controller = Ctrl.$hoverCardCategorySingle,
                        hovercardWelcome = buildWelcomeInfo( response.app_name, response.app_welcome, response.user_list );

                    view.updateHoverCard( hovercardWelcome );
                    controller.delegateHoverCardInitEvent( hovercardWelcome );

                    $hoverCardView = view;
                    $hoverCardController = controller;
                    
                }
                
            } );

        };

        /**
         * 是否初始化成功，从网上拿来信息成功
         */
        this.isInited = function() {
            return _inited;
        };

        /**
         * 更新是否初始化成功的状态
         */
        this.updateInitState = function(success) {
            _inited = success;
        };

        this.onTextareaFocus = function() {
            $(textareaSelector).addClass(textareaFocusClass);
        };

        this.onTextareaUnFocus = function() {
            $(textareaSelector).removeClass(textareaFocusClass);        
        };

        this.onMouseOver = function() {
            this.showHoverCard();
        };

        this.onMouseLeave = function() {
            this.hideHoverCard();
        };

        /**
         * HoverCard 点击事件：
         */
        this.onHoverCardClicked = function() {
            notifyUserActiveClickPPCom();

            $hoverCardController && $hoverCardController.delegateHoverCardClickEvent(this);
        };

        /**
         * 隐藏 HoverCard，并通过动画平滑过渡到 聊天面板 界面
         */
        this.smoothTranisationToMessagePanel = function() {
            View.$hoverCard.smoothTranisationToMessagePanel();

            Ctrl.$conversationContent
                .show( Service.$conversationManager.activeConversation(), { fadeIn: false, delay: 0 }, function() {
                    View.$composerContainer.focus(); // focus
                } );
        };

        /**
         * 隐藏 HoverCard
         *
         * Note：HoverCard并不是立刻隐藏的，而是在设定了一个定时事件，默认500ms之后才会触发隐藏事件。
         *
         * 定时事件可通过`_hasTimeoutEventPending()` 查询是否存在，可通过`_clearTimeoutEvent()`来清除它
         * 
         */
        this.hideHoverCard = function() {
            _timeoutEvent = $timeout(function() {
                self.hideHoverCardNow();
            }, 500);
        };

        /**
         * 立刻隐藏 HoverCard
         */
        this.hideHoverCardNow = function() {
            if (_isPageLoadEndShowing) return; // Force user to click `close` button manually to hide me
            
            var hoverCard = $(hovercardSelector);
            hoverCard.css({transform: "315px 100%"})
                .animate({scale:.8,x:0,y:0,opacity:0}, 90, function() {
                    hoverCard.hide();
                    _isShowing = false;
                    _clearTimeoutEvent(); 
                });
        };

        /**
         * 显示 HoverCard
         */
        this.showHoverCard = function() {
            
            if (_hasTimeoutEventPending()) {
                _clearTimeoutEvent();
                return;
            }

            if (_isShowing) {
                return;   
            }

            if (!_inited) {
                return;
            }
            
            // var anim = "cubic-bezier(0.1, 0.0, 0.2, 1)";
            var hoverCard = $( hovercardSelector );
            hoverCard.stop().clearQueue().removeAttr('style');
            hoverCard.show()
                .css({ transformOrigin: "315 100%",x: 0,y: 0 })
                .animate({opacity: 0,scale: .8,x:0,y:0}, {
                    duration: 0
                })
                .animate({scale:1, x:0,y:0}, {queue: false, duration: 250})
                .animate({opacity: 1}, {
                    duration: 170
                });

            $hoverCardController && $hoverCardController.onShow();
            
            _isShowing = true;
        };

        // -------------------------
        // CLOSE BUTTON EVENT START
        // -------------------------
        this.onHovercardCloseButtonClickEvent = function(e) { // on user press close button on the right-top corner
            e.stopImmediatePropagation();

            notifyUserActiveClickPPCom();

            self.hideHoverCardNow(); // hide hovercard
        };

        this.isShowCloseButton = isShowCloseButton; // is show close button

        this.notifyUserActiveClickPPCom = notifyUserActiveClickPPCom; // On user active click `PPCom`

        this.interceptLauncherClickEvent = interceptLauncherClickEvent;

    }
    extend(HoverCardController, Ctrl.PPBaseCtrl);

    var instance = null, // singletion

        get = function() {
            if (!instance) {
                instance = new HoverCardController();
            }
            return instance;
        };
    
    return {
        get: get
    }

    ////////// Tools ///////////
    function buildWelcomeInfo ( team, welcomeText, serviceUsers ) {
        return {
            appTeamName: team,
            appWelcomeText: welcomeText,
            
            activeAdmins: (function() {
                
                var users = [];

                serviceUsers && $.each(serviceUsers, function( index, item ) {
                    
                    var infoAdapter = Service.$users.adapter( item );
                    if ( infoAdapter.user_uuid !== Service.$user.getUser().getInfo().user_uuid ) {
                        users.push( Service.$users.getOrCreateUser( infoAdapter ).getInfo() );                        
                    }

                });

                return users;
                
            })()
        };
    }
    
})();
