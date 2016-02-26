View.$groupMembers = (function() {

    var parentSelector = '#pp-conversation-container',
        groupMembersSelector = '.pp-container .group-members',
        groupMembersContainerSelector = '.pp-container .group-members-container',
        groupMembersSelectorAvatars = groupMembersSelector + ' img.pp-avatar',

        ANIMATE_DURATION = 250,
        showDuration = ANIMATE_DURATION,

        isMouseoverImg = false,
        REMOVE_GROUP_MEMBER_HOVERCARD_EVENT_ID = 'rm-group-member-hovercard',
        mEventToken = REMOVE_GROUP_MEMBER_HOVERCARD_EVENT_ID;

    ///////// API ///////////
    return {
        build: build,

        isShow: isShow,
        show: show,
        hide: hide,
        opacity: opacity,
        scrollbarWidth: scrollbarWidth,

        _show: _show, // FOR DEBUG
    }

    ///////// Implementation ////////
    function show( groupId ) {

        Service.$conversation.asyncGetUser( groupId, function( userList ) {
            _show( userList );
        } );
        
    }

    function _show( userList ) {
        var users = userList || [],
            html = '';
        
        // we build one if not exist
        if ( !( $( parentSelector ).find( '.group-members' ).length) ) build();

        $( groupMembersContainerSelector ).empty();
        $.each( users, function ( index, item ) {
            html += View.$groupMember.build( item ).getHTML();
        } );
        $( groupMembersContainerSelector ).append( html );

        // show with animation
        $( groupMembersSelector )
            .show()
            .animate( {
                opacity: 1.0,
                top: 48
            } , showDuration );

        // bind event
        bindEvent( users );
    }

    // @param groupId
    // @animate default is true
    function hide( groupId, animate ) {

        var $el = $( groupMembersSelector ),
            anim = ( typeof animate === 'boolean' ) ? animate : true,
            innerHide = function() {
                $el.hide();
                $( groupMembersContainerSelector ).empty();
                View.$groupMemberHovercard.remove();
            };
        
        if ( anim ) {
            $el.animate( {
                opacity: .0,
                top: 0
            }, showDuration, innerHide );
        } else {
            innerHide();
        }

    }

    function isShow() {
        var $el = $( groupMembersSelector );
        return $el.length !== 0 && $el.is( ':visible' );
    }

    function opacity( val ) {
        $( groupMembersSelector ).css( 'opacity', val );
    }

    // @return vertical scrollbar width
    function scrollbarWidth() {
        var hasScrollbar = $( groupMembersSelector ).height()
            + View.$sheetHeader.height()
            + Service.$tools.scrollbarWidth >= window.innerHeight;
        return hasScrollbar ? Service.$tools.scrollbarWidth : 0;
    }

    function build() {
        $( parentSelector ).append( buildContainer().getHTML() );
    }

    function bindEvent( users ) {
        if ( Service.$device.isMobileBrowser() ) {
            bindMobileEvent( users );
        } else {
            bindPCEvent( users );
        }
    }

    function bindMobileEvent( users ) {
        $( groupMembersSelectorAvatars )
            .on( 'click', function ( e ) {
                
                var userId = $( this ).attr( 'user_uuid' );

                View.$loading.show();
                Ctrl.$groupMembers.hide();
                Ctrl.$groupMembers.onMemberClicked( userId, function() {
                    View.$loading.hide();
                } );
                
            } );
    }

    function bindPCEvent( users ) {
        // bind `mouseover` event or `mouseleave` event
        $( groupMembersSelectorAvatars )
            .bind( 'mouseover', function ( e ) {
                e.stopImmediatePropagation();

                isMouseoverImg = true;
                Service.$task.cancel( mEventToken );

                var user = findUser( users, $( this ).attr( 'user_uuid' ) );
                View.$groupMemberHovercard.remove();
                View.$groupMemberHovercard.show( user, { e: e, el: $( this ) } );
            } )
            .bind( 'mouseleave', function ( e ) {
                isMouseoverImg = false;
            });

        $( groupMembersSelector )
            .bind( 'click', function ( e ) {
                !isMouseoverImg && View.$groupMemberHovercard.remove();
            } )
            .bind( 'mouseover', function ( e ) {
                if ( View.$groupMemberHovercard.isShow() && !View.$groupMemberHovercard.isMouseover() ) {
                    
                    Service.$task.plan( mEventToken , function() {
                        !isMouseoverImg &&
                            !View.$groupMemberHovercard.isMouseover() &&
                            View.$groupMemberHovercard.remove();
                    } );
                    
                }
                
            } );        
    }

    function buildContainer () {
        
        return new View.Div( {
            className: 'group-members'
        } )
            .add(new View.Div( {
                className: 'group-members-container'
            } ));
        
    }

    function findUser( users, userId ) {

        var user;
        $.each( users, function( index, item ) {
            if ( userId === item.user_uuid ) {
                user = item;
            }
        } );

        return user;
        
    }
    
})();
