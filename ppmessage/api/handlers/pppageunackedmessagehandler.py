# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# 
#

from .basehandler import BaseHandler

from ppmessage.api.error import API_ERR
from ppmessage.db.models import MessagePush
from ppmessage.db.models import MessagePushTask

from ppmessage.core.constant import API_LEVEL

import traceback
import logging
import json
import copy

class PPPageUnackedMessageHandler(BaseHandler):

    def _detail(self, _task_list):
        _redis = self.application.redis
        _pre = MessagePushTask.__tablename__ + ".uuid."
        _pi = _redis.pipeline()
        _push_list = []
        for _task in _task_list:
            _task = json.loads(_task)
            _key = _pre + _task[0]
            _pi.hget(_key, "message_body")
            _push_list.append(_task[1])
        _d = _pi.execute()

        # FIXME: from user detail
        _m = dict(zip(_push_list, _d))
        _return = self.getReturnData()
        _return["list"] = copy.deepcopy(_push_list)
        _return["message"] = _m
        return
    
    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCOM)        
        self.addPermission(api_level=API_LEVEL.PPKEFU)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_KEFU)
        return
    
    def _Task(self):
        super(PPPageUnackedMessageHandler, self)._Task()

        _request = json.loads(self.request.body)
        _app_uuid = _request.get("app_uuid")
        _user_uuid = _request.get("user_uuid")
        _device_uuid = _request.get("device_uuid")

        if _user_uuid == None or _device_uuid == None:
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
        _key = MessagePush.__tablename__ + ".app_uuid." + _app_uuid + \
               ".user_uuid." + _user_uuid + ".device_uuid." + _device_uuid
        _total_count = _redis.zcount(_key, "-inf", "+inf")

        if _total_count == 0:
            logging.info("no unacked messages of user: %s" % _user_uuid)
            return

        _offset = _page_offset * _page_size
        if _offset >= _total_count:
            logging.error("page offset: %d > total: %d" % (_offset, _total_count))
            return
                
        _return_count = _page_size
        if _offset + _page_size >= _total_count:
            _return_count = _total_count - _offset

        _task_list = _redis.zrevrange(_key, _offset, _offset+_return_count-1)
                
        _r = self.getReturnData()
        _r["total_count"] = _total_count
        _r["return_count"] = 0
        _r["page_size"] = _page_size
        _r["page_offset"] = _page_offset
        _r["list"] = []
        _r["message"] = {}

        if _task_list == None or len(_task_list) == 0:
            return
        
        self._detail(_task_list)
        return
