((function(Ctrl) {

    function AppProfileContainerCtrl(msgItem) {
        Ctrl.PPBaseCtrl.call(this);

        var welcome = msgItem.message.welcome;

        this.getAppTeamName = function() {
            return welcome.appTeamName;
        };

        this.getWelcomeText = function() {
            return welcome.appWelcomeText;
        };

        this.getActiveAdmins = function() {
            return welcome.activeAdmins;
        };
        
    }
    extend(AppProfileContainerCtrl, Ctrl.PPBaseCtrl);

    Ctrl.AppProfileContainerCtrl = AppProfileContainerCtrl;
    
})(Ctrl));
