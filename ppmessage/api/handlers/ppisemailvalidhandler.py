# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler
from ppmessage.db.models import DeviceUser
from ppmessage.api.error import API_ERR
from ppmessage.core.constant import API_LEVEL

import json
import logging

class PPIsEmailValidHandler(BaseHandler):
    """
    description:
    Receive user_email, verify if the user_email is valid in PPMESSAGE system or not.
    
    request:
    user_email,

    response:
    valid: True/False
    """
    def initialize(self):
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        return

    def _Task(self):
        super(PPIsEmailValidHandler, self)._Task()
        _request = json.loads(self.request.body)
        _user_email = _request.get("user_email")
        if _user_email == None:
            self.setErrorCode(API_ERR.NO_PARA)
            return
        
        _key = DeviceUser.__tablename__ + ".user_email." + _user_email
        _valid = not self.application.redis.exists(_key)
        _r = self.getReturnData()
        _r["valid"] = _valid
        return
