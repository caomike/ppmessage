ppmessageModule.directive('hideTabBar', [
    "$state",
    "$timeout",
    "yvSys",
function ($state, $timeout, yvSys) {
    function _compile(element, attr) {
        var tabBar = document.querySelector('.tab-nav');
        var tabState = ["app.conversation-list-mobile", "app.contact-list-mobile", "app.setting-list-mobile"];

        function isTabState() {
            var state = $state.current.name;
            return (tabState.indexOf(state) != -1);
        }
        
        return function ($scope, $element, $attr) {
            if (!yvSys.in_mobile()) {
                return;
            }
            var scroll = $element[0].querySelector('.scroll-content');
            $scope.$on('$ionicView.beforeLeave', function () {
                if (isTabState()) { return; }
                tabBar.classList.add('slide-away');
                // scroll.classList.add('no-tabs');
            });
            $scope.$on('$ionicView.beforeEnter', function () {
                tabBar.classList.remove('slide-away');
                // scroll.classList.remove('no-tabs');
            });
        };
    }

    return {
        restrict: 'A',
        compile: _compile
    };
}]);
