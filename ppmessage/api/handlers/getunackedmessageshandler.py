# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# 
#

from .basehandler import BaseHandler

from ppmessage.db.models import MessagePush
from ppmessage.db.models import MessagePushTask

from ppmessage.api.error import API_ERR

from ppmessage.core.constant import API_LEVEL
from ppmessage.core.constant import MESSAGE_STATUS
from ppmessage.core.redis import redis_hash_to_dict

import traceback
import logging
import json
import copy

class GetUnackedMessagesHandler(BaseHandler):
    """
    get all unacked message for this user/device/app
    
    request:
    
    response:    
    {error_code:, size:len(list), list:{push_uuid,}, message:{push_uuid:{},}}
    """

    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCOM)
        self.addPermission(api_level=API_LEVEL.PPKEFU)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_KEFU)
        return

    def _detail(self, _task_list):
        _redis = self.application.redis
        _pre = MessagePushTask.__tablename__ + ".uuid."
        _pi = _redis.pipeline()
        _push_list = []
        for _task in _task_list:
            _task = json.loads(_task)
            _key = _pre + _task[0]
            _s = _redis.hgetall(_key)
            _pi.hget(_key, "message_body")
            _push_list.append(_task[1])
        _d = _pi.execute()

        _m = dict(zip(_push_list, _d))
        _return = self.getReturnData()
        _return["list"] = copy.deepcopy(_push_list)
        _return["message"] = _m
        _return["size"] = len(_push_list)
        return
    
    def _Task(self):
        super(GetUnackedMessagesHandler, self)._Task()

        _request = json.loads(self.request.body)
        _from_uuid = _request.get("from_uuid")
        _device_uuid = _request.get("device_uuid")

        if _from_uuid == None or _device_uuid == None:
            logging.error("not enough parameters.")
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _redis = self.application.redis
        _key = MessagePush.__tablename__ + ".app_uuid." + self.app_uuid + ".user_uuid." + _from_uuid + ".device_uuid." + _device_uuid
        _task_list = _redis.zrange(_key, 0, -1)
        
        _r = self.getReturnData()
        _r["size"] = 0
        _r["list"] = []
        _r["message"] = {}

        if _task_list == None or len(_task_list) == 0:
            return
        
        self._detail(_task_list)
        return
