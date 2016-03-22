# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# core/constant.py
#
#

DEV_MODE = True

PPMESSAGE_APP = {}

TIMEOUT_WEBSOCKET_OFFLINE = 60*1
TIMEOUT_WEB_SESSION = 2*3600

def enum(*sequential, **named):
    enums = dict(zip(sequential, range(len(sequential))), **named)
    return type('Enum', (), enums)

Numbers = enum('ZERO', 'ONE', 'TWO')
# Numbers.ZERO == 0 and Numbers.ONE == 1

class Enum(set):
    def __getattr__(self, name):
        if name in self:
            return name
        raise AttributeError

Animals = Enum(["DOG", "CAT", "HORSE"])
# Animals.DOG == "DOG"

API_LEVEL = Enum([
    "PPCOM",
    "PPKEFU",
    "PPCONSOLE",
    "PPCONSOLE_BEFORE_LOGIN",
    "THIRD_PARTY_KEFU",
    "THIRD_PARTY_CONSOLE",
])

TRAIN_METHOD = Enum([
    "BAYES",
    "SVM",
    "KNN",
    "SGD",
])

DIS_WHAT = Enum([
    "WS",
    "ACK",
    "MSG",
    "AUTH",
    "SEND",
    "ONLINE",
    "TYPING",
    "TYPING_WATCH",
    "TYPING_UNWATCH",
])

ONLINE_STATUS = Enum([
    "OFFLINE",
    "ONLINE",
    "UNCHANGED",
])

USER_ONLINE_STATUS = Enum([
    "OFFLINE",
    "PORTAL_ONLINE_BROWSER",
    "PORTAL_ONLINE_MOBILE",
    "SERVICE_ONLINE_MOBILE",
    "SERVICE_ONLINE_BROWSER",
    "SERVICE_ONLINE_PC",
    "SERVICE_ONLINE_MOBILE_PC",
    "SERVICE_ONLINE_MOBILE_BROWSER"
])

WEBSOCKET_STATUS = Enum([
    "NULL",
    "OPEN",
    "CLOSE"
])

CACHE_RUN_STATUS = Enum([
    "NULL",
    "RUNNING",
    "DONE"
])

# OWNER and SERVICE are both PPMESSAGE user
# OWNER_0 is user after signing up
# OWNER_1 is user after creating first app
# OWNER_2 is user after launching team
# owner_3 is ???
# ADMIN is the admin user
# ANONYMOUS is PPMESSAGE anonymous + customer's anonymous
# THIRDPARTY is customer's user
USER_STATUS = Enum([
    "OWNER_0",
    "OWNER_1",
    "OWNER_2",
    "OWNER_3",
    "ADMIN",
    "SERVICE",
    "ANONYMOUS",
    "THIRDPARTY",
])

MQTTPUSH_SRV = Enum([
    "PUSH",
])

GCMPUSH_SRV = Enum([
    "PUSH",
])

IOSPUSH_SRV = Enum([
    "PUSH",
])

PCSOCKET_SRV = Enum([
    "WS",
    "ACK",
    "PUSH",
    "ONLINE",
    "TYPING",
    "LOGOUT",
])

DIS_SRV = Enum([
    "MESSAGE_DIS",
])

CACHE_SRV = Enum([
    "ADD_NO_DB",
    "ADD",
    "UPDATE",
    "DELETE",
    "DELETE_NO_DB",
    "PING",
])

FUNC_SRV = Enum([
    "FUNCTION",
])

SEND_SRV = Enum([
    "SEND",
])

TASK_STATUS = Enum([
    "PENDING",
    "PROCESSED",
    "CANCELLED",
    "ACKED"
]) 

MESSAGE_STATUS = Enum([
    "PENDING",
    "FAILED",
    "PUSHED",
    "ACKED",
    "NODEVICE"
])

OS = Enum([
    "AND", # ANDROID
    "IOS", # IOS
    "ANB", # ANDROID BROWSER
    "IOB", # IOS BROWSER
    "WIP", # WIN PHONE
    "MAC", # MAC OS X PC
    "LIN", # LINUX PC
    "WIN", # WINDOWS PC
    "MAB", # MAC BROWSER
    "LIB", # LINUX BROWSER
    "WIB", # WINDOWS BROWSER
    "W32", # WINDOWS 32 BIT
    "W64", # WINDOWS 64 BIT
])

