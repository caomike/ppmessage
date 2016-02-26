((function(Service) {

    function PPConstants() {
    }

    PPConstants.ICON_DEFAULT_LAUNCHER = Configuration.assets_path + "img/logo_1.png";
    PPConstants.DEFAULT_HEADER_TITLE = "PPMessage";

    //USER
    PPConstants.ICON_DEFAULT_USER = Configuration.assets_path + "img/logo_1.png";
    PPConstants.USER_DEFAULT_NAME = 'Anonymous';

    PPConstants.STYLE = {
        EMOJI_PANEL_DEFAULT_BOTTOM_MARGIN: 67
    };

    PPConstants.EVENT = {
        NEW_MESSAGE_ARRIVED: "message:NEW_ARRIVED",
        ON_TEXTAREA_HEIGHT_CHANGED: "textarea:height-change"
    };

    PPConstants.MESSAGE = {
        TYPE_TEXT: 'TEXT',
        TYPE_EMOJI: 'EMOJI',
        TYPE_IMAGE: 'IMAGE',
        TYPE_FILE: 'FILE',
        TYPE_WELCOME: 'WELCOME',
        TYPE_TIMESTAMP: 'TIMESTAMP',

        TO_TYPE: "P2S",

        TEXT_MAX_LEN: 128
    };

    PPConstants.MAX_UPLOAD_SIZE = 41943040; //40MB
    PPConstants.MAX_UPLOAD_SIZE_STR = "40MB";

    PPConstants.MESSAGE_TYPE = {
        NOTI: "NOTI",
        SYS: "SYS"
    };

    PPConstants.FILE = {
        ROOT: "PP"
    };

    PPConstants.MESSAGE_SUBTYPE = {
        AUDIO:  "AUDIO",
        VIDEO:  "VIDEO",
        DOCUMENT: "DOCUMENT",
        FILE:   "FILE",
        TEXT:   "TEXT",
        IMAGE:  "IMAGE",
        SINGLE_CARD:   "SINGLE_CARD",
        MULTIPLE_CARD: "MULTIPLE_CARD",
        TXT:    "TXT",
        MENU:   "MENU",
        EVENT:  "EVENT",
        GPS_LOCATION: "GPS_LOCATION",
        INVITE_CONTACT: "INVITE_CONTACT",
        ACCEPT_CONTACT: "ACCEPT_CONTACT",
        REMOVE_CONTACT: "REMOVE_CONTACT",
        DG_INVITED: "DG_INVITED",
        DG_REMOVED: "DG_REMOVED",
        REQUEST_JOIN_OG: "REQUEST_JOIN_OG",
        APPROVE_JOIN_OG: "APPROVE_JOIN_OG",
        LOGOUT: "LOGOUT"
    };

    PPConstants.I18N = {
        'zh-CN': {
            START_CONVERSATION_HINT: '\u6309\u201c\u56de\u8f66\u952e\u201d\u53d1\u9001',
            START_CONVERSATION_MOBILE_HINT: '',
            ERROR_TEXT_TOO_LONG: '\u5b57\u6570\u592a\u957f',
            WELCOME_MSG: '\u60a8\u597d\uff0c\u8bf7\u95ee\u6709\u4ec0\u4e48\u53ef\u4ee5\u5e2e\u52a9\u60a8\u7684\uff1f',
            CLOSE_BUTTON_HINT: '\u7ed3\u675f\u4f1a\u8bdd',
            MINIZE_BUTTON_HINT: '\u6700\u5c0f\u5316',
            MAXIMUM_UPLOAD_SIZE_HINT: '\u6700\u5927\u6587\u4ef6\u5927\u5c0f\u4e3a',
            PPMESSAGE: '\u76ae\u76ae\u6d88\u606f',
            HOVER_CARD_TEXTAREA_HINT: '\u5f00\u59cb\u5bf9\u8bdd',
            DEFAULT_SERVE_NAME: '\u5ba2\u670d',
            UPLOADING_HINT: '\u6b63\u5728\u4e0a\u4f20',
            SEND: '\u53d1\u9001',

            LOAD_HISTORY_HINT: '\u70b9\u51fb\u52a0\u8f7d\u5386\u53f2\u6d88\u606f',
            LOAD_HISTORY_MOBILE_HINT: '\u4e0b\u62c9\u52a0\u8f7d\u5386\u53f2\u6d88\u606f',
            LOADING_HISTORY: '\u6b63\u5728\u52a0\u8f7d...',
            NO_MORE_HISTORY: '\u6ca1\u6709\u66f4\u591a\u5386\u53f2\u6d88\u606f',

            IMAGE: '\u56fe\u7247',
            FILE: '\u6587\u4ef6',
            AUDIO: '\u8bed\u97f3',

            SEND_ERROR: '\u53d1\u9001\u5931\u8d25',
            SERVICE_NOT_AVALIABLE: '\u670d\u52a1\u4e0d\u53ef\u7528',
            CANCELED: '\u5df2\u53d6\u6d88',

            CLOSE: '\u5173\u95ed',

            CONSULT_WORKING_TIME: '\u670d\u52a1\u65f6\u95f4',
            CONTACT_NUMBER: '\u8054\u7cfb\u7535\u8bdd',

            ONLINE: '\u5728\u7ebf',
            OFFLINE: '\u79bb\u7ebf',

            SYSTEM_MSG: '\u7cfb\u7edf\u6d88\u606f',

            TYPING: '\u5bf9\u65b9\u6b63\u5728\u8f93\u5165...',

            AUDIO_PLAY_ERROR: '\u64ad\u653e\u5931\u8d25',
            
            timeFormat: function(timestampInMilliSeconds) {
                return Service.$tools.formatTime(timestampInMilliSeconds, {
                    year: "\u5e74",
                    month: "\u6708",
                    day: "\u65e5",
                    today: "\u4eca\u5929",
                    yesterday: "\u6628\u5929"
                });
            }
        },
        'en': {
            START_CONVERSATION_HINT: 'Press "Enter key" to send',
            START_CONVERSATION_MOBILE_HINT: '',
            ERROR_TEXT_TOO_LONG: 'Text is too long',
            WELCOME_MSG: 'Hello, what can I do for you ?',
            CLOSE_BUTTON_HINT: 'Close Conversation',
            MINIZE_BUTTON_HINT: 'Minimization',
            MAXIMUM_UPLOAD_SIZE_HINT: 'The maximum upload size is ',
            PPMESSAGE: 'PPMessage',
            HOVER_CARD_TEXTAREA_HINT: 'Start a conversation',
            DEFAULT_SERVE_NAME: 'Service',
            UPLOADING_HINT: 'Uploading',
            SEND: 'Send',

            LOAD_HISTORY_HINT: 'Click to load history',
            LOAD_HISTORY_MOBILE_HINT: 'Pull to load history',
            LOADING_HISTORY: 'Loading...',
            NO_MORE_HISTORY: 'No more history',

            // for message summary launcher preview show
            IMAGE: 'Image',
            FILE: 'File',
            AUDIO: 'Audio',

            SEND_ERROR: 'Send Error',
            SERVICE_NOT_AVALIABLE: 'Service Not Avaliable',
            CANCELED: 'Cancled',

            CLOSE: 'Close',

            CONSULT_WORKING_TIME: 'Online Time',
            CONTACT_NUMBER: 'Contact Number',

            ONLINE: 'Online',
            OFFLINE: 'Offline',

            SYSTEM_MSG: 'System message',

            TYPING: 'Typing...',

            AUDIO_PLAY_ERROR: 'Play Error',
            
            timeFormat: function(timestampInMilliSeconds) {
                return Service.$tools.formatTime(timestampInMilliSeconds, {
                    year: "-",
                    month: "-",
                    day: "",
                    today: "Today",
                    yesterday: "Yesterday"
                });
            }
        }
    };

    PPConstants.i18n = function(key) {
        var language = Service.$language.getLanguage();
        return Service.Constants.I18N[Service.$language.getLanguage()][key];
    };

    Service.Constants = PPConstants;
    
})(Service));
