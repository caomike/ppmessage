# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# 
#

from .basehandler import BaseHandler

from ppmessage.db.models import DeviceUser
from ppmessage.db.models import MessagePush
from ppmessage.db.models import MessagePushTask

from ppmessage.api.error import API_ERR
from ppmessage.core.constant import API_LEVEL
from ppmessage.core.constant import YVOBJECT
from ppmessage.core.constant import TASK_STATUS
from ppmessage.core.constant import MESSAGE_STATUS

from ppmessage.core.utils.datetimestring import string_to_datetime

from operator import itemgetter

import logging
import json
import time

class PPPageHistoryMessageHandler(BaseHandler):
    """
    How to use?
    - the first request:
    {
        conversation_uuid: xxx,
        page_offset: 0, 
        page_size: 30,
    }
    - response { list: [xx, xx, xx, ...], ... }

    - or the request, messages should newer than min_uuid (task_uuid)
    {
        conversation_uuid: xxx,
        page_size: 30,
        min_uuid: xxxx-xxxx-xxxxx-xxxx
    }

    - or the request, messages should older than max_uuid (task_uuid)
    {
        conversation_uuid: xxx,
        page_size: 30,
        max_uuid: xxxx-xxxx-xxxxx-xxxx
    }

    """

    # default is 30
    DEFAULT_PAGE_SIZE = 30

    def _return_tasks(self, _tasks):
        _redis = self.application.redis
        
        _pi = _redis.pipeline()
        for _task_uuid in _tasks:
            _key = MessagePushTask.__tablename__ + ".uuid." + _task_uuid
            _pi.hgetall(_key)
        _task_dicts = _pi.execute()

        _from_users = set()
        for _task in _task_dicts:
            if _task == None:
                continue
            
            # if _task.get("task_status") == TASK_STATUS.PENDING:
            #     continue

            _from_uuid = _task.get("from_uuid")
            if _from_uuid == None:
                continue

            _from_users.add(_task.get("from_uuid"))

        if len(_from_users) == 0:
            logging.error("users of history message is 0")
            return

        _user_fields = ["user_fullname", "user_icon", "user_email", "uuid"]
        _pi = _redis.pipeline()
        for _user_uuid in _from_users:
            _key = DeviceUser.__tablename__ + ".uuid." + _user_uuid
            _pi.hmget(_key, _user_fields)
        _user_arrays = _pi.execute()

        _user_dicts = []
        for _user in _user_arrays:
            if _user == [None] * len(_user_fields) :
                _user_dicts.append(None)
                continue
            _user_dicts.append(dict(zip(_user_fields, _user)))

        _user_dict = {}
        for _user in _user_dicts:
            if _user == None:
                continue
            _user_dict[_user.get("uuid")] = _user

        for _task in _task_dicts:
            if _task == None:
                continue
            _from_uuid = _task.get("from_uuid")
            if _from_uuid == None:
                continue
            _task["from_user"] = _user_dict.get(_from_uuid)
                    
        _rdata = self.getReturnData()
        _rdata["return_count"] = len(_task_dicts)
        _rdata["list"] = _task_dicts
        logging.info("pppagehistorymessage return: %d" % len(_task_dicts))
        return
    
    def _return_by_page(self, _conversation_uuid, _page_offset, _page_size, _total_count):        
        _rdata = self.getReturnData()
        _rdata["return_count"] = 0
        _rdata["page_size"] = _page_size
        _rdata["page_offset"] = _page_offset
        _rdata["list"] = []

        _offset = _page_offset * _page_size
        if _offset >= _total_count:
            logging.error("offset: %d > total: %d" % (_offset, _total_count))
            return
                
        _return_count = _page_size
        if _offset + _page_size >= _total_count:
            _return_count = _total_count - _offset

        _redis = self.application.redis
        _key = MessagePushTask.__tablename__ + ".conversation_uuid." + _conversation_uuid
        _tasks = _redis.zrevrange(_key, _offset, _offset+_return_count-1)
        self._return_tasks(_tasks)
        return

    def _return_by_max(self, _conversation_uuid, _max_uuid, _page_size):
        _rdata = self.getReturnData()
        _rdata["return_count"] = 0
        _rdata["max_uuid"] = _max_uuid
        _rdata["list"] = []

        _redis = self.application.redis
        _key = MessagePushTask.__tablename__ + ".conversation_uuid." + _conversation_uuid
        _max_createtime = _redis.zscore(_key, _max_uuid)
        if _max_createtime == None:
            logging.error("no such task for max_uuid: %s" % _max_uuid)
            return

        _redis = self.application.redis
        _min_item = _redis.zrange(_key, 0, 0)[0]
        _key = MessagePushTask.__tablename__ + ".uuid." + _min_item
        _createtime = _redis.hget(_key, "createtime")
        _createtime = string_to_datetime(_createtime, "extra")
        _createtime = time.mktime(_createtime.timetuple())*1000*1000 + _createtime.microsecond

        if _createtime >  _max_createtime:
            logging.info("no more task for less than max_uuid: %s" % _max_uuid)
            return
        
        _key = MessagePushTask.__tablename__ + ".conversation_uuid." + _conversation_uuid
        _tasks = _redis.zrevrangebyscore(_key, _max_createtime, 0, start=0, num=_page_size)
        if _tasks == None or len(_tasks) == 0:
            return
        
        _tasks.remove(_max_uuid)
        self._return_tasks(_tasks)
        return

    def _return_by_min(self, _conversation_uuid, _min_uuid, _page_size):
        _rdata = self.getReturnData()
        _rdata["return_count"] = 0
        _rdata["min_uuid"] = _min_uuid
        _rdata["list"] = []

        _redis = self.application.redis
        _key = MessagePushTask.__tablename__ + ".conversation_uuid." + _conversation_uuid
        _min_createtime = _redis.zscore(_key, _min_uuid)
        if _min_createtime == None:
            logging.error("no such task for min_uuid: %s" % _min_uuid)
            return

        _max_item = _redis.zrevrange(_key, 0, 0)[0]
        _key = MessagePushTask.__tablename__ + ".uuid." + _max_item
        _createtime = _redis.hget(_key, "createtime")
        _createtime = string_to_datetime(_createtime, "extra")
        _createtime = time.mktime(_createtime.timetuple())*1000*1000 + _createtime.microsecond

        if _createtime <  _min_createtime:
            logging.info("no newer task for than min_uuid: %s" % _min_uuid)
            return

        _key = MessagePushTask.__tablename__ + ".conversation_uuid." + _conversation_uuid
        _tasks = _redis.zrangebyscore(_key, _min_createtime, -1, start=0, num=_page_size)
        if _tasks == None or len(_tasks) == 0:
            return
        
        _tasks.remove(_min_uuid)
        self._return_tasks(_tasks)        
        return
    
    def initialize(self):
        self.addPermission(api_level=API_LEVEL.PPCOM)
        self.addPermission(api_level=API_LEVEL.PPKEFU)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_KEFU)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        return

    def _Task(self):
        super(PPPageHistoryMessageHandler, self)._Task()
        _request = json.loads(self.request.body)
        
        _conversation_uuid = _request.get("conversation_uuid")
        _page_offset = _request.get("page_offset")
        _page_size = _request.get("page_size") #optional
        _max_uuid = _request.get("max_uuid")
        _min_uuid = _request.get("min_uuid")
        
        if _conversation_uuid == None:
            self.setErrorCode(API_ERR.NO_PARA)
            return

        if _max_uuid != None and _min_uuid != None:
            self.setErrorCode(API_ERR.PAGE_MAX_MIN)
            return

        _rdata = self.getReturnData()

        _redis = self.application.redis
        _key = MessagePushTask.__tablename__ + ".conversation_uuid." + _conversation_uuid
        _total_count = _redis.zcount(_key, "-inf", "+inf")
        if _total_count == 0:
            logging.info("no task of conversation_uuid: %s" % _conversation_uuid)
            _rdata["total_count"] = 0
            _rdata["return_count"] = 0
            return

        _rdata["total_count"] = _total_count
        
        if _page_size == None or _page_size < 0:
            _page_size = PPPageHistoryMessageHandler.DEFAULT_PAGE_SIZE

        if _max_uuid == None and _min_uuid == None:
            if _page_offset == None or _page_offset < 0:
                _page_offset = 0
            self._return_by_page(_conversation_uuid, _page_offset, _page_size, _total_count)
            return

        if _max_uuid != None:
            self._return_by_max(_conversation_uuid, _max_uuid, _page_size)
            return

        if _min_uuid != None:
            self._return_by_min(_conversation_uuid, _min_uuid, _page_size)
            return
        
        _rdata["return_count"] = 0
        return
