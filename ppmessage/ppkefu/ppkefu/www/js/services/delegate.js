ppmessageModule.factory("yvDelegate", [
    "$ionicListDelegate",
    "$ionicScrollDelegate",
    "$ionicSideMenuDelegate",
function ($ionicListDelegate, $ionicScrollDelegate, $ionicSideMenuDelegate) {

    var SCROLL_HANDLE = "conversation-scroll";
    var SIDEMENU_HANDLE = "left-sidemenu";
    var LIST_HANDLE = "conversation-list";
    var delegateCache = {};

    function get_delegate(ionicDelegate, handle) {
        var delegate;
        if (delegateCache[handle]) {
            return delegateCache[handle];
        }
        delegate = ionicDelegate.$getByHandle(handle);
        delegateCache[handle] = delegate || null;
        return delegate;
    }

    return {

        get_scroll_delegate: function (handle) {
            if (arguments.length === 0 || !handle) {
                handle = SCROLL_HANDLE;
            }
            return get_delegate($ionicScrollDelegate, handle);
        },

        scroll_bottom: function (handle, shouldAnimate) {
            var delegate = this.get_scroll_delegate(handle);
            delegate && delegate.scrollBottom(!!shouldAnimate);
        },

        scroll_top: function (handle, shouldAnimate) {
            var delegate = this.get_scroll_delegate(handle);
            delegate && delegate.scrollTop(!!shouldAnimate);
        },
        
        scroll_resize: function (handle) {
            var delegate = this.get_scroll_delegate(handle);
            delegate && delegate.resize();
        },

        scroll_down: function (height, handle, shouldAnimate) {
            var delegate = this.get_scroll_delegate(handle);
            delegate && delegate.scrollBy(0, height, !!shouldAnimate);
        },
        
        get_sidemenu_delegate: function (handle) {
            if (arguments.length === 0 || !handle) {
                handle = SIDEMENU_HANDLE;
            }
            return get_delegate($ionicSideMenuDelegate, handle);
        },

        get_list_delegate: function (handle) {
            if (arguments.length === 0 || !handle) {
                handle = LIST_HANDLE;
            }
            return get_delegate($ionicListDelegate, handle);
        },
    };
}]);
