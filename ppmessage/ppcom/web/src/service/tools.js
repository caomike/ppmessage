((function(Service) {

    function PPTools() {

        var self = this,

            iconTools = {
                get: function(fid) {
                    var url = self.getFileDownloadUrl(fid);
                    return url || Service.Constants.ICON_DEFAULT_USER;
                }
            };

        this.scrollbarWidth = getScrollBarWidth();
        
        this.getUUID = function() {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x7|0x8)).toString(16);
            });
            return uuid;
        };

        /*
         * is image
         *
         * @return is image
         */
        this.isImage = function(filePath) {
            var _isImage = false;
            if (filePath) {
                var dot = filePath.lastIndexOf('.');

                if (dot != -1 && dot != 0) {
                    //retrieve suffix
                    var suffix = filePath.substring(dot + 1);

                    // fix-bug: issue#4
                    if (suffix) {
                        suffix = suffix.toLowerCase();
                    }
                    
                    if (suffix == 'jpg' ||
                        suffix == 'jpeg' ||
                        suffix == 'png' ||
                        suffix == 'gif') {

                        _isImage = true;
                    }
                }
            }

            return _isImage;
        };

        // convert message to our inner message data structure
        this.messageAdapter = function(message) {
            return message;
        };

        /**
         * Get the message uploadId which messageType == 'FILE' || messageType == 'IMAGE'
         */
        this.getMessageUploadId = function(message) {
            var uploadId = '';
            switch(message.messageType) {
            case 'FILE':
                uploadId = message.message.file.fileUploadId;
                break;

            case 'IMAGE':
                uploadId = message.message.image.fileUploadId;
                break;
            }
            return uploadId;
        };

        /**
         * Check message send canceled or send errored.
         */
        this.isMessageSendError = function(message) {
            return message.messageState == 'ERROR' || message.messageState == 'CANCELED';
        };

        /**
         * Check message is uploading file
         */
        this.isUploading = function(message) {
            return message.messageState == "BEGIN_UPLOAD" ||
                message.messageState == "SENDING";
        };

        /*
         * Get file download url
         */
        this.getFileDownloadUrl = function(fid, fileName) {
            
            // fix bug
            // return http://192.168.0.216:8080/download/undefined
            if ( !fid ) return undefined;
            
            var isHttpLink = /(^https?:\/\/)|(^w{3})/.test(fid);
            var baseUrl =  isHttpLink ? fid : Configuration.file_download_url + fid;

            // Fix-bug : file url encoding error at http://www.qq.com/
            // @see http://redmine.ppmessage.cn/issues/232
            fileName && (baseUrl += "?file_name=" + Service.$gb2312utf8.GB2312ToUTF8( fileName ))
            return baseUrl;
        };

        /**
         * Is show emoji icon
         */
        this.isShowEmojiIcon = function() {
            return Service.$device.isMac();
        };

        /*
         * Get remote text file content
         */
        this.getRemoteTextFileContent = function(fid, callback, errorCallback) {
            var url = this.getFileDownloadUrl(fid);
            $.get(url, function(data) {
                if (callback) callback(data);
            }).fail(function() {
                if (errorCallback) errorCallback();
            });
        };

        //@param time: "yyyy-MM-dd HH:mm:ss SSSSS"
        this.getTimestamp = function(time) {
            //yyyy-MM-dd HH:mm:ss 为19
            if (time.length >= 19) {
                time = time.substring(0, 19);
            }
            var d = new Date(time.replace('-','/'));
            return d.getTime();
        };

        /**
         * 0 --> 00
         * 1 --> 01
         * 2 --> 02
         */
        this.padNumber = function(d) {
            return (d < 10) ? '0' + d.toString() : d.toString();
        };

        /**
         * formatTime
         *
         * Convert to timestamp in milliseconds to human-readable format
         *
         * @param timestampInMilliSeconds: messageTimestamp in milliseconds
         * @param config: for i18n
         * {
         *     year: 年,
         *     month: 月,
         *     day: "日",
         *     today: "今天",
         *     yesterday: "昨天",
         * }
         */
        this.formatTime = function(timestampInMilliSeconds, config) {
            var date = new Date(timestampInMilliSeconds);

            var year = date.getFullYear();
            var month = date.getMonth();
            var day = date.getUTCDate();
            var hour = date.getHours();
            var minute = date.getMinutes();

            var curDate = new Date();
            var curYear = curDate.getFullYear();
            var curMonth = curDate.getMonth();
            var curDay = curDate.getUTCDate();

            // console.log("now:", curDate, ", other:", date);

            var YEAR = config.year;
            var MONTH = config.month;
            var DAY = config.day;
            var TODAY = config.today;
            var YESTERDAY = config.yesterday;

            if (year == curYear && month == curMonth && day == curDay) {
                return TODAY + " " + self.padNumber(hour) + ":" + self.padNumber(minute);
            } else {                                    
                if (curDate.getTime() - date.getTime() <= 86400000) {
                    return YESTERDAY + " " + self.padNumber(hour) + ":" + self.padNumber(minute);
                }

                if (year < curYear) {
                    return year + YEAR + self.padNumber(month + 1) + MONTH + self.padNumber(day) + DAY + " " + self.padNumber(hour) + ":" + self.padNumber(minute);
                } else if (year == curYear) {
                    if (month <= curMonth) {
                        return self.padNumber(month + 1) + MONTH + self.padNumber(day) + DAY + " " + self.padNumber(hour) + ":" + self.padNumber(minute);
                    }
                }
            }
            
            return year + YEAR + self.padNumber(month + 1) + MONTH + self.padNumber(day) + DAY + " " + self.padNumber(hour) + ":" + self.padNumber(minute);
        };

        this.validateEmail = function(email) {
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            return re.test(email);
        };

        /**
         * '50px'-->'50'
         */
        this.cssNum = function(cssValue) {
            return parseFloat(cssValue);
        };

        // reverse array
        this.reverseArray = function(array) {
            if (!array || array.length === 0) return array;
            return array.reverse();
        };

        // ---------------
        // ICON TOOLS
        // ---------------
        this.icon = iconTools;

        this.isNull = function ( obj ) {
            return ( obj === null ) || ( obj === undefined );
        };
        
    }

    function getScrollBarWidth () {
        var $outer = $('<div>').css({visibility: 'hidden', width: 100, overflow: 'scroll'}).appendTo('body'),
            widthWithScroll = $('<div>').css({width: '100%'}).appendTo($outer).outerWidth();
        $outer.remove();
        return 100 - widthWithScroll;
    };

    Service.PPTools = PPTools;
    
})(Service));
