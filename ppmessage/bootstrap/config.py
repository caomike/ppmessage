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
"db", database config
"redis", redis config

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

    "db": {
        "db_type": "mysql", #postgresql
        "db_host": "127.0.0.1",
        "db_port": "3306",
        "db_user": "root",
        "db_pass": "test",
        "db_name": "ppmessage",
    },

    "redis": {
        "redis_host": "127.0.0.1",
        "redis_port": "6379",
        "redis_password": None,
    },

    # nginx reversed proxy 
    "nginx": {
        "nginx_conf_path": "the_path_of_nginx_conf",
        "server_name": ["ppmessage.com", "www.ppmessage.com"],
        "listen": "8080", #80
        "ssl": "on", #"off"
        "ssl_listen": "443",
        "ssl_certificate": "/root/ppmessage/ppmessage/certs/ppmessage.cn.instant/issue/ssl_bundle.crt",
        "ssl_certificate_key": "/root/ppmessage/ppmessage/certs/ppmessage.cn.instant/server.key",
        "upload_store": "/usr/local/opt/mdm/uploads 1",
        "upload_state_store": "/usr/local/opt/mdm/upload_state",
    },

    # iOS code signing
    "ios": {
        "code_sign_identity": "iOS Distribution",
        "provisioning_profile": "b00c5be6-cc46-4776-b7c3-02915a5c44ec",
    },

}
