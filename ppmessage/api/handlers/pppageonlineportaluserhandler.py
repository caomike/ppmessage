# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# 
#

from .basehandler import BaseHandler

from ppmessage.api.error import API_ERR
from ppmessage.db.models import DeviceInfo
from ppmessage.db.models import DeviceUser

from ppmessage.core.constant import API_LEVEL

import traceback
import logging
import json
import copy

class PPPageOnlinePortalUserHandler(BaseHandler):

    def _detail(self, _user_list):
        _devices = []
        _users = []
        for _user in _user_list:
            _user = json.loads(_user)
            _users.append(_user[0])
            _devices.append(_user[1])
            
        _redis = self.application.redis

        _pi = _redis.pipeline()
        for _device_uuid in _devices:
            _key = DeviceInfo.__tablename__ + ".uuid." + _device_uuid
            _pi.hgetall(_key)
        _device_dicts = _pi.execute()

        _device_dict = {}
        for _device in _device_dicts:
            _device_dict[_device.get("uuid")] = _device

        _user_fields = ["uuid", "user_fullname", "user_email", "ppcom_browser_device_uuid", "ppcom_mobile_device_uuid"]
        for _user_uuid in _users:
            _key = DeviceUser.__tablename__ + ".uuid." + _user_uuid
            _pi.hmget(_key, _user_fields)
        _user_arrays = _pi.execute()

        _user_dicts = []
        for _user in _user_arrays:
            _user_dicts.append(dict(zip(_users_fields, _user)))

        _device_labels = ["ppcom_browser_device", "ppcom_mobile_device"]
        for _user in _user_dicts:
            for _label in _device_labels:
                if _user.get(_label + "_uuid") != None:
                    _user[_label] = _device_dict.get(_user.get(_label + "_uuid"))

        return _user_dicts

    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPKEFU)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_KEFU)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        return
    
    def _Task(self):
        super(PPPageOnlinePortalUserHandler, self)._Task()

        _request = json.loads(self.request.body)
        _app_uuid = _request.get("app_uuid")

        if _app_uuid == None:
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
        _key = DeviceInfo.__tablename__ + ".app_uuid." + _app_uuid + \
               ".is_ppcom_device.True.device_is_online.True"
        _total_count = _redis.zcount(_key, "-inf", "+inf")

        _r = self.getReturnData()
        _r["total_count"] = _total_count
        _r["return_count"] = 0
        _r["page_size"] = _page_size
        _r["page_offset"] = _page_offset
        _r["list"] = []

        if _total_count == 0:
            logging.info("no online portal user of app: %s" % _app_uuid)
            return

        _offset = _page_offset * _page_size
        if _offset >= _total_count:
            logging.error("offset: %d > total: %d" % (_offset, _total_count))
            return
                
        _return_count = _page_size
        if _offset + _page_size >= _total_count:
            _return_count = _total_count - _offset

        _user_list = _redis.zrevrange(_key, _offset, _offset+_return_count-1)
        
        if _user_list == None or len(_user_list) == 0:
            return

        _user_list = self._detail(_user_list)
        _r["list"] = _user_list
        _r["return_count"] = _return_count
        return
