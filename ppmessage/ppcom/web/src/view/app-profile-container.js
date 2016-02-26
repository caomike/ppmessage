/**
 * 团队欢迎界面
 */
((function(View) {
    /**
     * item: 消息结构体
     */
    function AppProfileContainer(item) {
        var controller = new Ctrl.AppProfileContainerCtrl(item),
            self = this;
        
        View.PPDiv.call(this, 'pp-app-profile-container', controller);

        var appTeamName = controller.getAppTeamName();
        var appWelcomeText = controller.getWelcomeText();
        var activeAdmins = controller.getActiveAdmins();
        
        this.add(new View.PPDiv('pp-app-profile')
                 
                 .add(new View.PPDiv('pp-app-profile-activity')
                      .add(new View.PPDiv({
                          id: 'pp-app-profile-team',
                          'class': 'pp-app-profile-team pp-font pp-selectable'
                      }).text(appTeamName)))
                 
                 .add(self.appendActiveAdminsHtmlElements(activeAdmins))
                 
                 .add(new View.PPDiv({
                     id: 'pp-app-profile-text',
                     'class': 'pp-app-profile-text pp-font pp-selectable'
                 })
                      .add(new View.PPElement('p')
                           .text(appWelcomeText)))
                );
    }
    extend(AppProfileContainer, View.PPDiv);

    AppProfileContainer.prototype.appendActiveAdminsHtmlElements = function(activeAdmins) {
        var container = new View.PPDiv('pp-active-admins');
        activeAdmins && $.each(activeAdmins, function(index, item) {

            // if `item.user_uuid` is store in `Service.$users`,
            // then we try to get the user's info from `Service.$users`,
            // because user's info in `Service.$users` is always fresh.
            item = Service.$users.getUser( item.user_uuid ) &&
                Service.$users.getUser( item.user_uuid ).getInfo();
            
            container.add(new View.AppProfileContainerActiveAdmin( item )); 
        });
        return container;
    };

    View.AppProfileContainer = AppProfileContainer;
    
})(View));
