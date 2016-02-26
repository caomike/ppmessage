((function(View) {

    /**
     * @constructor
     */
    function PPUploadingBar(item) {
        var ctrl = new Ctrl.PPUploadingBarCtrl();

        var id = "";
        switch(item.messageType) {
        case 'FILE':
            id = item.message.file.fileUploadId;
            break;

        case 'IMAGE':
            id = item.message.image.fileUploadId;
            break;
        }
        
        View.PPElement.call(this, 'span', {
            id: 'pp-uploading-bar-outer-' + id,
            'class': 'pp-uploading-bar-outer pp-font'
        }, ctrl);

        this.text(Service.Constants.i18n('UPLOADING_HINT'));
        
        this.add(new View.PPDiv({
            id: 'pp-uploading-bar-' + id,
            'class': 'pp-uploading-bar'
        })
                 .add(new View.PPDiv({
                     id: 'pp-uploading-bar-state-' + id,
                     'class': 'pp-uploading-bar-state'
                 })))
            .add(new View.PPElement('span', {
                id: 'pp-uploading-bar-remove-' + id,
                'class': 'pp-uploading-bar-remove',
                style: 'background-image:url(' + Configuration.assets_path + 'img/icon-upload-remove.png)',
                event: {
                    click: function() {
                        ctrl.onUploadingBarRemoveBtnClicked(id, item);
                    }
                }
            }));

        setTimeout(function() {
            ctrl.init(item, id);
        });
    }
    extend(PPUploadingBar, View.PPElement);

    View.PPUploadingBar = PPUploadingBar;
    
})(View));
