# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# kun zhao
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

class RegisterDUByMobileHandler(BaseHandler):
    
    def _input_data(self):
        if not self._JSON():
            self.writeError(API_ERR.NO_JSON)
            return False

        self.input_data = json.loads(self.request.body)
        
        if "mobile" not in self.input_data\
           or "verify_code" not in self.input_data\
           or "password" not in self.input_data:
            self.writeError(API_ERR.NO_PARA)
            return False
        
        return True

    '''
    validate verify code is right
    '''
    def _validateVerifyCode(self, mobile, verifyCode):

        _key = "mobile:" + str(mobile)
        _redis = self.application.redis
        
        if _redis.ttl(_key) > 0:
            return int(_redis.get(_key)) == int(verifyCode)

        return False

    '''
    get email
    '''
    def _buildEmailByMobile(self, mobile):
        return str(mobile) + "@yvertical.com"

    def _user(self):
        """
        check password and get self.user
        """

        _username = str(self.input_data.get("mobile"))
        _verification_code = self.input_data.get("verify_code")
        _password = self.input_data.get("password")

        if self._validateVerifyCode(_username, _verification_code) is False:
            self.setErrorCode(API_ERR.ERROR_VERIFY_CODE)
            return False
        
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
                "user_email": self._buildEmailByMobile(_username),
                "user_fullname": _username,
                "createtime": datetime.datetime.now(),
                "updatetime": datetime.datetime.now()
            }
        }
        signal_cache_add(_add)
        
        _n = DeviceUser.__tablename__ + \
             ".user_name." + _username
        self.application.redis.set(_n, _user_uuid)

        _n = DeviceUser.__tablename__ + \
             ".user_fullname." + _username + \
             ".uuid." + _user_uuid
        self.application.redis.set(_n, "0")
        
        return True

    def _register(self):

        if self._input_data() is False:
            return

        if self._user() is False:
            return

        return

    def _Before(self):
        """
        for login/register must overwrite
        """
        return True

    def _Task(self):
        super(RegisterDUByMobileHandler, self)._Task()

        logging.info("REGISTER_DU_BY_MOBILE with %s." % (self.request.body))
        self._register()

        return
