# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from ppmessage.yvredis.genericupdate import generic_update
from ppmessage.db.models import DeviceInfo
from ppmessage.api.error import API_ERR

import json
import copy
import logging

class PPUpdateDeviceHandler(BaseHandler):
    """
    requst:
    header
    device_uuid, ppmessage device uuid
    device_os_type
    device_ios_token
    ...

    response:
    json with error_code

    """
    def _update(self, _device_uuid, _request):
        _redis = self.application.redis
        _data = copy.deepcopy(_request)
        del _data["device_uuid"]
        _updated = generic_update(_redis, DeviceInfo, _device_uuid, _data)
        if not _updated:
            self.setErrorCode(API_ERR.GENERIC_UPDATE)
        return

    def _Task(self):
        super(PPUpdateDeviceHandler, self)._Task()
        _request = json.loads(self.request.body)
        _device_uuid = _request.get("device_uuid")
        if _device_uuid == None:
            logging.error("no device_uuid.")
            self.setErrorCode(API_ERR.NO_PARA)
            return
        self._update(_device_uuid, _request)
        return

