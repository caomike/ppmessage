angular.module("this_app")
    .controller("AboutCtrl", function($scope, $state, $timeout, yvAjax, yvUser) {

        var _init = function() {
            
        };
        
        _init();

        $scope.go_to_jobs = function() {
            $state.go('app.jobs');
        };
        
    }); // end about ctrl
