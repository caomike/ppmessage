ppmessageModule.directive("yvCardModal", [
    "$ionicModal",
    "yvLink",
function ($ionicModal, yvLink) {
    
    var _ctrl = function($scope, $element, $transclude) {
        
        $ionicModal.fromTemplateUrl('card-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.cardModal = modal;
        });
        
        $scope.showModal = function() {
            $scope.cardModal.show();
        };
        
        $scope.closeModal = function(event) {
            yvLink.open_link(event, function() {
                $scope.cardModal.hide();
            });
        };

        $scope.$on("event:show-card-modal", function() {
            $scope.showModal();
        });
        
        $scope.$on("modal.shown", function(event, modal) {
            ;
        });
        
        $scope.$on("modal.hidden", function(event, modal) {
            ;
        });

        $scope.$on("modal.removed", function(event, modal) {
            ;
        }); 

        $scope.$on('$destroy', function() {
            $scope.cardModal.remove();
        });
        
    };
    
    return {
        restrict: "E",
        scope: {
            content: "=",
        },
        templateUrl: "templates/directives/cardmodal.html",
        link: function($scope, $element, $attr) {
        }, //end link
        controller: _ctrl,
    };
    
}]);
