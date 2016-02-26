/**
 * 鼠标放到小图标上面，弹出的卡片
 */
View.$hoverCard = (function() {

    // View
    function HoverCard() {
        var controller = Ctrl.$hoverCard.get();
        
        View.PPDiv.call(this, { //parent-container
            'class': 'pp-launcher-hovercard',
            id: 'pp-launcher-hovercard',
            style: 'display:none; transform-origin: 315px 100% 0px; transform: translate(0px 0px) scale(0.8, 0.8); opacity:0;',
            event: {
                mouseover: function() {
                    controller.onMouseOver();
                },
                mouseleave: function() {
                    controller.onMouseLeave();
                },
                click: function() {
                    controller.onHoverCardClicked();
                },
                init: function() {
                    controller.onHoverCardInit();
                }
            }
        }, controller);
    }
    extend(HoverCard, View.PPDiv);

    return {
        
        build: function() {
            return new HoverCard();
        },

        smoothTranisationToMessagePanel: function() {
            var duration = 300,
                windowHeight = window.innerHeight,

                conversationSelector = '#pp-conversation',
                welcomeSelector = '#pp-launcher-hovercard-welcome',
                textareaContainerSelector = '#pp-launcher-hovercard-textarea',
                hovercardSelector = '#pp-launcher-hovercard',
                ppMessageSelector = '#pp-messenger';

            $(conversationSelector)
                .removeClass('pp-conversation-content-maximize')
                .removeClass('pp-conversation-sheet-minimized');

            $(conversationSelector).css({boxShadow: "none"});
            
            $(welcomeSelector)
                .animate({ opacity: 0, marginBottom: "+=100"}, {duration: 100});

            $(textareaContainerSelector)
                .animate({paddingBottom: '31'}, {duration: duration});
            
            $(hovercardSelector)
                .css({ border: "none", borderLeft: "1px solid #dadee2"})
                .animate({ width: 368, paddingTop: windowHeight, borderRadius: 0, right: -20, bottom: -19}, {duration: duration});
            
            $(ppMessageSelector)
                .css({ opacity: 0.0, display: 'block'})
                .delay(duration)
                .animate({ opacity: 1.0}, {duration: 0, complete: function() {
                    $(welcomeSelector).removeAttr('style');
                    $(textareaContainerSelector).removeAttr('style');
                    $(hovercardSelector).removeAttr('style').hide();
                    $(ppMessageSelector).removeAttr('style');
                    $(conversationSelector).css({boxShadow: ""});
                }});
        }
    }
    
})();
