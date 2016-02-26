View.$sheetHeader = (function() {

    /**
     * @constructor
     */
    function PPSheetHeader() {
        
        var ctrl = Ctrl.$sheetheader,
            PPDiv = View.PPDiv,
            PPElement = View.PPElement,

            iconConversations = Configuration.assets_path + 'img/icon-conversations.png',

            buildTitle = function() {
                return new PPDiv('pp-sheet-header-title-container')
                    .add(new View.Div({
                        className: 'title-container'
                    })
                         .add(new PPElement('b', {
                             id: titleId,
                             'class': titleId + ' pp-selectable'
                         })));
            },

            buildMinimizeButton = function() {
                return new PPElement('a', {
                    id: minimizeButtonId,
                    'class': minimizeButtonId,
                    title: Service.Constants.i18n('MINIZE_BUTTON_HINT')
                })
                    .add(new PPDiv({
                        id: 'pp-sheet-header-button-icon',
                        style: 'background-image: url(' + Configuration.assets_path + 'img/icon-minimize.png)'
                    }));
            },

            buildConversationsButton = function() {
                return new PPElement('a', {
                    'class': 'pp-sheet-conversations-button'
                }).add(new PPDiv({
                    'class': 'pp-sheet-header-button-icon',
                    style: 'background-image: url(' + iconConversations + ')'
                })).add(new PPDiv({
                    'class': 'pp-unread-count pp-font pp-box-sizing'
                }));
            },

            buildSheetHeaderEvent = function() {
                $('#' + id).bind('click', ctrl.onSheetHeaderClicked);
            },

            buildMinimizeButtonEvent = function() {

                var selector = '.pp-sheet-header-button .pp-sheet-header-button-icon';
                
                $('#' + minimizeButtonId)
                    .bind('mouseover', function() {
                        $(selector).css('opacity', 1.0);
                    })
                    .bind('mouseleave', function() {
                        $(selector).css('opacity', .4);
                    })
                    .bind('click', ctrl.minimize);
            },

            buildConversationsButtonEvent = function() {

                var selector = groupButtonIconSelector;
                
                $(selector)
                    .bind('mouseover', function() {
                        $(selector).css('opacity', 1.0);
                    })
                    .bind('mouseleave', function() {
                        $(selector).css('opacity', .4);
                    })
                    .bind('click', function() {
                        Ctrl.$conversationList.show();
                    });
            },

            buildUnreadButtonEvent = function() {
                var selector = '.pp-sheet-conversations-button .pp-unread-count';
                $ ( selector )
                    .bind('mouseover', function () {
                        $ ( groupButtonIconSelector ).mouseover();
                    })
                    .bind('mouseleave', function () {
                        $ ( groupButtonIconSelector ).mouseleave();
                    })
                    .bind('click', function () {
                        $ ( groupButtonIconSelector ).click();
                    });
            };
        
        PPDiv.call(this, {
            id: id,
            'class': id + ' pp-box-sizing pp-unselectable'
        }, ctrl);

        // Build HTML
        this.add(buildTitle())
            .add(buildConversationsButton())
            .add(buildMinimizeButton());

        // Bind event
        $timeout(function() {
            ctrl.onSheetHeaderInit();
            buildSheetHeaderEvent();
            buildMinimizeButtonEvent();
            buildConversationsButtonEvent();
            buildUnreadButtonEvent();
        });
    }
    extend(PPSheetHeader, View.PPDiv);

    var id = 'pp-sheet-header',
        titleId = 'pp-sheet-header-title',
        minimizeButtonId = 'pp-sheet-header-button',
        unreadCountSelector = '.pp-unread-count',
        groupButtonSelector = '.pp-sheet-conversations-button',
        groupButtonIconSelector = groupButtonSelector + ' .pp-sheet-header-button-icon',
        titleSelector = '.pp-sheet-header .title-container',

        build = function() {
            return new PPSheetHeader();
        },

        // unreadCount > 0, show unread number
        // unreadCount <= 0, hide unread number
        setUnreadCount = function(unreadCount) {
            if (unreadCount > 0) {
                $(unreadCountSelector).show().text(unreadCount);
            } else {
                $(unreadCountSelector).hide();
            }
        },

        showGroupButton = function() {
            $(groupButtonSelector).show();
        },

        hideGroupButton = function() {
            $(groupButtonSelector).hide();
        },

        setTitle = function(title) {
            $( '#' + titleId ).text( title );
        };

    ///////// API //////////////
    return {
        build: build,

        height: height,

        setUnreadCount: setUnreadCount,
        showGroupButton: showGroupButton,
        hideGroupButton: hideGroupButton,

        showDropDownButton: showGroupMembersDropDownButton,
        hideDropDownButton: hideGroupMembersDropDownButton,
        changeDropDownButtonToHideState: changeGroupMembersDropDownButtonToHideState,
        changeDropDownButtonToShowState: changeGroupMembersDropDownButtonToShowState,

        setTitle: setTitle
    }

    ////////// Implementation /////

    function showGroupMembersDropDownButton () {

        if ( Service.$sheetHeader.isShowDropDownButton() ) return;
        
        Service.$sheetHeader.showDropDownButton( true ); // update state
        
        var $el = $( titleSelector );
        
        $el.append( new View.Element( 'i', {
            className: 'down-icon',
            style: 'background: url(' + Configuration.assets_path + 'img/icon-down.png) 0 -795px'
        } ).getHTML() )
            .addClass( 'clickable' )
            .on( 'click', function() {

                var $groupMembers = Ctrl.$groupMembers;

                if ( $groupMembers.isShow() ) {
                    changeGroupMembersDropDownButtonToHideState();
                    $groupMembers.hide();
                } else {
                    changeGroupMembersDropDownButtonToShowState();
                    $groupMembers.show();
                }
                
            } );
        
    }

    function hideGroupMembersDropDownButton () {

        Service.$sheetHeader.showDropDownButton( false ); // update state
        
        var $el = $( titleSelector );

        // remove drop-down button
        $el.find( 'i' ).detach();

        $el.removeClass( 'clickable' );
        $el.off( 'click' );
        
    }

    function changeGroupMembersDropDownButtonToHideState() {
        $( titleSelector ).find( 'i' )
            .attr( 'style', 'background: url(' + Configuration.assets_path + 'img/icon-down.png) 0 -795px' );
    }
    
    function changeGroupMembersDropDownButtonToShowState() {
        $( titleSelector ).find( 'i' )
            .attr( 'style', 'background: url(' + Configuration.assets_path + 'img/icon-down.png) 0 -2362px' );
    }

    function height() {
        return $( '#' + id ).height();
    }
    
})();
