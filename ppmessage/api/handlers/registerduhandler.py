# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from mdm.core.srv.signal import signal_cache_add
from mdm.db.models import DeviceUser

from mdm.api.error import API_ERR

import logging
import datetime
import traceback
import json
import uuid

class RegisterDUHandler(BaseHandler):

#2=========================================    
    def _input_data(self):
        if not self._JSON():
            self.writeError(API_ERR.NO_JSON)
            return False

        self.input_data = json.loads(self.request.body)
        
        if "email" not in self.input_data\
           or "fullname" not in self.input_data\
           or "password" not in self.input_data:
            self.writeError(API_ERR.NO_PARA)
            return False

        return True

    def _user(self):
        """
        check password and get self.user
        """

        _username = self.input_data.get("email")
        _fullname = self.input_data.get("fullname")
        _password = self.input_data.get("password")
        
        _redis = self.application.redis
        _key = DeviceUser.__tablename__ + \
               ".user_name." + _username
        if _redis.exists(_key):
            self.setErrorCode(API_ERR.EX_USER)
            return False

        _user_uuid = str(uuid.uuid1())
        
        _add = {
            "table": DeviceUser.__tablename__,
            "key": "uuid." + _user_uuid,
            "values": {
                "uuid": _user_uuid,
                "user_name": _username,
                "user_password": _password,
                "user_email": _username,
                "user_fullname": _fullname,
                "createtime": datetime.datetime.now(),
                "updatetime": datetime.datetime.now()
            }
        }
        signal_cache_add(_add)
        
        _n = DeviceUser.__tablename__ + \
             ".user_name." + _username
        self.application.redis.set(_n, _user_uuid)

        _n = DeviceUser.__tablename__ + \
             ".user_fullname." + _fullname + \
             ".uuid." + _user_uuid
        self.application.redis.set(_n, "0")
        
        return True

#1============================================
    def _register(self):

        if self._input_data() is False:
            return

        if self._user() is False:
            return

        return

#0============================================        
    def _Before(self):
        """
        for login/register must overwrite
        """
        return True

    def _Task(self):
        super(RegisterDUHandler, self)._Task()

        logging.info("REGISTERDU with %s." % (self.request.body))
        self._register()

        return