MESSAGE_TYPE = Enum([
    "NOTI",
    "ACT",
    "SYS",
])

MESSAGE_SUBTYPE = Enum([
    "TEXT",
    "TXT",
    "IMAGE",
    "AUDIO",
    "VIDEO",
    "DOCUMENT",
    "ARCHIVE",
    "FILE",
    "SINGLE_CARD",
    "MULTIPLE_CARD",
    "EVENT",
    "MENU",
    "FUNC",
    "GPS_LOCATION",
    "DG_INVITED",
    "DG_REMOVED",
    "AG_INVITED",
    "INVITE_CONTACT",
    "ACCEPT_CONTACT",
    "REMOVE_CONTACT",
    "REQUEST_JOIN_OG",
    "APPROVE_JOIN_OG",
    "LOGOUT",
])

GROUP_EVENT = Enum([
    "OPEN",
    "LOCATION",
    "FOLLOW",
    "UNFOLLOW"
])

FUNCTION = Enum([
    "WELCOME",
])

YVOBJECT = Enum([
    "DU",
    "OG",
    "AG",
    "AU",
    "DG",
    "CV",
    "AP",
])

CONVERSATION_TYPE = Enum([
    "S2S", # service user to service user
    "S2P", # service user to portal user
    "P2S", # portal user to service user
])

CONVERSATION_STATUS = Enum([
    "NEW",
    "OPEN",
    "CLOSE",
])

CONVERSATION_MEMBER_ACTION = Enum([
    "ADD",
    "REMOVE"
])

APPGROUP_TYPE = Enum([
    "PUBLIC",
    "PRIVATE",
])


"""
FUNC generate async message
MSG return a sync message
WEB open WEB from client APP
"""

APPMENU_TYPE = Enum([
    "FUNC",
    "MSG",
    "WEB",
])

APNS_TITLE = {
    "ZH_CN" : {
        "UNKNOWN": "未知类型",
        "TXT": "文本消息",
        "GPS": "位置消息",
        "AUDIO": "语音消息",
        "IMAGE": "图像消息",
        "SINGLE_CARD": "图文消息",
        "MULTIPLE_CARD": "多图文消息",
        "FILE": "文件消息",
        "INVITE": "邀请消息",
        "ACCEPT": "好友邀请通过消息",
        "DG_INVITED": "加入群聊消息"
    },
    
    "EN_US" : {
        "UNKNOWN": "unknown message type",
        "TXT": "text message",
        "GPS": "location message",
        "AUDIO": "voice message",
        "IMAGE": "picture message",
        "SINGLE_CARD": "rich text message",
        "MULTIPLE_CARD": "rich text message",
        "FILE": "file message",
        "INVITE": "invitation message",
        "ACCEPT": "invitation accepted message",
        "DG_INVITED": "discussion group invitation message"
    },
}

WEB_SESSION_ID = {
    "portal": "PPMESSAGE_PORTAL_SESSION_ID",
    "user": "PPMESSAGE_USER_SESSION_ID",
    "admin": "PPMESSAGE_ADMIN_SESSION_ID",
    "channel": "PPMESSAGE_CHANNEL_SESSION_ID",
}

THUMBNAIL_WIDTH = 120
THUMBNAIL_HEIGHT = 160

INTERNAL_APP = "INTERNAL_APP"
EXTERNAL_APP = "EXTERNAL_APP"
EMBEDDED_APP = "EMBEDDED_APP"

KEYTOOL_PATH = r"keytool -printcert -file"

MESSAGE_MAX_TEXT_LEN = 128

MQTT_HOST = "127.0.0.1"
MQTT_PORT = 1883

API_HOST = "127.0.0.1"
API_PORT = 8922

DIS_HOST = "127.0.0.1"
DIS_PORT = 8923

ADMINWEB_PORT = 8920
USERWEB_PORT = 8925

