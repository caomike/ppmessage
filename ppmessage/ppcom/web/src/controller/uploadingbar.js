((function(Ctrl) {

    function PPUploadingBarCtrl() {
        Ctrl.PPBaseCtrl.call(this);

        var _updateWidth = function(fileUploadId) {
            var w = Service.$fileUploader.getUploadProgress(fileUploadId);
            if (w < 0) {
                return;
            }
            if (w <= 100) {
                $('#pp-uploading-bar-state-' + fileUploadId).css('width', w + "%");
                $timeout(function() {
                    _updateWidth(fileUploadId);
                }, 100);
            }
        };
        
        this.init = function(data, fileUploadId) {

        };

        this.onUploadingBarRemoveBtnClicked = function(fileUploadId, data) {
            Service.$uploader.cancel(fileUploadId);
        };
    }
    extend(PPUploadingBarCtrl, Ctrl.PPBaseCtrl);

    Ctrl.PPUploadingBarCtrl = PPUploadingBarCtrl;
    
})(Ctrl));
