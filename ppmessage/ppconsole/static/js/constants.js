// the [] is must, otherwise it is a ref not define
angular.module("this_app.constants", [])
    .constant("yvConstants", {

        PPCONSOLE_API: {
            uuid:    "{ppconsole_api_uuid}",
            key:     "{ppconsole_api_key}",
            secret:  "{ppconsole_api_secret}"
        },

        PPMESSAGE_APP: {
            uuid:    "{ppmessage_app_uuid}"
        },

        COOKIE_KEY: {
            LOGINED_USER_UUID: 'cookie_ppconsole_{WEB_ROLE}_logined_user_uuid',
            ACTIVE_USER_UUID: 'cookie_ppconsole_{WEB_ROLE}_user_uuid',
            ACCESS_TOKEN: 'cookie_ppconsole_{WEB_ROLE}_access_token',
        },

        BROADCAST_EVENT_KEY: {
            LOGIN_FINISHED: 'event:login:finished',
            REFRESH_PAGE: 'event:refreshpage'
        },

        MAX_TEXT_LEN: 128,

        STATIC_PREFIX: "/{WEB_ROLE}/static/",
        DEFAULT_USER_ICON: "/{WEB_ROLE}/static/img/avatar3_small.jpg",

        MESSAGE_TYPE: {
            NOTI: "NOTI",
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
            DU: "DU",
            AU: "AU",
            AG: "AG",
            OG: "OG",
        },

        OS: {
            IOS: "IOS",
            AND: "AND",
            WP: "WP",
            CHROME: "CHROME",
            MAC: "MAC",
            WIN: "WIN",
        },

        SEND_STATUS: {
            SEND_PENDING:   "SEND_PENDING",
            SEND_CHECKING:  "SEND_CHECKING",
            SEND_UPLOADING: "SEND_UPLOADING",
            SEND_SENDING:   "SEND_SENDING",
            SEND_SUCCESS:   "SEND_SUCCESS",
            SEND_ERROR:     "SEND_ERROR"
        },

        MESSAGE_DIR: {
            DIR_IN:  "DIR_IN",
            DIR_OUT: "DIR_OUT"
        },

        // according this to jump certain url
        USER_STATUS: {
            OWNER_0: "app.createteam",
            OWNER_1: "app.startteam",
            OWNER_2: "app.settings.overview",
            // OWNER_3: "",
            // SERVICE: "",
            ANONYMOUS: "app.main",
            THIRDPARTY: "app.main",
        },

    });
