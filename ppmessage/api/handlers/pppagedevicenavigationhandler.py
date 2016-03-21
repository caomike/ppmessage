# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# 
#

from .basehandler import BaseHandler

from ppmessage.api.error import API_ERR
from ppmessage.db.models import DeviceNavigationData
from ppmessage.core.constant import API_LEVEL

import traceback
import logging
import json
import copy

class PPPageDeviceNavigationHandler(BaseHandler):

    def _detail(self, _list):
        return _list
    
    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCOM)
        self.addPermission(api_level=API_LEVEL.PPKEFU)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_KEFU)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        return

    def _Task(self):
        super(PPPageDeviceNavigationHandler, self)._Task()

        _request = json.loads(self.request.body)
        _app_uuid = _request.get("app_uuid")
        _device_uuid = _request.get("device_uuid")

        if _app_uuid == None or _device_uuid == None:
            logging.error("not enough parameters.")
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _page_offset = _request.get("page_offset")
        if _page_offset == None or _page_offset < 0:
            _page_offset = 0
            
        _page_size = _request.get("page_size")
        if _page_size == None or _page_size < 0:
            _page_size = 30
            
        _redis = self.application.redis
        _key = DeviceNavigationData.__tablename__ + ".app_uuid." + _app_uuid + ".device_uuid." + _device_uuid
        _total_count = _redis.zcount(_key, "-inf", "+inf")

        _r = self.getReturnData()
        _r["total_count"] = _total_count
        _r["return_count"] = 0
        _r["page_size"] = _page_size
        _r["page_offset"] = _page_offset
        _r["list"] = []

        if _total_count == 0:
            logging.info("no navigation data for device: %s" % _device_uuid)
            return

        _offset = _page_offset * _page_size
        if _offset >= _total_count:
            logging.error("offset: %d > total: %d" % (_offset, _total_count))
            return
                
        _return_count = _page_size
        if _offset + _page_size >= _total_count:
            _return_count = _total_count - _offset

        _list = _redis.zrevrange(_key, _offset, _offset+_return_count-1)
        
        if _list == None or len(_list) == 0:
            return

        _list = self._detail(_list)
        _r["list"] = _user_list
        _r["return_count"] = _return_count
        return
