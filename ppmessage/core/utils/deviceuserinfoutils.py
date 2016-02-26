# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# @author kun.zhao@ppmessage.com
# 
#

from ppmessage.db.models import DeviceUser

from ppmessage.core.redis import redis_hash_to_dict

def get_device_user_info (redis, user_uuid, options = None) :
    '''
    return 用户信息
    '''

    # illegal params
    if redis is None or user_uuid is None:
        return None

    # default options
    # 默认不会返回用户密码
    if options is None:
        options = {
            'get_password': False
        }

    # retrieve user info
    user = redis_hash_to_dict(redis, DeviceUser, user_uuid)
    
    if user is not None and options['get_password'] is False:
        if 'user_password' in user:
            del user['user_password']

    return user
