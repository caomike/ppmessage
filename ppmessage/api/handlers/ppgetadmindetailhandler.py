# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from mdm.db.models import AdminUser
from mdm.db.models import DeviceUser

from mdm.api.error import API_ERR

from mdm.core.constant import YVOBJECT
from mdm.core.redis import redis_hash_to_dict

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

class PPGetAdminDetailHandler(BaseHandler):

    def _du(self, _request, _rdata):
        if "user_uuid" not in _request:
            self.setErrorCode(API_ERR.NO_PARA)
            logging.error("Error for no para: %s.", (str(_request)))
            return

        _o = redis_hash_to_dict(self.application.redis, AdminUser, _request["user_uuid"])

        if _o == None:
            self.setErrorCode(API_ERR.NO_OBJECT)
            logging.error("Error for no user uuid: %s." % (_request["user_uuid"]))
            return

        # not return the password
        del _o["user_password"]
        
        _fn = _o.get("user_fullname")
        if not isinstance(_fn, unicode):
            _fn = _fn.decode("utf-8")

        
        _rdata.update(_o)
        _rdata["pinyinname0"] = "".join(lazy_pinyin(_fn))
        _rdata["pinyinname1"] = "".join(list(itertools.chain.from_iterable(pinyin(_fn, style=pypinyin.INITIALS))))

        return
    
    def _Task(self):
        super(PPGetUserDetailHandler, self)._Task()
        _request = json.loads(self.request.body)
        _rdata = self.getReturnData()
        self._du(_request, _rdata)
        #logging.info("GETYVOBJECTDETAIL return " + str(_rdata))


