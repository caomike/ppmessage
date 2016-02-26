//
// conversation-panel manage :
//
// - conversation-list : `MODE.LIST`
// - conversation-content : `MODE.CONTENT`
//
Ctrl.$conversationPanel = ( function() {

    var MODE = { LIST: 'LIST', CONTENT: 'CONTENT' },
        cMode = MODE.CONTENT;

    //////// API //////////
    return {
        MODE: MODE,
        mode: mode
    }

    ////// Implementation //

    function mode( m ) { //Query current mode
        
        if ( m === undefined ) {
            return cMode;    
        }

        cMode = m;

        switch ( cMode ) {
        case MODE.LIST:
            Service.$schedule.cancelAll(); // Cancel all sechedule tasks
            View.$sheetHeader.hideGroupButton();
            View.$sheetHeader.hideDropDownButton();
            Ctrl.$groupMembers.hide();
            break;

        case MODE.CONTENT:
            // Strictly speaking ... We show `dropDownMenu` should decide by the conversation members should > 1
            // for simply, we always show it here, the count of conversation's members seldom not > 1
            View.$sheetHeader.showDropDownButton();
            View.$sheetHeader.showGroupButton(); // show group button
            break;
        }
    }
    
} )();
