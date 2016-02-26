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

        $scope.showModal = function () {
            var title = "",
                fileChooser = null,
                filesStack = [];

            $scope.modal.show();
            $scope.showProgress = false;
            $scope.files = [];

            // page title
            $scope.getTitle = function () {
                return title;
            };

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

            // set page title
            function _setTitle(pageTitle) {
                console.log('setTitle:', pageTitle);
                title = pageTitle;
            }

            function _listFiles(files, dirEntry, root) {
                $timeout(function () {
                    console.log('filechooser', files);
                    $scope.files = files;
                    $scope.showProgress = false;

                    var _title = root ? "storage/" : "/storage" + dirEntry.fullPath;
                    _setTitle(_title);
                });
            }

            function _init() {
                fileChooser = new FileChooser();

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
            }

            _init();
        };

        $scope.closeModal = function () {
            $scope.modal.hide();
        };

        $scope.$on("event:show-filechooser-modal", function () {
            $scope.showModal();
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