FUNC_HOST = "127.0.0.1"
FUNC_PORT = 8926

PPKEFU_PORT = 8927

FILEDOWNLOAD_PORT = 8924
FILEUPLOAD_PORT = 8928

CACHE_HOST = "127.0.0.1"
CACHE_PORT = 8929

REDIS_HOST = "127.0.0.1"
REDIS_PORT = 6379

OAUTH_HOST = "127.0.0.1"
OAUTH_PORT = 8930

MESSAGE_PORT = 8003

# PPCOM USE
PCSOCKET_HOST = "ppmessage.cn"
if DEV_MODE:
    PCSOCKET_HOST = "127.0.0.1"
PCSOCKET_PORT = 8931

IOSPUSH_HOST = "127.0.0.1"
IOSPUSH_PORT = 8932

PORTAL_PORT = 80
if DEV_MODE:
    PORTAL_PORT = 8080
    
PPCOM_PORT = 8934

STA_PORT = 8935

PPAUTOINSTALL_PORT = 8936
PPAUTOINSTALL_HOST = "127.0.0.1"

MONITOR_PORT = 8937

SEND_HOST = "127.0.0.1"
SEND_PORT = 8938

MQTTPUSH_HOST = "127.0.0.1"
MQTTPUSH_PORT = 8939

GCMPUSH_HOST = "127.0.0.1"
GCMPUSH_PORT = 8940

PPHOME_PORT = 8941

PPAUTH_PORT = 8943
PPCONSOLE_PORT = 8944

IOS_FAKE_TOKEN = "YOU-GOT-A-FAKE-IOS-TOKEN-IN-EMULATOR"
INVALID_IOS_TOKEN = "INVALID_IOS_TOKEN"

PPCOM_WELCOME = {
    "en_us": "Any question is welcome. Waiting for you.",
    "zh_cn": "有什么可以帮忙的，一起聊两句吧？",
    "zh_tw": "有什麼可以幫忙的，一起聊兩句吧？",
}

PPCOM_OFFLINE = {
    "en_us": "We are sorry for nobody is online now, but your messages will be delivered and read by customer service when they are online.",
    "zh_cn": "抱歉没有客服人员在线，消息依旧会被投递，客服人员上线的时候能马上看到。",
    "zh_tw": "抱歉沒有客服人員在線，消息依舊會被投遞，客服人員上線的時候能馬上看到。",
}

PPCOM_LAUNCHER_STYLE = Enum([
    "DEFAULT",
    "MATERIAL",
    "ANIMATE",
])

SHOW_PPCOM_HOVER = Enum([
    "NEVER",
    "ALWAYS",
    "ONCE",
])

APP_POLICY = Enum([
    "META",
    "ABASTRACT",
    "BROADCAST",
    "SMART",
    "GROUP",
    "ROBOT"
])

GROUP_ALGORITHM = Enum([
    "META",
    "ABASTRACT",
    "BROADCAST",
    "SMART",
    "LOAD",
    "ROBOT",
])

WEB_TITLE = {
    "user": "PPMessage | Opensource Plug and Play Online Customer Service System - ppmessage.com",
    "admin": "PPMessage | Opensource Plug and Play Online Customer Service System - ppmessage.com",
}

USER_NAME = {
    "en": {
        "local": "local area",
        "unknown": "unknown area",
        "user": "user",
    },

    "cn": {
        "local": "本地",
        "unknown": "未知区域",
        "user": "用户",
    },

    "tw": {
        "local": "本地",
        "unknown": "未知區域",
        "user": "用戶",
    },
}

REDIS_MONITOR_KEY = "redis_monitor_key"
REDIS_TYPING_KEY = "redis_typing_key"
REDIS_ONLINE_KEY = "redis_online_key"
REDIS_SQL_KEY = "redis_sql_key"

REDIS_PPKEFU_ONLINE_KEY = "redis_ppkefu_online_key"
REDIS_PPCOM_ONLINE_KEY = "redis_ppcom_online_key"

DATETIME_FORMAT = {
    "extra": '%Y-%m-%d %H:%M:%S %f',
    "basic": '%Y-%m-%d %H:%M:%S'
}
