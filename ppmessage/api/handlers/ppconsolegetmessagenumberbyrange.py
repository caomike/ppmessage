# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
#
# api/handlers/ppconsolegetmessagenumberbyrange.py
#
#
from .basehandler import BaseHandler

from ppmessage.api.error import API_ERR

from ppmessage.core.constant import API_LEVEL

from ppmessage.core.utils.days import get_between_days
from ppmessage.db.models import MessagePushTask

import traceback
import datetime
import logging
import redis
import json

class PPConsoleGetMessageNumberByRange(BaseHandler):

    def _get(self):
        _request = json.loads(self.request.body)
        _app_uuid = _request.get("app_uuid")
        _begin_date = _request.get("begin_date")
        _end_date = _request.get("end_date")
        
        if _app_uuid == None or _begin_date == None or _end_date == None:
            logging.error("not enough parameter provided.") 
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _redis = self.application.redis
        _days = get_between_days(_begin_date, _end_date)
        _number = {}
        for _i in _days:
            _key = MessagePushTask.__tablename__ + ".app_uuid." + _app_uuid + ".day." + _i
            _number[_i] = _redis.get(_key)
        _r = self.getReturnData()
        _r["number"] = _number
        return

    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        return

    def _Task(self):
        self._get()
        
