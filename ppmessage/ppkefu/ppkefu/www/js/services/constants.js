ppmessageModule.factory("yvConstants", [function () {
    
    return {

        DEV_MODE: true,
        
        UPDATE_YVOBJECT_INTERVAL: 3600 * 24,
        MESSAGE_MAX_TEXT_LEN:     128,
        PCSOCKET_PORT:            8931,
        PCAPP_PORT:               8927,
        DOWNLOAD_PORT:            8924,
        UPLOAD_PORT:              8928,
        API_PORT:                 8922,
        ADMINWEB_PORT:            8920,
        PORTAL_PORT:              8080,
        OAUTH_PORT:               8930,

        ADDING_TYPE: {
            FILE: "FILE",
            PICTURE: "PICTURE",
            CAMERA: "CAMERA",
            LOCATION: "LOCATION",
            SLACK: "SLACK",
            EVERNOTE: "EVERNOTE"
        },
        
        PC_SOCKET_STATUS: {
            NULL: "NULL",
            CONNECTING: "CONNECTING",
            CONNECTED: "CONNECTED",
            KICKED: "KICKED"
        },

        DIS_ERR: {
            NOERR:  0,
            FORMAT: 1,
            AUTH:   2,
            QUIT:   3
        },

        CHAT_STATUS: {
            NULL:             "NULL",
            ADDING:           "ADDING",
            TEXTING:          "TEXTING",
            CAPTURING:        "CAPTURING",
            CAPTURED:         "CAPTURED",
            RECORDING:        "RECORDING",
            RECORDING_PRE:    "RECORDING_PRE",
            RECORDING_CANCEL: "RECORDING_CANCEL"
        },

        THUMBNAIL: {
            WIDTH: 120,
            HEIGHT: 160
        },

        AVATAR: {
            WIDTH: 140,
            HEIGHT: 140
        },
        
        API_ERR: {
            NO_ERR: 0,
            NO_JSON: 1,
            NO_UUID: 2,
            NO_ACCESS_TOKEN: 3,
            WRONG_ACCESS_TOKEN: 4,
            NO_VALID: 5,
            NO_PARA: 6,
            NO_USER: 7,
            NO_DEVICE: 8,
            NO_ENT: 9,
            MIS_ERR: 10,
            NO_TASK: 11,
            NO_PUSH: 12,
            NO_APP: 13,
            NO_FILE: 14,
            NO_MATERIAL: 15,
            MESSAGE: 16,
            SYS_ERR: 17,
            NO_OBJECT: 18,
            ERR_SIG: 19,
            NO_PERM: 20,
            EX_USER: 22,
            ERROR_VERIFY_CODE: 24
        },

        MESSAGE_TYPE: {
            NOTI: "NOTI",
            SYS: "SYS"
        },

        MESSAGE_SUBTYPE: {
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
        },

        YVOBJECT: {
            DEVICE_USER: "DU",
            ORG_GROUP:   "OG",
            APP_GROUP:   "AG",
            DIS_GROUP:   "DG",
            ADMIN_USER:  "AU",
            CONVERSATION: "CV"
        },

        PLAY_STATUS: {
            PLAY_NULL:    "PLAY_NULL",
            PLAY_PLAYING: "PLAY_PLAYING"
        },

        SEND_STATUS: {
            SEND_PENDING:   "SEND_PENDING",
            SEND_CHECKING:  "SEND_CHECKING",
            SEND_UPLOADING: "SEND_UPLOADING",
            SEND_SENDING:   "SEND_SENDING",
            SEND_SUCCESS:   "SEND_SUCCESS",
            SEND_ERROR:     "SEND_ERROR"
        },

        RECV_STATUS: {
            RECV_PLAY:   "RECV_PLAY",
            RECV_OPEN:   "RECV_OPEN",
            RECV_NEW:    "RECV_NEW",
            RECV_UNACK:  "RECV_UNACK"
        },

        MESSAGE_DIR: {
            DIR_IN:  "DIR_IN",
            DIR_OUT: "DIR_OUT"
        },

        INVITE_STATUS: {
            INVITE_PENDING: "INVITE_PENDING",
            INVITE_READ: "INVITE_READ",
            INVITE_ACCEPTED: "INVITE_ACCEPTED"
        },

        MENU_TYPE: {
            FUNC: 'FUNC',
            WEB: 'WEB',
            MSG: 'MSG'
        },

        APP_MENU_ARRAY: ["messages", "contacts", "settings"],

        CONVERSATION_TYPE: {
            P2S: "P2S",
            S2S: "S2S",
            S2P: "S2P",
            P2S: "P2S"
        },

        DEFAULT_BUNDLE_NAME: "ppmessage",

        OS: {
            MAC: "MAC",
            WIN32: "WIN32",
            WIN64: "WIN64",
            LINUX: "LINUX",
            DARWIN: "DARWIN"
        },

        PLATFORM: {
            IOS: "IOS", // IOS
            WIP: "WIP", // WINDOWS PHONE
            ANDROID: "AND", // ANDROID
            
            IOS_BROWSER: "IOB", // IOS BROWSER
            WIP_BROWSER: "WPB", // WINDOWS PHONE BROWSER
            ANDROID_BROWSER: "ANB", // ANDROID BROWSER
            
            MAC: "MAC", // MAC PC
            LINUX: "LIN", // LINUX PC
            WIN: "WIN", // WINDOWS PC
            WIN32: "W32", // WINDOWS PC 32 BIT
            WIN64: "W64", // WINDOWS PC 64 BIT

            MAC_BROWSER: "MAB", // MAC BROWSER
            LINUX_BROWSER: "LIB", // LINUX BROWSER
            WIN_BROWSER: "WIB", // WINDOWS BROWSER
        }
        
    };
    
}]);
