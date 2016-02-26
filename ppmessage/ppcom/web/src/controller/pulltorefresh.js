Ctrl.$pulltoRefreshController = (function() {

    function PulltoRefreshController() {
        Ctrl.PPBaseCtrl.call(this);

        var Constants = Service.Constants,
            device = Service.$device,
            
            inMobile = device.isMobileBrowser(),
            loadHistoryHintText = inMobile ? Constants.i18n('LOAD_HISTORY_MOBILE_HINT') : Constants.i18n('LOAD_HISTORY_HINT'),
            loadingHistoryText = Constants.i18n('LOADING_HISTORY'),
            noMoreHistoryText = Constants.i18n('NO_MORE_HISTORY'),
            
            loadable = true, // can load history

            self = this,

            conversationContentCtrl,

            selector = '#pp-conversation-part-pulltorefreshbutton',
            conversationContentSelector = '#pp-conversation-content',

            onEndEventCallback = null, // onend event

            // bind pull2refresh event
            bindPull2RefreshEvent = function() {
                $(conversationContentSelector).pullToRefresh()
                
                    .on("start.pulltorefresh", function (evt, y){
                        Service.$debug.d('Start!! ' + evt + ', '+y)
                    })
                
                    .on("move.pulltorefresh", function (evt, percentage){
                        Service.$debug.d('Move.. ' + evt + ', '+percentage)
                    })
                
                    .on("end.pulltorefresh", function (evt){
                        Service.$debug.d('End.. ' + evt);

                        onEndEventCallback && onEndEventCallback(evt); // callback onend event
                    })
                
                    .on("refresh.pulltorefresh", function (evt, y){
                        Service.$debug.d('Refresh.. ' + evt + ', '+y)
                        loadHistory();
                    });
            },

            beforeRefreshContentView = function() {
                // We destroy `pulltorefresh` button we begin loading
                $(selector).remove();
            },

            afterRefreshContentView = function(historyArray) {
                var hasMoreHistory = conversationContentCtrl.isLoadable(),
                    text = hasMoreHistory ? loadHistoryHintText : noMoreHistoryText;

                // After `refresh` we add `pulltorefresh` button again
                $(conversationContentSelector).prepend(View.$pulltoRefresh.build(text).getHTML());
                setLoadable(hasMoreHistory);

                self.bindEvent();
            },

            loadHistory = function() {
                // on loading state or no more history state
                if (!loadable) return;

                // change text to indicate loading
                $(selector).text(loadingHistoryText);
                setLoadable(false);

                conversationContentCtrl.loadHistorys(function() {
                    // begin loading
                    beforeRefreshContentView();
                }, function(list) {
                    afterRefreshContentView(list);
                });

            },

            setLoadable = function(click) {
                loadable = click;
                $(selector).css('cursor', loadable ? 'pointer' : 'default');
            };
        
        this.getLoadHistortyHintText = function() {
            return loadHistoryHintText;
        };

        this.onLoadHistoryButtonClick = function() {
            if (!inMobile) loadHistory();
        };

        this.loadable = function(loadable) {
            setLoadable(loadable);
            $(selector).text(loadable ? loadHistoryHintText : noMoreHistoryText);
            return this;
        };

        this.bindEvent = function() {
            // in mobile
            // bind `pull-to-refresh` event
            if (inMobile) {
                bindPull2RefreshEvent();
            } else {
                // bind click event on `pc`
                View.$pulltoRefresh.el().bind('click', self.onLoadHistoryButtonClick);
            }
            return this;
        };

        this.onend = function(onEndEvent) { // pulltorefresh onend callback
            onEndEventCallback = onEndEvent;
            return this;
        };

        this.init = function( $conversationContentCtrl ) {
            // The `pulltorefresh` view will try to call `get()` method with empty params
            // So we should prevent empty `$conversationContentCtrl` assigned to `$pulltoRefresh` controller
            if ( $conversationContentCtrl ) {
                conversationContentCtrl = $conversationContentCtrl
            }
            return this;
        };
    }
    extend(PulltoRefreshController, Ctrl.PPBaseCtrl);

    var instance = null,

        get = function( $conversationContentCtrl ) {
            if (instance == null) {
                instance = new PulltoRefreshController();
            }
            return instance.init( $conversationContentCtrl );
        };
    
    return {
        get: get
    }
    
})();
