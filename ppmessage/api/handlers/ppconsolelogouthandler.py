# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# 
#

from .basehandler import BaseHandler

from ppmessage.core.constant import API_LEVEL
from ppmessage.db.models import DeviceUser
from ppmessage.db.models import ApiTokenData
from ppmessage.api.error import API_ERR

import logging
import json
import uuid

class PPConsoleLogoutHandler(BaseHandler):

    def initialize(self):
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        return
    
    def _Task(self):    
        super(PPConsoleLogoutHandler, self)._Task()
        _input = json.loads(self.request.body)
        _user_uuid = _input.get("user_uuid")
        if _user_uuid == None:
            self.setErrorCode(API_ERR.NO_PARA)
            return False
        _key = ApiTokenData.__tablename__ + ".api_token." + self.api_token
        self.application.redis.delete(_key)
        return
