# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Jin He, jin.he@yvertical.com
#
#

from .basehandler import BaseHandler

from ppmessage.api.error import API_ERR
from ppmessage.db.models import AppInfo
from ppmessage.db.models import DeviceUser
from ppmessage.core.redis import redis_hash_to_dict

from ppmessage.core.constant import API_LEVEL
from ppmessage.core.constant import USER_STATUS

import json
import logging

class PPGetAllAppListHandler(BaseHandler):
    """
    description:
    receive user uuid, if it is really a admin, return all apps.
    
    request:
    user_uuid,
    
    response:
    [app1, app2, ...]
    """
    def _check_user(self, _user_uuid):
        _redis = self.application.redis
        _user = redis_hash_to_dict(_redis, DeviceUser, _user_uuid)
        if _user == None:
            self.setErrorCode(API_ERR.NO_USER)
            return False

        _user_status = _user.get("user_status")
        if _user_status != USER_STATUS.ADMIN:
            self.setErrorCode(API_ERR.NOT_ADMIN)
            return False
        return True

    def _get(self, _user_uuid):
        _redis = self.application.redis
        _key = AppInfo.__tablename__ + ".uuid.*"
        _app_keys = _redis.keys(_key)
        if len(_app_keys) == 0:
            _r = self.getReturnData()
            _r["app"] = []
            return
            
        _pi = _redis.pipeline()
        for _app_key in _app_keys:
            _pi.hgetall(_app_key)
        _apps = _pi.execute()

        _r = self.getReturnData()
        _r["app"] = _apps
        return
        
    def initialize(self):
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        return

    def _Task(self):
        super(PPGetAllAppListHandler, self)._Task()
        _request = json.loads(self.request.body)
        _user_uuid = _request.get("user_uuid")
        if _user_uuid == None:
            self.setErrorCode(API_ERR.NO_PARA)
            return
        if self._check_user(_user_uuid) == True:
            self._get(_user_uuid)
            return
        return
