# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler
from mdm.db.models import DeviceUser
from mdm.api.error import API_ERR

import json
import logging

class PPIsEmailValidHandler(BaseHandler):
    """
    PP_IS_EMAIL_VALID verify the user_email is valid in PPMESSAGE system or not.
    
    Return JSON with `valid`, true or false.
    """
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
