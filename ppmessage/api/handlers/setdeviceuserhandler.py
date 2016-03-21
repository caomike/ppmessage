# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# Guijin Ding, dingguijin@gmail.com
#

from .basehandler import BaseHandler

from ppmessage.db.models import DeviceUser
from ppmessage.db.models import FileInfo

from ppmessage.api.error import API_ERR
from ppmessage.core.constant import API_LEVEL
from ppmessage.core.redis import redis_hash_to_dict

import datetime
import logging
import json

class SetDeviceUserHandler(BaseHandler):
    """
    requst:
    header
    body {id:, email:, fullname:, password:, icon:,}

    response:
    user id

    """

    def _post(self, _request):
        _redis = self.application.redis

        _user_uuid = _request.get("user_uuid")
        if _user_uuid == None:
            logging.error("no user_uuid")
            self.setErrorCode(API_ERR.NO_PARA)
            return
        
        _user = redis_hash_to_dict(_redis, DeviceUser, _user_uuid)
        if _user is None:
            logging.error("No user %s." % _user_uuid)
            self.setErrorCode(API_ERR.NO_USER)
            return

        _values = {"uuid": _user_uuid}

        _email = _request.get("email")
        _icon = _request.get("icon")
        _password = _request.get("password")
        _fullname = _request.get("fullname")
        
        if _email is not None:
            _values["user_email"] = _email
            
        if _password is not None:
            _values["user_password"] = _password

        if _fullname is not None:
            _values["user_fullname"] = _fullname

        if _icon is not None:
            _file = redis_hash_to_dict(_redis, FileInfo, _icon)
            if _file is not None:
                _values["user_icon"] = _file.get("uuid")
            else:
                logging.error("No file: %s." % _icon)
                self.setErrorCode(API_ERR.NO_FILE)
                return
            
        if len(_values) > 1:
            _row = DeviceUser(**_values)
            _row.update_redis_keys(_redis)
            _row.async_update()

        return

    def initialize(self):
        self.addPermission(api_level=API_LEVEL.PPCOM)
        self.addPermission(api_level=API_LEVEL.PPKEFU)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_KEFU)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        return
    
    def _Task(self):
        super(SetDeviceUserHandler, self)._Task()
        _request = json.loads(self.request.body)
        self._post(_request)
        
