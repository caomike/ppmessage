# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# 
#

from .basehandler import BaseHandler

from ppmessage.db.models import DeviceInfo
from ppmessage.db.models import DeviceUser
from ppmessage.api.error import API_ERR

from ppmessage.core.constant import OS
from ppmessage.core.constant import API_LEVEL
from ppmessage.core.constant import ONLINE_STATUS
from ppmessage.core.constant import REDIS_PPKEFU_ONLINE_KEY

from ppmessage.core.redis import redis_hash_to_dict
from ppmessage.db.models import UserOnlineStatusLog
from ppmessage.pcsocket.pcsocketapp import pcsocket_user_online

import datetime
import logging
import json
import uuid

class PPKefuLogoutHandler(BaseHandler):

    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPKEFU)
        return

    def _user_online_status(self):
        _user_uuid = self.user_uuid
        _device_uuid = self.device_uuid
        _app_uuid = self.app_uuid
        _redis = self.application.redis
        _key0 = REDIS_PPKEFU_ONLINE_KEY + ".app_uuid." + _app_uuid
        _redis.srem(_key0, _user_uuid + "." + _device_uuid)
        
        _today = datetime.datetime.now().strftime("%Y-%m-%d")
        _key1 = _key0 + ".day." + _today
        _redis.sunionstore(_key1, _key0, _key0)

        _key2 = _key1 + ".hour." + str(datetime.datetime.now().hour)
        _redis.sunionstore(_key2, _key0, _key0)
        
        return
    
    def _update_device(self):
        _values = {
            "uuid": self.device_uuid,
            "device_is_online": False
        }        
        _row = DeviceInfo(**_values)
        _row.update_redis_keys(self.application.redis)
        _row.async_update()

        _d = redis_hash_to_dict(self.application.redis, DeviceInfo, self.device_uuid)
        logging.info(_d)
        return

    def _send_online(self):
        if self.device_is_browser == True:
            return
        _body = {
            "extra_data": None,
            "user_uuid": self.user_uuid,
            "browser": ONLINE_STATUS.UNCHANGED,
            "mobile": ONLINE_STATUS.OFFLINE,
        }
        pcsocket_user_online(self.application.redis, self.user_uuid, _body)
        return

    def _Task(self):    
        super(PPKefuLogoutHandler, self)._Task()
        _input = json.loads(self.request.body)

        _app_uuid = _input.get("app_uuid")
        _user_uuid = _input.get("user_uuid")
        _device_uuid = _input.get("device_uuid")
    
        if _user_uuid == None or _device_uuid == None or _app_uuid == None:
            self.setErrorCode(API_ERR.NO_PARA)
            return False

        self.user_uuid = _user_uuid
        self.device_uuid = _device_uuid
        self.app_uuid = _app_uuid

        _key = DeviceInfo.__tablename__ + ".uuid." + _device_uuid
        _ostype = self.application.redis.hget(_key, "device_ostype")
        self.device_is_browser = True
        if _ostype == OS.AND or _ostype == OS.IOS:
            self.device_is_browser = False
        
        #logging.info("DEVICEUSERLOGOUT with user_uuid:%s, device_uuid:%s." % (_user_uuid, _device_uuid))        
        self._update_device()
        self._user_online_status()
        self._send_online()
        return
