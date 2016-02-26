# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# 
#

from .basehandler import BaseHandler

from mdm.db.models import DeviceInfo
from mdm.db.models import DeviceUser
from mdm.api.error import API_ERR

from mdm.core.constant import OS
from mdm.core.constant import ONLINE_STATUS
from mdm.core.constant import USER_ONLINE_STATUS
from mdm.core.redis import redis_hash_to_dict
from mdm.db.models import UserOnlineStatusLog
from mdm.pcsocket.pcsocketapp import pcsocket_user_online

import logging
import json
import uuid

class DeviceUserLogoutHandler(BaseHandler):

    def _user_online_status(self):
        _user_uuid = self.user_uuid
        _device_uuid = self.device_uuid

        _browser_device_is_online = False
        _mobile_device_is_online = False
        
        _redis = self.application.redis
        _user_key = DeviceUser.__tablename__ + ".uuid." + _user_uuid

        _mobile_device_uuid = _redis.hget(_user_key, "mobile_device_uuid")
        if _mobile_device_uuid != None:
            _device_key = DeviceInfo.__tablename__ + ".uuid." + _mobile_device_uuid
            _mobile_device_is_online = _redis.hget(_device_key, "device_is_online")

        _browser_device_uuid = _redis.hget(_user_key, "browser_device_uuid")
        if _browser_device_uuid != None:
            _device_key = DeviceInfo.__tablename__ + ".uuid." + _browser_device_uuid
            _browser_device_is_online = _redis.hget(_device_key, "device_is_online")

        _status = USER_ONLINE_STATUS.OFFLINE
        if _browser_device_is_online == "True":
            _status = USER_ONLINE_STATUS.SERVICE_ONLINE_BROWSER
        if _mobile_device_is_online == "True":
            _status = USER_ONLINE_STATUS.SERVICE_ONLINE_MOBILE
        
        _row = UserOnlineStatusLog(uuid=str(uuid.uuid1()),
                                   app_uuid=self.app_uuid,
                                   user_uuid=_user_uuid,
                                   device_uuid=_device_uuid,
                                   online_status=_status)
        _row.async_add()
        #_row.invalid_redis_sql(self.application.redis)
        return _status
    
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
        super(DeviceUserLogoutHandler, self)._Task()
        _input = json.loads(self.request.body)
        _user_uuid = _input.get("from_uuid")
        _device_uuid = _input.get("device_uuid")
    
        if _user_uuid == None or _device_uuid == None:
            self.setErrorCode(API_ERR.NO_PARA)
            return False

        self.user_uuid = _user_uuid
        self.device_uuid = _device_uuid

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
