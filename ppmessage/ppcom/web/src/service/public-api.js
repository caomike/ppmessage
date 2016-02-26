((function(Service) {

    function PublicAPI() {
        this._booted = false;
        this._onShowEvent = null;
        this._onHideEvent = null;
    }

    /**
     * Clear all datas
     *
     */
    PublicAPI.prototype._clearData = function() {
        Service.$uploader.clear();
        Service.$notification.reset();
    };

    /**
     * @param ppSettings
     * @param callback: 
     *     success: function(true)
     *     fail: function(false, errorCode);
     */
    PublicAPI.prototype.boot = function(ppSettings, callback) {
        if (!ppSettings) {
            return;
        }
        if (this._booted) {
            return;
        }

        this._booted = true;
        var that = this;

        Service.$startUp.startUp(ppSettings, function() {
            that._booted = true;
            if ($.isFunction(callback)) callback(true);
        }, function(errorCode) {
            that._booted = false;
            that._clearData();
            Service.$errorHint.warn(errorCode);
            if ($.isFunction(callback)) callback(false, errorCode);
        });
    };

    PublicAPI.prototype.show = function() {
        if (!this._booted) {
            return;
        }

        var launcherCtrl = Ctrl.$launcher.get();
        if (launcherCtrl) {
            launcherCtrl.showMessageBox(true);
            if (this._onShowEvent && typeof this._onShowEvent === 'function') {
                this._onShowEvent();
            }
        }
    };

    PublicAPI.prototype.hide = function() {
        if (!this._booted) {
            return;
        }
        
        var sheetHeaderCtrl = Ctrl.$sheetheader;
        if (sheetHeaderCtrl) {
            sheetHeaderCtrl.minimize();

            if (this._onHideEvent && typeof this._onHideEvent === 'function') {
                this._onHideEvent();
            }
        }
    };

    PublicAPI.prototype.onShow = function(event) {
        this._onShowEvent = event;
    };

    PublicAPI.prototype.onHide = function(event) {
        this._onHideEvent = event;
    };

    PublicAPI.prototype.shutdown = function() {
        if (!this._booted) {
            return;
        }
        $('#pp-container').remove();
        this._booted = false;
        this._clearData();
    };

    PublicAPI.prototype.update = function(ppSettings) {
        if (!this._booted) {
            return false;
        }
        
        var s = ppSettings;
        var api = Service.$api;
        var user = Service.$user.getUser();
        
        if (s && user
            && s.app_key == api.getAppKey()
            && s.app_secret == api.getAppSecret()
            && s.user_email == user.getInfo().user_email) {
            return false;
        }

        return true;
    };

    Service.PublicAPI = PublicAPI;
    
})(Service));
