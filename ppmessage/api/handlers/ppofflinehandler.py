# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler
from ppmessage.db.models import DeviceUser
from ppmessage.db.models import DeviceInfo
from ppmessage.db.models import UserOnlineStatusLog

from ppmessage.core.constant import API_LEVEL
from ppmessage.core.constant import REDIS_PPCOM_ONLINE_KEY
from ppmessage.core.redis import redis_hash_to_dict
from ppmessage.api.error import API_ERR

import json
import uuid
import logging
import datetime

class PPOfflineHandler(BaseHandler):
    def _user_online_status(self, _user_uuid, _device_uuid, _app_uuid):
        _redis = self.application.redis

        # PPCOM ONLINE NEED NOT REMOVE
        #_key = REDIS_PPCOM_ONLINE_KEY + ".app_uuid." + _app_uuid + ".day." + datetime.datetime.now().strftime("%Y-%m-%d")
        #_redis.srem(_key, _user_uuid + "." + _device_uuid)

        #_key = _key + ".hour." + str(datetime.datetime.now().hour)
        #_redis.srem(_key, _user_uuid + "." + _device_uuid)

        return

    def _offline(self, _user_uuid, _device_uuid, _app_uuid):
        _redis = self.application.redis
        _user = redis_hash_to_dict(_redis, DeviceUser, _user_uuid)
        if _user == None:
            self.setErrorCode(API_ERR.NO_USER)
            return
        
        if _user["ppcom_mobile_device_uuid"] != _device_uuid \
           and _user["ppcom_browser_device_uuid"] != _device_uuid:
            self.setErrorCode(API_ERR.NO_DEVICE)
            return

        _device = redis_hash_to_dict(_redis, DeviceInfo, _device_uuid)
        if _device == None:
            self.setErrorCode(API_ERR.NO_DEVICE)
            return

        _row = DeviceInfo(uuid=_device_uuid, device_is_online=False)
        _row.async_update()
        _row.update_redis_keys(self.application.redis)

        self._user_online_status(_user_uuid, _device_uuid, _app_uuid)
        return

    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCOM)
        return

    def _Task(self):
        super(PPOfflineHandler, self)._Task()
        _request = json.loads(self.request.body)
        _app_uuid = _request.get("app_uuid")
        _user_uuid = _request.get("user_uuid")
        _device_uuid = _request.get("device_uuid")
        if _user_uuid == None or _device_uuid == None or _app_uuid == None:
            logging.error("no user_uuid or _device_uuid or app_uuid.")
            self.setErrorCode(API_ERR.NO_PARA)
            return
        self._offline(_user_uuid, _device_uuid, _app_uuid)
        return

