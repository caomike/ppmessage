# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
#
# api/handlers/ppconsolegetrealtimecustomernumber.py
#
#

from .basehandler import BaseHandler
from ppmessage.api.error import API_ERR

from ppmessage.core.constant import API_LEVEL
from ppmessage.core.constant import REDIS_PPCOM_ONLINE_KEY

import traceback
import datetime
import logging
import redis
import json

class PPConsoleGetRealTimeCustomerNumber(BaseHandler):

    def _get(self):
        _request = json.loads(self.request.body)
        _app_uuid = _request.get("app_uuid")
        
        if _app_uuid == None:
            logging.error("not enough parameter provided.") 
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _redis = self.application.redis

        _number = []
        _today = datetime.datetime.now().strftime("%Y-%m-%d")
        for _i in range(24):
            _data = {}
            _customers = set()
            _key = REDIS_PPCOM_ONLINE_KEY + ".app_uuid." + _app_uuid + ".day." + _today + ".hour." + str(_i)
            _devices = _redis.smembers(_key)
            for _device in _devices:
                _customers.add(_device.split(".")[0])
            _data[str(_i)] = len(_customers)
            _number.append(_data)
        _r = self.getReturnData()
        _r["number"] = _number
        return
        
    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        return

    def _Task(self):
        self._get()

