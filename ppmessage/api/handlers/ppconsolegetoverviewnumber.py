# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
#
# api/handlers/ppconsolegetoverviewnumber.py
#
#

from .basehandler import BaseHandler
from ppmessage.api.error import API_ERR

from ppmessage.db.models import AppUserData
from ppmessage.db.models import UserOnlineStatusLog
from ppmessage.db.models import MessagePushTask
from ppmessage.core.utils.days import get_day_begin_end

from ppmessage.core.constant import API_LEVEL
from ppmessage.core.constant import REDIS_PPCOM_ONLINE_KEY

import traceback
import datetime
import logging
import redis
import json

class PPConsoleGetOverviewNumber(BaseHandler):

    def _get(self):
        _request = json.loads(self.request.body)
        _app_uuid = _request.get("app_uuid")
        
        if _app_uuid == None:
            logging.error("not enough parameter provided.") 
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _redis = self.application.redis
        _number = {}
        _today = datetime.datetime.now().strftime("%Y-%m-%d")
        _yesterday = datetime.datetime.now() - datetime.timedelta(days=1)
        _yesterday = _yesterday.strftime("%Y-%m-%d")

        _key = AppUserData.__tablename__ + ".app_uuid." + _app_uuid + ".is_service_user.True"
        _number["agent"] = _redis.scard(_key)
        
        _key = REDIS_PPCOM_ONLINE_KEY + ".app_uuid." + _app_uuid + ".day." + _today
        _customers = set()
        _devices = _redis.smembers(_key)
        for _device in _devices:
            _customers.add(_device.split(".")[0])
        _number["today_customer"] = len(_customers)

        _key = REDIS_PPCOM_ONLINE_KEY + ".app_uuid." + _app_uuid + ".day." + _yesterday
        _customers = set()
        _devices = _redis.smembers(_key)
        for _device in _devices:
            _customers.add(_device.split(".")[0])
        _number["yesterday_customer"] = len(_customers)

        _key = AppUserData.__tablename__ + ".app_uuid." + _app_uuid + ".is_service_user.False"
        _number["all_customer"] = _redis.scard(_key) or 0

        _key = MessagePushTask.__tablename__ + ".app_uuid." + _app_uuid
        _number["all_message"] = _redis.get(_key) or 0

        _r = self.getReturnData()
        _r["number"] = _number

        return
    
    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        return

    def _Task(self):
        self._get()


