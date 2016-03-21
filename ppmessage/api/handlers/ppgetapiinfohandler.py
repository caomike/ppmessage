# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from ppmessage.db.models import ApiInfo
from ppmessage.api.error import API_ERR
from ppmessage.core.constant import API_LEVEL

import json
import logging

class PPGetApiInfoHandler(BaseHandler):

    def _get(self):
        _redis = self.application.redis
        _app_uuid = self.app_uuid
        _user_uuid = self.user_uuid

        _r = self.getReturnData()

        _key = ApiInfo.__tablename__ + ".app_uuid." + _app_uuid + \
               ".user_uuid." + _user_uuid + ".api_level." + API_LEVEL.THIRD_PARTY_CONSOLE
        _d = _redis.get(_key)
        if _d != None and len(_d) > 0:
            _a = json.loads(_d)
            _ppconsole = {
                "api_uuid": _a[0],
                "api_level": _a[1],
                "api_key": _a[2],
                "api_secret": _a[3],
            }
            _r["ppconsole_thirdparty"] = _ppconsole

        _key = ApiInfo.__tablename__ + ".app_uuid." + _app_uuid + \
               ".user_uuid." + _user_uuid + ".api_level." + API_LEVEL.THIRD_PARTY_KEFU
        _d = _redis.get(_key)
        if _d != None and len(_d) > 0:
            _a = json.loads(_d)
            _ppkefu = {
                "api_uuid": _a[0],
                "api_level": _a[1],
                "api_key": _a[2],
                "api_secret": _a[3],
            }
            _r["ppkefu_thirdparty"] = _ppkefu
        return
        
    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        return

    def _Task(self):
        super(PPGetApiInfoHandler, self)._Task()
        _user_uuid = json.loads(self.request.body).get("user_uuid")
        if _user_uuid == None:
            logging.error("no user_uuid provided")
            self.setErrorCode(API_ERR.NO_PARA)
            return
        self.user_uuid = _user_uuid
        self._get()
        return
