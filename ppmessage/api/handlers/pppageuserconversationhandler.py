# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from ppmessage.db.models import DeviceUser
from ppmessage.db.models import MessagePushTask
from ppmessage.db.models import ConversationInfo
from ppmessage.db.models import ConversationUserData

from ppmessage.api.error import API_ERR
from ppmessage.core.constant import CONVERSATION_TYPE
from ppmessage.core.constant import CONVERSATION_STATUS

import json
import time
import logging

class PPPageUserConversationHandler(BaseHandler):
    
    def _get(self):
        _redis = self.application.redis
        _key = ConversationUserData.__tablename__ + ".app_uuid." + self._app_uuid + \
               ".user_uuid." + self._user_uuid + ".conversation_status." + CONVERSATION_STATUS.OPEN

        _r = self.getReturnData()
        _r["total_count"] = 0
        _r["return_count"] = 0
        _r["page_offset"] = self._page_offset
        _r["page_size"] = self._page_size
        _r["list"] = []

        _total_count = _redis.zcount(_key, "-inf", "+inf")
        if _total_count == 0:
            logging.info("no conversation for user: %s" % self._user_uuid)
            return

        _offset = self._page_offset * self._page_size
        if _offset >= _total_count:
            logging.error("page offset: %d > covnersation total: %d" % (_offset, _total_count))
            return
                
        _return_count = self._page_size
        if _offset + self._page_size >= _total_count:
            _return_count = _total_count - _offset

        _conversations = _redis.zrevrange(_key, _offset, _offset+_return_count-1)
        
        _pi = _redis.pipeline()
        for _conversation_uuid in _conversations:
            _key = ConversationUserData.__tablename__ + ".app_uuid." + self._app_uuid + \
                   ".user_uuid." + self._user_uuid + ".conversation_uuid." + _conversation_uuid
            _pi.get(_key)
        _datas = _pi.execute()

        _pi = _redis.pipeline()
        for _data_uuid in _datas:
            _key = ConversationUserData.__tablename__ + ".uuid." + _data_uuid
            _pi.hgetall(_key)
        _data_dicts = _pi.execute()
        
        _pi = _redis.pipeline()
        for _conversation_uuid in _conversations:
            _key = ConversationInfo.__tablename__ + ".uuid." + _conversation_uuid
            _pi.hgetall(_key)
        _conversation_dicts = _pi.execute()
                
        _from_users = []
        _latest_tasks = []
        for _conversation in _conversation_dicts:
            _from_users.append(_conversation.get("user_uuid"))
            _latest_tasks.append(_conversation.get("latest_task"))

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
        
        _task_fields = ["message_body", "message_subtype", "message_type", "body", "conversation_type", "from_uuid", "from_type", "uuid", "createtime", "updatetime"]
        _pi = _redis.pipeline()
        for _task_uuid in _latest_tasks:
            _key = MessagePushTask.__tablename__ + ".uuid." + _task_uuid
            _pi.hmget(_key, _task_fields)
        _task_arrays = _pi.execute()

        _task_dicts = []
        for _task in _task_arrays:
            if _task == [None] * len(_task_fields):
                _task_dicts.append(None)
                continue
            _task_dicts.append(dict(zip(_task_fields, _task)))

        for _i in range(_return_count):
            _conversation_dicts[_i]["conversation_data"] = _data_dicts[_i]
            _conversation_dicts[_i]["from_user"] = _user_dicts[_i]
            _conversation_dicts[_i]["latest_message"] = _task_dicts[_i]
            
        _r = self.getReturnData()
        _r["total_count"] = _total_count
        _r["return_count"] = _return_count
        _r["page_offset"] = self._page_offset
        _r["page_size"] = self._page_size
        _r["list"] = _conversation_dicts
        return
    
    def _Task(self):
        super(PPPageUserConversationHandler, self)._Task()
        _body = json.loads(self.request.body)
        self._app_uuid = _body.get("app_uuid")
        self._user_uuid = _body.get("user_uuid")
        self._page_offset = _body.get("page_offset")
        self._page_size = _body.get("page_size")
        
        if self._app_uuid == None or self._user_uuid == None:
            self.setErrorCode(API_ERR.NO_PARA)
            return
        
        if self._page_offset == None or self._page_offset < 0:
            self._page_offset = 0
        if self._page_size == None or self._page_size < 0:
            self._page_size = 30
            
        self._get()
        return

