# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#

from .basehandler import BaseHandler

from ppmessage.db.models import DeviceInfo
from ppmessage.db.models import DeviceUser
from ppmessage.core.redis import redis_hash_to_dict
from ppmessage.core.constant import INVALID_IOS_TOKEN
from ppmessage.core.constant import API_LEVEL

from ppmessage.api.error import API_ERR

import logging
import json

class SetDeviceInfoHandler(BaseHandler):
    """
    requst:
    header with device uuid
    body {fullname:, ostype:, osversion:, apilevel:, phone:, iostoken:, iosmodel:,}

    ostype: IOS/ANDROID/WP/MAC/WIN/LINUX
    response:
    device id/ device uuid

    """

    def _post(self, _request):
        _device_uuid = _request.get("device_uuid")

        if _device_uuid == None:
            self.setErrorCode(API_ERR.ERR_PARAM)
            return

        _redis = self.application.redis
        _device = redis_hash_to_dict(_redis, DeviceInfo, _device_uuid)

        if _device is None:
            logging.error("Error NO DEVICE for key [%s] ." % (_key))
            self.setErrorCode(API_ERR.NO_DEVICE)
            return

        _values = {
            "uuid": _device_uuid
        }
        
        if "fullname" in _request:
            _values["device_fullname"]= _request["fullname"]

        if "ostype" in _request:
            _values["device_ostype"] = _request["ostype"].upper()
                
        if "osversion" in _request:
            _values["device_osversion"] = _request["osversion"]

        # apilevel for android
        if "apilevel" in _request:
            _values["device_android_apilevel"] = _request["apilevel"]
            
        # phone number for phone
        if "phone" in _request:
            _values["device_phonenumber"] = _request["phone"]

        if "iosmodel" in _request:
            _values["device_ios_model"] = _request["iosmodel"]

        if "iostoken" in _request:
            _values["device_ios_token"] = _request["iostoken"]
            self.application.redis.srem(INVALID_IOS_TOKEN, _request["iostoken"])

        _row = DeviceInfo(**_values)
        _row.update_redis_keys(_redis)
        _row.async_update()        
        return

    def initialize(self):
        self.addPermission(api_level=API_LEVEL.PPKEFU)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_KEFU)
        return
        
    def _Task(self):
        super(SetDeviceInfoHandler, self)._Task()
        self._post(json.loads(self.request.body))
    

