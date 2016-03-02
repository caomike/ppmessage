ppmessageModule.factory('yvNav', [
    "$ionicHistory",
    "$timeout",
    "$state",
    "yvSys",
    "yvUser",
    "yvConstants",
function ($ionicHistory, $timeout, $state, yvSys, yvUser, yvConstants) {

    return {        
        go_back: function (_depth) {
            var historyId = $ionicHistory.currentHistoryId(),
            history = $ionicHistory.viewHistory().histories[historyId],
            targetViewIndex = history.stack.length - 1 - _depth;

            $ionicHistory.backView(history.stack[targetViewIndex]);
            $ionicHistory.goBack();
        },

        return_to: function (_name) {
            var historyId = $ionicHistory.currentHistoryId(),
            history = $ionicHistory.viewHistory().histories[historyId],
            i = history.stack.length - 1;

            for (i; i >= 0; i--) {
                if (history.stack[i].stateName === _name) {
                    $ionicHistory.backView(history.stack[i]);
                    $ionicHistory.goBack();
                }
            }
        },

        clear: function (cb) {
            $timeout(function () {
                $ionicHistory.clearHistory();
                $ionicHistory.clearCache().then(cb);
            });
        },

        disable_next: function () {
            $ionicHistory.nextViewOptions({
                disableAnimate: true,
                disableBack: true
            });
        },

        login_no_user: function () {
            this.disable_next();
            $state.go("noapp.login-no-user");
        },

        login_with_user: function (user) {
            this.disable_next();
            if (arguments.length === 0 || !user) {
                user = yvUser.get();
            }
            if (!user.email) {
                return this.login_no_user();
            }
            
            $state.go("noapp.login-with-user", {
                "icon": user.icon,
                "email": user.email,
                "fullname": user.fullname
            });
        },

        go_conversation_list: function () {
            this.disable_next();
            var state = "app.conversation-list";
            if (yvSys.in_mobile()) {
                state = "app.conversation-list-mobile";
            }
            $timeout(function () {
                $state.go(state);
            });
        },
        
        exit_app: function (should_reset) {
            this.disable_next();
            if (should_reset) {
                $state.go("noapp.main-with-logo");
                return;
            }
            this.login_with_user();
            return;
        }
    };

}]);
