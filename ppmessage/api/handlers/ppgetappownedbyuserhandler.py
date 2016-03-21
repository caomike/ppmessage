# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Jin He, jin.he@yvertical.com
#
#

from .basehandler import BaseHandler

from ppmessage.api.error import API_ERR
from ppmessage.db.models import AppInfo
from ppmessage.db.models import AppBillingData
from ppmessage.core.redis import redis_hash_to_dict

from ppmessage.core.constant import API_LEVEL

import json
import logging

class PPGetAppOwnedByUserHandler(BaseHandler):
    """
    requst:
    user_uuid, ppmessage user uuid

    response:
    json with error_code
    app which owned by this user

    web admin with use this to admin the owned app
    """
    def _get(self, _user_uuid):
        _redis = self.application.redis
        _key = AppInfo.__tablename__ + ".user_uuid." + _user_uuid
        _uuid = _redis.get(_key)
        if _uuid == None:
            self.setErrorCode(API_ERR.NO_APP)
            return
        
        _app = redis_hash_to_dict(_redis, AppInfo, _uuid)
        if _app == None:
            self.setErrorCode(API_ERR.NO_APP)
            return
        
        _bill = _app.get("app_billing_uuid")
        _data = None
        if _bill != None:
            _data = redis_hash_to_dict(_redis, AppBillingData, _bill)

        _r = self.getReturnData()
        _r["app"] = _app
        _r["bill"] = _data
        return
        
    def initialize(self):
        self.addPermission(api_level=API_LEVEL.PPCOM)
        self.addPermission(api_level=API_LEVEL.PPKEFU)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_KEFU)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        return

    def _Task(self):
        super(PPGetAppOwnedByUserHandler, self)._Task()
        _request = json.loads(self.request.body)
        _user_uuid = _request.get("user_uuid")
        if _user_uuid == None:
            self.setErrorCode(API_ERR.NO_PARA)
            return
        self._get(_user_uuid)
        return
