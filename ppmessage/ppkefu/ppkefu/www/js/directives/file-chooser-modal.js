ppmessageModule.directive("yvFilechooserModal", [
    "$ionicModal",
    "$timeout",
    "FileChooser",
    "yvUploader",
function ($ionicModal, $timeout, FileChooser, yvUploader) {

    function _link($scope, $element, $attr) {
        $ionicModal.fromTemplateUrl('filechooser-modal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            $scope.modal = modal;
        });
        
        var filesStack = [];
        var fileChooser = new FileChooser();
        
        $scope.files = [];
        $scope.showProgress = false;
            
        fileChooser.onBeforeFileClick = function (filePath, isDirectory) {
            $timeout(function () {
                $scope.showProgress = true;
            });
        };
        fileChooser.onDirectoryFilesLoadComplected = function (result) {
            filesStack.push(result);
            _listFiles(result.files, result.folder, result.root);
        };
            
        fileChooser.fillDirectorys("");

        function _listFiles(files, dirEntry, root) {
            $timeout(function () {
                console.log('filechooser', files);
                $scope.files = files;
                $scope.showProgress = false;
                $scope.title = root ? "storage/" : "/storage" + dirEntry.fullPath;
            });
        }
        
        // on File Click
        $scope.onEntryClicked = function (fileEntry) {
            if (fileChooser) {
                if (fileEntry.isDirectory) {
                    fileChooser.fillDirectorys(fileEntry.fullPath.slice(1, fileEntry.fullPath.length - 1));
                } else {
                    //send file...
                    if (fileEntry.url) {
                        fileChooser.getFile(fileEntry.fullPath, function (file) {
                            yvUploader.send_file(file);
                        }, function (e) {
                            console.log(e);
                        });
                        $scope.closeModal();
                    }
                }
            }
        };

        $scope.closeModal = function () {
            $scope.modal.hide();
        };

        $scope.$on("event:show-filechooser-modal", function () {
            $scope.modal.show();
        });

        $scope.$on('$destroy', function () {
            $scope.modal.remove();
        });
    }

    return {
        restrict: "E",
        templateUrl: "templates/directives/filechoosermodal.html",
        link: _link
    };
}]);
