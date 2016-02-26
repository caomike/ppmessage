Service.$sheetHeader = ( function() {

    var TITLE_DEFAULT = Service.Constants.DEFAULT_HEADER_TITLE,
        title = "",
        isClose = true,
        unread = 0,
        isShowDropDownMenu = false;

    ///////// API /////////////

    return {
        
        setHeaderTitle: setHeaderTitle,
        getHeaderTitle: getHeaderTitle,
        asyncGetHeaderTitle: asyncGetHeaderTitle,
        
        close: close,
        closed: closed,

        incrUnreadCount: incrUnreadCount,
        unreadCount: unreadCount,
        decrUnreadCount: decrUnreadCount,

        isShowDropDownButton: isShowDropDownButton,
        showDropDownButton: showDropDownButton
    }

    //////// Implementation //////////

    function setHeaderTitle(title) {
        title = title || TITLE_DEFAULT;
    }

    function getHeaderTitle() {
        return title || TITLE_DEFAULT;
    }

    function asyncGetHeaderTitle( callback ) {
        if ( title ) {
            $onResult( title, callback );
            return;
        }

        title = Service.$app.appName() || TITLE_DEFAULT;
        $onResult( title, callback );
    }

    function close( close ) {
        isClose = close;
    }

    function closed() {
        return isClose;
    }

    function incrUnreadCount() {
        unread++;
    }

    function unreadCount() {
        return unread;
    }

    function decrUnreadCount( count ) {
        unread = unread - count < 0 ?
            0 :
            unread - count;
    }

    function isShowDropDownButton() {
        return isShowDropDownMenu;
    }

    function showDropDownButton( show ) {
        isShowDropDownMenu = show;
    }
    
} )();
