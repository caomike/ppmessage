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
from ppmessage.api.error import API_ERR

from ppmessage.core.constant import API_LEVEL

import json
import logging
import time

class PPGetUserInfoHandler(BaseHandler):
    """
    description:
    receive device user uuid, return device user detail plus app user data detail.
    
    request:
    app_uuid: app that user belongs to
    user_uuid: device user uuid

    response:
    device user detail:
    app user data detail: {
    "is_owner_user": True/False,
    "is_service_user": True/False,
    "is_distributor_user": True/False
    }
    """
    def _get(self, _app_uuid, _user_uuid):
        _redis = self.application.redis
        _user = redis_hash_to_dict(_redis, DeviceUser, _user_uuid)
        if _user is None:
            self.setErrorCode(API_ERR.NO_USER)
            return
        del _user["user_password"]

        _key = AppUserData.__tablename__ + \
               ".app_uuid." + _app_uuid + \
               ".user_uuid." + _user_uuid
        _app_user_data = _redis.get(_key)
        if _app_user_data == None:
            self.setErrorCode(API_ERR.NO_APP_USER)
            return
        _app_user_data = json.loads(_app_user_data)        
        _r = self.getReturnData()
        _r.update(_user)
        _r.update(_app_user_data)
        _r["updatetime"] = int(time.mktime(_user["updatetime"].timetuple()))
        _r["createtime"] = int(time.mktime(_user["createtime"].timetuple()))
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
        super(PPGetUserInfoHandler, self)._Task()
        _request = json.loads(self.request.body)
        _user_uuid = _request.get("user_uuid")
        _app_uuid = _request.get("app_uuid")
        
        if _user_uuid == None or _app_uuid == None:
            self.setErrorCode(API_ERR.NO_PARA)
            return
        
        self._get(_app_uuid, _user_uuid)
        return
