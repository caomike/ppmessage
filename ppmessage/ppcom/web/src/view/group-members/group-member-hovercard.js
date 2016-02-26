View.$groupMemberHovercard = (function() {

    var globalSelector = '.pp-container',
        parentSelector = '#pp-conversation-container',
        hovercardClassName = 'group-member-hovercard',
        elSelector = globalSelector + ' .' + hovercardClassName,
        textareaElSelector = elSelector + ' textarea',
        bodyElSelector = elSelector + ' .body',
        textareaContainerElSelector = elSelector + ' .textarea-container',

        HOVERCARD_HEIGHT = 156, // default hovercard height
        HOVERCARD_TOP_OFFSET = 60, // height of `img`

        mouseover = false; // mouse `over` or `leave` on current hovercard ? 

    /////// API ////////////
    
    return {
        show: show,
        remove: remove,
        isShow: isShow,
        isMouseover: isMouseover
    }

    // @param user:
    // {
    //     user_fullname: xxx,
    //     user_uuid: xxx,
    //     user_signature: xxx,
    //     user_avatar: xxxxxx
    // }
    // @param config:
    // {
    //     e: `mouseevent`,
    //     el: `jQuery element`
    // }
    function show( user, config ) {

        var position = calcHovercardPosition( config );
        
        $( parentSelector ).append( build( user, position ).getHTML() );

        // bind event on show
        bindHovercardEvent( user, position );
    }

    function remove() {
        isShow() && $( elSelector ).detach();
        unbindHovercardEvent();
        mouseover = false;
    }

    function isShow() {
        return $( elSelector ).length > 0;
    }

    // GroupMemberHovercard.Views
    ////////////////////////////

    function build( memberInfo, position ) {
        
        var hoverCard = new GroupMemberHovercard( memberInfo, position );
        hoverCard
            .add( buildBody( memberInfo ) )
            .add( buildTextarea( memberInfo ) )
            .add( buildPseudoStyle( position.direction, position.arrowRight ) );

        bindHovercardEvent( memberInfo, position );

        return hoverCard;
    }

    function buildBody( memberInfo ) {
        return new View.Div({
            className: 'body'
        })
            .add( buildUserAvatar( memberInfo ) )
            .add( buildUserInfo( memberInfo ) );
    }

    function buildUserAvatar( memberInfo ) {

        var avatar = memberInfo.user_avatar;

        return new View.Div({
            className: 'img-container'
        }).add(new View.Img({
            src: avatar
        }));
        
    }

    function buildUserInfo( memberInfo ) {

        var name = memberInfo.user_fullname,
            signature = memberInfo.user_signature;

        return new View.Div({
            className: 'info'
        }).add(new View.Div({
            className: 'name'
        }).text( name ))
            .add(new View.Div({
                className: 'signature'
            }).text( signature ));
        
    }

    function buildTextarea( memberInfo ) {
        var placeHolder = Service.Constants.i18n('HOVER_CARD_TEXTAREA_HINT');

        return new View.Div({
            className: 'textarea-container'
        }).add(new View.Element('textarea', {
            placeholder: placeHolder
        }));
    }

    //GroupMemberHovercard.Views.CssStyle
    /////////////////////////////////////

    // @param direction: 'up'/'down'
    // @param right: arrow right margin, 'number' type
    function buildPseudoStyle( direction, right ) {
        var style = new View.Element('style', {
            type: 'text/css',
            className: hovercardClassName + '-style'
        });

        var arrowStyle;

        switch ( direction ) {
        case 'up':
            arrowStyle = getArrowUpStyle( right );
            break;

        case 'down':
            arrowStyle = getArrowDownStyle( right );
            break;
        }

        style.text( arrowStyle );

        return style;
    }

    function getArrowUpStyle ( right ) {
        return '.pp-container .group-member-hovercard:after, .pp-container .group-member-hovercard:before{' +
            'top: -16px;' + 
            'right: ' + right + 'px;' + 
            'border: solid transparent;content: " ";height: 0;width: 0;position: absolute;pointer-events: none;}' + 
            '.pp-container .group-member-hovercard:before {border-color: rgba(204,204,204,0);border-bottom-color: rgba(0,0,0,0.07);border-width: 9px;margin-left: -5px;top: -18px;}' + 
            '.pp-container .group-member-hovercard:after {border-color: rgba(250,250,251,0);border-bottom-color: #fff;border-width: 9px;margin-left: -6px;}';
    }

    function getArrowDownStyle ( right ) {
        return '.pp-container .group-member-hovercard:after, ' +
            '.pp-container .group-member-hovercard:before{' +
            'top:100%;' +
            'right:' + right + 'px;' +
            'border: solid transparent;content: " ";height: 0;width: 0;position: absolute;pointer-events: none;}' +
            '.pp-container .group-member-hovercard:before{' +
            'border-color: rgba(204, 204, 204, 0);' +
            'border-top-color: rgba(0, 0, 0, 0.14);border-width: 9px;margin-left: -6px;}' +
            '.pp-container .group-member-hovercard:after {border-color: rgba(250, 250, 251, 0);border-top-color: #fafafb;border-width: 8px;margin-left: -5px;right:' +
            ( right + 1 ) + 'px;' +
            '}';
    }

    //GroupMemberHovercard.Position
    ////////////////////////////////
    
    // @param `config` {
    //     e: `mouseevent`,
    //     el: `jQuery element`
    // }
    //
    // @return {
    //     direction: arrow direction
    //     top: hovercard top margin relative to the window top edge
    //     arrowRight: arrow right margin relative to the window right edge
    // }
    function calcHovercardPosition( config ) {

        var windowHeight = window.innerHeight,
            upEdgeDistance = config.el.offset().top - $( window ).scrollTop(),
            downEdgeDistance = ( windowHeight - upEdgeDistance ),
            hovercardHeight = HOVERCARD_HEIGHT,
            hovercardOffsetY = HOVERCARD_TOP_OFFSET;

        if ( downEdgeDistance - hovercardOffsetY >= hovercardHeight ) {
            return {
                direction: 'up',
                top: upEdgeDistance + hovercardOffsetY,
                arrowRight: calcArrowRight( config.e )
            };
        }

        return {
            direction: 'down',
            top: ( upEdgeDistance - hovercardHeight ),
            arrowRight: calcArrowRight( config.e )
        }
        
    }

    function calcArrowRight( mouseEvent ) {
        var IMG_WIDTH = 64,
            HALF_IMG_WIDTH = 64 / 2,

            // @see http://stackoverflow.com/questions/6073505/what-is-the-difference-between-screenx-y-clientx-y-and-pagex-y
            // `screenX` and `screenY`: Relative to the top left of the physical screen/monitor, this reference point only moves if you increase or decrease the number of monitors or the monitor resolution.
            // `clientX` and `clientY`: Relative to the upper left edge of the content area (the viewport) of the browser window. This point does not move even if the user moves a scrollbar from within the browser.
            marginRight = $( window ).width() - mouseEvent.clientX - IMG_WIDTH,
            fix = HALF_IMG_WIDTH - mouseEvent.offsetX;

        // number `5` is a magic number that let `hovercard` a little closer from right
        return marginRight - fix - 5;
    }

    //GroupMemberHovercard.Event
    ////////////////////////////
    function bindHovercardEvent( memberInfo, position ) {

        $( textareaElSelector )
            .on( 'focus', function( e ) {
                // `onMemberClicked` event will break the transition animation
                // so must make `onMemberClicked` triggerd after the animation transition completed
                smoothTransitionToMessagePanel( position, function() {
                    Ctrl.$groupMembers.onMemberClicked( memberInfo.user_uuid );    
                } );
            } );

        $( elSelector )
            .on( 'mouseover', function ( e ) {
                mouseover = true;                
            } )
            .on( 'mouseleave', function ( e ) {
                mouseover = false;
            } );
        
    }

    function unbindHovercardEvent() {
        $( textareaElSelector ).off( 'focus' );
        $( elSelector ).off( 'mouseover' ).off( 'mouseleave' );
    }

    function smoothTransitionToMessagePanel( position, completeCallback ) {

        var textareaHeight = 46,
            fixTextareaPaddingBottom = 18,
            textareaTargetHeight = 40,
            textareaTargetMargin = 10,
            bodyHeight = 100,
            messagePanelWidth = 368,
            duration = 300,
            sheetHeaderHeight = 50,
            windowHeight = window.innerHeight,
            hovercardTargetHeight = windowHeight - sheetHeaderHeight,
            marginTop = ( $( elSelector ).offset().top - sheetHeaderHeight - $( window ).scrollTop() ) +
            ( windowHeight - ( $( textareaElSelector ).offset().top - $( window ).scrollTop() ) ) -
            ( bodyHeight - textareaHeight ) -
            fixTextareaPaddingBottom;

        $( elSelector )
            .animate( {
                width: messagePanelWidth,
                height: hovercardTargetHeight,
                left: 0,
                top: sheetHeaderHeight
            }, duration );

        $( bodyElSelector )
            .animate( {
                opacity: .0
            }, duration );

        $( textareaElSelector )
            .animate( {
                height: textareaTargetHeight
            } );

        $( textareaContainerElSelector )
            .animate( {
                height: textareaTargetHeight,
                'margin-top': marginTop,
                'margin-left': textareaTargetMargin,
                'margin-right': textareaTargetMargin
            }, duration, function () {

                View.$groupMembers.opacity( .0 );
                
                $( elSelector ).animate( {
                    opacity: .0
                }, duration, function () {
                    
                    Ctrl.$groupMembers.hide( false );
                    View.$composerContainer.focus();

                    $onResult( undefined, completeCallback );
                    
                });
                
            });

    }

    function isMouseover() {
        return mouseover;
    }

    //GroupMemberHovercard
    ////////////////////////
    function GroupMemberHovercard( memberInfo, position ) {
        View.Div.call(this, {
            className: hovercardClassName,
            style: 'top:' + position.top + 'px'
        });
    }
    extend( GroupMemberHovercard, View.Div );
    
})();
