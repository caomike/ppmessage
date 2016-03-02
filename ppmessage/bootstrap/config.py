# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

"""
BOOSTRAP_CONFIG is the first place for developer edit before run PPMessage.

"team", to run PPMessage needing a team who is the first service team of the PPMessage
"user", to run PPMessage needing a user who create the first service team and admin the whole PPMessage system
"mysql", database config
"redis", redis config
"nginx", nginx config

"""

BOOTSTRAP_CONFIG = {
    "team": {
        "app_name": "ppmessage",
        "company_name": "YOURUI",
    },

    "user": {
        "user_language": "zh_cn", # zh_cn, en_us, zh_tw
        "user_firstname": "Guijin",
        "user_lastname": "Ding",
        "user_fullname": "Guijin Ding",
        # email is user account
        "user_email": "dingguijin@gmail.com",
        "user_password": "123",
    },

    "mysql": {
        "db_host": "127.0.0.1",
        "db_user": "root",
        "db_pass": "test",
        "db_name": "ppmessage",
    },

    "redis": {
        "redis_host": "127.0.0.1",
        "redis_port": "6379",
    },

    "server": {
        "name": "auto", # `auto` PPMessage use the ip address, `ppmessage.com`/`www.ppmessage.com` your domain or host name 
    },

    "js": {
        "min": "no", # `yes` or `no` for minimized the PPCOM/PPKEFU javascript file
    },
    
    # nginx conf 
    "nginx": {
        "nginx_conf_path": "/usr/local/etc/nginx/nginx.conf",
        "server_name": ["ppmessage.com", "www.ppmessage.com"],
        "listen": "8080", #80

        "identicon_store": "/user/local/opt/ppmessage/identicon",
        "upload_store": "/usr/local/opt/ppmessage/uploads 1",
        "upload_state_store": "/usr/local/opt/ppmessage/upload_state",

        "ssl": "off", # off/on
        "ssl_listen": "443",
        "ssl_certificate": "/Users/dingguijin/ppmessage/ppmessage/certs/ppmessage.cn.instant/issue/ssl_bundle.crt",
        "ssl_certificate_key": "/Users/dingguijin/ppmessage/ppmessage/certs/ppmessage.cn.instant/server.key",
    },

    # apns push certificate, dev for developer, pro for production
    "apns": {
        "name": "com.yvertical.mdm.yvio",
        "dev": "/Users/dingguijin/ppmessage/ppmessage/certs/apnscerts/ppmessage-dev.p12",
        "pro": "/Users/dingguijin/ppmessage/ppmessage/certs/apnscerts/ppmessage-pro.p12",
    },

    # google cloud message
    "gcm": {
        "api_key": "AIzaSyBzRHQH-u6-wcT6jUc8DgTITMUB4vdqYiU",
    },

    # iOS app code signing
    "ios": {
        "code_sign_identity": "iOS Distribution",
        "provisioning_profile": "b00c5be6-cc46-4776-b7c3-02915a5c44ec",
    },

}
