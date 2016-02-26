angular.module("this_app")
    .controller("ForgetCtrl", function($scope, $cookies, $state, $timeout, $translate, yvAjax, yvUser, yvConstants) {
        
        $scope.back = function() {
            window.history.back();
        };

        $scope.submit = function() {
            console.log("forget");
        };
        
    }); // end login ctrl
