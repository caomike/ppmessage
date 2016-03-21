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

import uuid
import json
import logging

class PPCreateDeviceHandler(BaseHandler):
    """
    request:
    user_uuid, 
    device_id, for mobile device, it comes from mobile system, must provided. for browser, it is None
    ppcom_trace_uuid, for mobile device, it is None; for browser must provided.
    device_ostype, must provided

    response:
    json with error_code

    """

    """
    Update current devices associated with the user `_user_uuid`
    """
    def _user(self, _device_uuid):
        _v = {"ppcom_mobile_device_uuid": _device_uuid}
        if self._is_browser == True:
            _v = {"ppcom_browser_device_uuid": _device_uuid}

        _v["uuid"] = self._user_uuid
        _row = DeviceUser(**_v)
        _row.async_update()
        _row.update_redis_keys(self.application.redis)
        return

    """
    Handle device `_device_uuid` existed event
    """
    def _existed(self, _device_uuid):
        self._user(_device_uuid)
        self.setErrorCode(API_ERR.EX_DEVICE)
        _rdata = self.getReturnData()
        _rdata["device_uuid"] = _device_uuid
        return

    def _create(self):
        _redis = self.application.redis
        _device_uuid = None
        _terminal_uuid = self._device_id

        _key = DeviceInfo.__tablename__ + ".terminal_uuid." + _terminal_uuid
        if _redis.exists(_key):
            self._existed(_redis.get(_key))
            return

        _device_uuid = str(uuid.uuid1())
        _row = DeviceInfo(uuid=_device_uuid, app_uuid=self._app_uuid, user_uuid=self._user_uuid, is_ppcom_device=True,
                          device_ostype=self._device_ostype, terminal_uuid=_terminal_uuid)
        _row.async_add()
        _row.create_redis_keys(self.application.redis)

        self._user(_device_uuid)
        _rdata = self.getReturnData()
        _rdata["device_uuid"] = _device_uuid
        return

    def _prepare(self, _request):
        """
        device_id from mobile
        ppcom_trace_uuid from browser
        """
        self._app_uuid = _request.get("app_uuid")
        self._device_id = _request.get("device_id")
        self._user_uuid = _request.get("user_uuid")
        self._device_ostype = _request.get("device_ostype")
        self._ppcom_trace_uuid = _request.get("ppcom_trace_uuid")
        
        if self._user_uuid == None or self._device_ostype == None:
            self.setErrorCode(API_ERR.NO_PARA)
            return False

        if self._device_id == None and self._ppcom_trace_uuid == None:
            self.setErrorCode(API_ERR.NO_PARA)
            return False

        self._is_browser = True
        if self._device_ostype == OS.AND or self._device_ostype == OS.IOS:
            self._is_browser = False
        
        if self._ppcom_trace_uuid != None:
            self._device_id = self._ppcom_trace_uuid

        return True

    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCOM)
        self.addPermission(api_level=API_LEVEL.PPKEFU)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_KEFU)
        return
        
    def _Task(self):
        super(PPCreateDeviceHandler, self)._Task()
        _request = json.loads(self.request.body)
        if not self._prepare(_request):
            return
        self._create()
        return

