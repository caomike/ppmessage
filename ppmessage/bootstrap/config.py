# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

"""
BOOSTRAP_CONFIG is the first user and the first team of the PPMessage system.

The first user and team must created before running PPMessage system.

The first user is the team owner and the super admin user of PPMessage system.
"""

BOOTSTRAP_CONFIG = {
    "app_name": "ppmessage",
    "company_name": "YOURUI",

    "user_language": "zh_cn", # zh_cn, en_us, zh_tw
    "user_firstname": "Guijin",
    "user_lastname": "Ding",
    "user_fullname": "Guijin Ding",
    "user_status": "OWNER_2",
    
    # email is account name
    "user_email": "dingguijin@gmail.com",
    "user_password": "123",

    # db config
    "db_host": "127.0.0.1",
    "db_user": "root",
    "db_pass": "test",
    "db_name": "ppmessage",


    # cert config

    # iOS code signing

    "code_sign_identity": "iOS Distribution",
    "provisioning_profile": "b00c5be6-cc46-4776-b7c3-02915a5c44ec",


}
