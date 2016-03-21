# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from ppmessage.db.models import AdminUser
from ppmessage.db.models import DeviceUser

from ppmessage.api.error import API_ERR
from ppmessage.core.constant import API_LEVEL
from ppmessage.core.constant import YVOBJECT
from ppmessage.core.redis import redis_hash_to_dict

import pypinyin
from pypinyin import lazy_pinyin
from pypinyin import pinyin
import base64
import os
import json
import time
import datetime
import itertools
import logging

class PPGetUserDetailHandler(BaseHandler):
    """
    discription:
    receive device user uuid, return device user detail.
    
    request:
    user_uuid, device user uuid
    
    response:
    user detail with error_code
    """

    def _du(self, _request, _rdata):
        if "user_uuid" not in _request:
            self.setErrorCode(API_ERR.NO_PARA)
            logging.error("Error for no para: %s.", (str(_request)))
            return

        _o = redis_hash_to_dict(self.application.redis, DeviceUser, _request["user_uuid"])

        if _o == None:
            self.setErrorCode(API_ERR.NO_OBJECT)
            logging.error("Error for no user uuid: %s." % (_request["user_uuid"]))
            return

        # not return the password default
        return_password = False
        if "return_password" in _request:
            return_password = _request["return_password"]
        if not return_password:
            del _o["user_password"]
        
        _fn = _o.get("user_fullname")
        if not isinstance(_fn, unicode):
            _fn = _fn.decode("utf-8")

        _rdata.update(_o)
        _rdata["pinyinname0"] = "".join(lazy_pinyin(_fn))
        _rdata["pinyinname1"] = "".join(list(itertools.chain.from_iterable(pinyin(_fn, style=pypinyin.INITIALS))))
        
        return
    
    def initialize(self):
        self.addPermission(api_level=API_LEVEL.PPCOM)
        self.addPermission(api_level=API_LEVEL.PPKEFU)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_KEFU)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        return

    def _Task(self):
        super(PPGetUserDetailHandler, self)._Task()
        _request = json.loads(self.request.body)
        _rdata = self.getReturnData()
        self._du(_request, _rdata)
        #logging.info("GETYVOBJECTDETAIL return " + str(_rdata))


