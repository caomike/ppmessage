# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler
from ppmessage.db.models import DeviceUser
from ppmessage.db.models import AppUserData

from ppmessage.core.redis import redis_hash_to_dict
from ppmessage.api.handlers.ppgetorggroupuserlisthandler import single_user

from ppmessage.api.error import API_ERR
from ppmessage.core.constant import API_LEVEL

import json
import time
import logging

class PPGetAppServiceUserListHandler(BaseHandler):
    """
    """
    def _get(self, _app_uuid):
        _redis = self.application.redis
        _key = AppUserData.__tablename__ + \
                   ".app_uuid." + _app_uuid + \
                   ".is_service_user.True"
        _user_list = _redis.smembers(_key)
        _users = []
        for _user_uuid in _user_list:
            _user = redis_hash_to_dict(_redis, DeviceUser, _user_uuid)
            if _user == None:
                continue
            _user = single_user(_redis, _user)

            _key = AppUserData.__tablename__ + \
                   ".app_uuid." + _app_uuid + \
                   ".user_uuid." + _user_uuid
            _data_string = _redis.get(_key)
            if _data_string == None:
                continue
            _data_json = json.loads(_data_string)
            _user.update(_data_json)
            _users.append(_user)
            
        _r = self.getReturnData()
        _r["list"] = _users
        return

    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCOM)
        self.addPermission(api_level=API_LEVEL.PPKEFU)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_KEFU)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        return

    def _Task(self):
        super(PPGetAppServiceUserListHandler, self)._Task()
        _request = json.loads(self.request.body)
        _app_uuid = _request.get("app_uuid")
        if _app_uuid == None:
            self.setErrorCode(API_ERR.NO_PARA)
            return
        self._get(_app_uuid)
        return
