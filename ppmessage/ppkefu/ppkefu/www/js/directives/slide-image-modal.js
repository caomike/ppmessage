ppmessageModule.directive("yvSlideImageModal", [
    "$ionicModal",
    "$ionicSlideBoxDelegate",
    "yvLink",
function ($ionicModal, $ionicSlideBoxDelegate, yvLink) {
    
    var _ctrl = function($scope, $element, $transclude) {

        $scope.show_progress = false;
        $scope.hide = {bars: false};
        
        $ionicModal.fromTemplateUrl('slide-image-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.slideImageModal = modal;
        });
        
        $scope.showModal = function() {
            $scope.hide.bars = false;
            $scope.slideImageModal.show();
        };
        
        $scope.closeModal = function(event) {
            $scope.hide.bars = true;
            $scope.slideImageModal.hide();
        };
        
        $scope.goToSlide = function(index) {
            $scope.imageModal.show();
            $ionicSlideBoxDelegate.slide(index);
        }
        
        // Called each time the slide changes
        $scope.slideChanged = function(index) {
            $scope.slideIndex = index;
        };
        
        $scope.$on("event:show-slide-image-modal", function() {
            //$ionicSlideBoxDelegate.slide(0);         
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
            $scope.slideImageModal.remove();
        });
        
    };
    
    return {
        restrict: "E",
        scope: {
            collection: "=",
        },
        templateUrl: "templates/directives/slideimagemodal.html",
        link: function($scope, $element, $attr) {
        }, //end link
        controller: _ctrl,
    };
    
}]);
