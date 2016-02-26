/**
 * 根据 ppSettings.view 来配置和管理 View
 *
 * Example:
 * 
 * var viewSettings = new View.PPSettings().init(ppSettings);
 * viewSettings.getLauncherBottomMargin();
 * viewSettings.getLauncherRightMargin();
 * viewSettings.isShowLauncher();
 *
 */
((function(View) {

    function PPSettings() {
        this._ppSettings = null;
    }

    PPSettings.DEFAULT_BOTTOM_MARGIN = "20px";
    PPSettings.DEFAULT_RIGHT_MARGIN = "20px";

    /**
     * Do not forget to init ppSettings
     */
    PPSettings.prototype.init = function(ppSettings) {
        this._ppSettings = ppSettings;
        return this;
    };

    /**
     * 右下角距离网页底部边缘距离，默认20px
     */
    PPSettings.prototype.getLauncherBottomMargin = function() {
        return this._getValueFromPPSettingsView('launcher_bottom_margin', PPSettings.DEFAULT_BOTTOM_MARGIN);
    };

    /**
     * 右下角距离网页右侧边缘距离，默认20px
     */
    PPSettings.prototype.getLauncherRightMargin = function() {
        return this._getValueFromPPSettingsView('launcher_right_margin', PPSettings.DEFAULT_RIGHT_MARGIN);
    };

    /**
     * `PP`加载的时候，是否默认显示小泡
     */
    PPSettings.prototype.isShowLauncher = function() {
        return this._getValueFromPPSettingsView('launcher_is_show', true);
    };

    /**
     * 从 `_ppSettings.view` 中取得`key`的值，如果为空的话，那么用`defaultValue`来替代
     */
    PPSettings.prototype._getValueFromPPSettingsView = function(key, defaultValue) {
        var value = defaultValue;
        if (this._ppSettings && this._ppSettings.view && key in this._ppSettings.view) {
            value = this._ppSettings.view[key];
        }
        return value;
    };

    View.PPSettings = PPSettings;
    
})(View));
