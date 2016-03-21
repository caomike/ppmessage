# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
# All rights reserved
#
# handlers/ppleaveapphandler.py
#
#
from .basehandler import BaseHandler

from ppmessage.api.error import API_ERR
from ppmessage.db.models import AppInfo
from ppmessage.db.models import DeviceUser
from ppmessage.db.models import AppUserData
from ppmessage.core.constant import API_LEVEL

from ppmessage.core.redis import redis_hash_to_dict

from tornado.web import authenticated

import logging
import json

class PPLeaveAppHandler(BaseHandler):

    def _one(self, _app_uuid, _user_uuid):
        _redis = self.application.redis
        _key = AppUserData.__tablename__ + \
               ".app_uuid." + _app_uuid + \
               ".user_uuid." + _user_uuid + ".is_service_user.True"
        if not _redis.exists(_key):
            self.setErrorCode(API_ERR.NO_USER)
            return False

        _data_uuid = _redis.get(_key)
        _data = redis_hash_to_dict(_redis, AppUserData, _data_uuid)
        if _data == None:
            self.setErrorCode(API_ERR.NO_USER)
            return False
        
        if _data.get("is_owner_user") == True:
            self.setErrorCode(API_ERR.APP_OWNER)
            return False
        
        _row = AppUserData(uuid=_data_uuid)
        _row.async_delete()
        _row.delete_redis_keys(_redis)

        _key = DeviceUser.__tablename__ + ".uuid." + _user_uuid
        if not _redis.exists(_key):
            self.setErrorCode(API_ERR.NO_USER)
            return False

        # FIXME: a lot of user db message should be removed
        _row = DeviceUser(uuid=_user_uuid)
        _row.async_delete()
        _row.delete_redis_keys(_redis)
        return True
    
    def _leave(self, _app_uuid, _user_list):
        for _user_uuid in _user_list:
            if not self._one(_app_uuid, _user_uuid):
                break
        return
        
    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        return

    def _Task(self):
        super(PPLeaveAppHandler, self)._Task()
        _request = json.loads(self.request.body)
        _app_uuid = _request.get("app_uuid")
        _user_list = _request.get("user_list")
        if _app_uuid == None or _user_list == None or len(_user_list) == 0:
            self.setErrorCode(API_ERR.NO_PARA)
            return
        self._leave(_app_uuid, _user_list)
        return
