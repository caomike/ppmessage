# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
#
# api/handlers/ppremoveapphandler.py
#
#

from .basehandler import BaseHandler

from ppmessage.api.error import API_ERR
from ppmessage.db.models import AppInfo
from ppmessage.db.models import AppUserData
from ppmessage.core.redis import redis_hash_to_dict

from ppmessage.core.constant import API_LEVEL

import json

class PPRemoveAppHandler(BaseHandler):

    def _remove(self):
        _redis = self.application.redis
        
        _app = redis_hash_to_dict(_redis, AppInfo, _app_uuid)
        if _app == None:
            self.setErrorCode(API_ERR.NO_APP)
            return

        if _app.get("user_uuid") != _user_uuid:
            self.setErrorCode(API_ERR.NOT_OWNER)
            return

        _key = AppUserData.__tablename__ + ".app_uuid." + _app_uuid + ".is_service_user.True"
        _services = _redis.smembers()

        _key = AppUserData.__tablename__ + ".app_uuid." + _app_uuid + ".is_service_user.False"
        _users = _redis.smembers()

        _pi = _redis.pipeline()
        _data_key_pre = AppUserData.__tablename__ + ".app_uuid." + _app_uuid
        for _user_uuid in _sevices:
            _data_key = _data_key_pre + ".user_uuid." + _user_uuid + ".is_service_user.True"
            _pi.get(_data_key)
        _data_uuid_list = _pi.execute()
        
        for _i in _data_uuid_list:
            _row = AppUserData(uuid=_i)
            _row.async_delete()
            _row.delete_redis_keys(_redis)

        _row = AppInfo(uuid=_app_uuid)
        _row.async_delete()
        _row.delete_redis_keys(_redis)
        return
        
    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        return
    
    def _Task(self):
        super(PPRemoveAppHandler, self)._Task()
        _request = json.loads(self.request.body)
        _app_uuid = _request.get("app_uuid")
        _user_uuid = _request.get("user_uuid")
        if _user_uuid == None or _app_uuid == None:
            self.setErrorCode(API_ERR.NO_PARA)
            return
        self._remove(_app_uuid, _user_uuid)
        return
