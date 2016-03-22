/**
 * 用于向开发者提示(打印到console)错误信息
 *
 * API:
 * warn(): 使用console.warn() 打印警告信息
 * error(): 使用console.error() 打印错误信息
 *
 * Example:
 * new Service.ErrorHint().warn(10000);
 * new Service.ErrorHint().error(10001);
 *
 */
(function(Service) {

    /**
     * @constructor
     * 
     */
    function PPErrorHint() {
    }

    PPErrorHint.ERROR_ILLEGAL_APPUUID = 10000;
    PPErrorHint.ERROR_ILLEGAL_USER_EMAIL = 10001;
    PPErrorHint.ERROR_IE9_OR_LOWER_BROWSER = 10002;
    PPErrorHint.ERROR_SERVICE_NOT_AVALIABLE = 10003;
    PPErrorHint.ERROR_ILLEGAL_USER_EMAIL_STYLE = 10004;

    PPErrorHint._ERROR_INFO = {
        10000: 'appUuid not provide, Please check your appUuid and try again',
        10001: 'Can not find user by the user_email, please check your user_email and try again',
        10002: 'Can not run ppMessage on IE 9 or lower version browser',
        10003: 'Service not avaliable',
        10004: 'Not a valid user_email',
    };

    PPErrorHint.prototype._getErrorDescription = function(errorCode) {
        for (var key in PPErrorHint._ERROR_INFO) {
            if (key == errorCode) {
                return PPErrorHint._ERROR_INFO[key];
            }
        }
        return "";
    };

    PPErrorHint.prototype._getErrorLogDescription = function(errorCode) {
        return (typeof errorCode === 'number') ? ('PPMessage: [errorCode:' + errorCode + ", errorDescription:'" + this._getErrorDescription(errorCode) + "']") : errorCode;
    };

    /**
     * log warn info
     * param errorCode 错误代码
     */
    PPErrorHint.prototype.warn = function(errorCode) {
        window.console &&
            window.console.warn &&
            console.warn(this._getErrorLogDescription(errorCode));
    };

    /**
     * log error info
     */
    PPErrorHint.prototype.error = function(errorCode) {
        window.console &&
            window.console.error &&
            console.error(this._getErrorLogDescription(errorCode));
    };

    Service.ErrorHint = PPErrorHint;
    
}(Service));
