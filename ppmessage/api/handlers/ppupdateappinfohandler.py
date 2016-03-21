# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from ppmessage.api.error import API_ERR
from ppmessage.db.models import AppInfo
from ppmessage.core.genericupdate import generic_update
from ppmessage.core.redis import redis_hash_to_dict

from ppmessage.core.constant import API_LEVEL

import json
import copy
import logging

class PPUpdateAppInfoHandler(BaseHandler):
    """
    requst:
    app_uuid
    user_xxx would be update
    user_xxx field must be same with db field of DeviceUser
    
    response:
    error_code

    """
    def _update(self, _request):
        _redis = self.application.redis
        _request = json.loads(self.request.body)
        _app_uuid = _request.get("app_uuid")
        
        if _app_uuid == None:
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _data = copy.deepcopy(_request)
        del _data["app_uuid"]

        if len(_data) > 0:
            _updated = generic_update(_redis, AppInfo, _app_uuid, _data)
            if not _updated:
                self.setErrorCode(API_ERR.GENERIC_UPDATE)
                return

        _app = redis_hash_to_dict(_redis, AppInfo, _app_uuid)
        _r = self.getReturnData()
        _r.update(_app)
        return

    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        return
    
    def _Task(self):
        super(PPUpdateAppInfoHandler, self)._Task()
        _request = json.loads(self.request.body)
        self._update(_request)
        return

