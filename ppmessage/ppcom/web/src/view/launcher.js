View.$launcher = (function() {

    /**
     * @constructor
     */
    function PPLauncher() {
        var ctrl = Ctrl.$launcher.get(),
            showLauncher = ctrl.shouldShowLauncherWhenInit(),
            PPDiv = View.PPDiv;
        
        PPDiv.call(this, {
            id: 'pp-launcher',
            'class': 'pp-launcher'
        }, ctrl);
        
        var self = this;
        var launcherButtonImageCssStyle = 'background-image: url(' + Configuration.assets_path + 'img/icon-newacquire.png);' + 'background-color:' + View.Style.Color.launcher_background_color;

        var bottomMargin = ctrl.getLauncherBottomMargin(),
            rightMargin = ctrl.getLauncherRightMargin(),
            style = 'bottom:' + bottomMargin + "; right:" + rightMargin;
        
        this.add(new PPDiv({
            id: 'pp-launcher-container',
            style: style,
            event: {
                init: function() {
                    ctrl.onLauncherInit();
                }
            }
        }, ctrl)
                 .add(new PPDiv('pp-launcher-button-container')
                      .add(new PPDiv({
                          id: 'pp-launcher-button',
                          'class': 'pp-launcher-button pp-unselectable',
                          style: launcherButtonImageCssStyle,
                          event: {
                              click: function() {
                                  self.controller.onClickEvent();
                              },
                              mouseover: function() {
                                  self.controller.onMouseOverEvent();
                              },
                              mouseleave: function() {
                                  self.controller.onMouseLeaveEvent();
                              }
                          }
                      })))
                 .add(new PPDiv({
                     id: 'pp-launcher-badge',
                     'class':'pp-launcher-badge pp-font',
                     style: 'display:none'
                 }, ctrl))
                 .add(View.$launcherPreview.init().build())
                 .add(View.$hoverCard.build()))
            .show(showLauncher);
    }
    extend(PPLauncher, View.PPDiv);

    var selectorButton = '#pp-launcher-button',
        clsButtonMaximize = 'pp-launcher-button-maximize',
        clsButtonMinimize = 'pp-launcher-button-minimized',

        selectorButtonContainer = '#pp-launcher-button-container',
        clsButtonContainerActive = 'pp-launcher-button-container-active',
        clsButtonContainerInActive = 'pp-launcher-button-container-inactive',

        build = function() {
            return new PPLauncher();
        },

        hideLauncher = function() {
            $( selectorButton ).removeClass( clsButtonMaximize ).addClass( clsButtonMinimize );
            $( selectorButtonContainer ).removeClass( clsButtonContainerActive ).addClass( clsButtonContainerInActive );
        },

        showLauncher = function() {
            $( selectorButton ).removeClass( clsButtonMinimize ).addClass( clsButtonMaximize );
            $( selectorButtonContainer ).removeClass( clsButtonContainerInActive ).addClass( clsButtonContainerActive );
        },
        
        showMessageBox = function() {
            View.$launcherPreview.text( '' ).hide();
            $('#pp-messenger').show();
            View.$conversation.show();
            Ctrl.$hoverCard.get().hideHoverCardNow();
        };
    
    return {
        build: build,

        hideLauncher: hideLauncher,
        showLauncher: showLauncher,
        showMessageBox: showMessageBox
    }
    
})();
