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
from ppmessage.core.redis import redis_hash_to_dict

from ppmessage.api.error import API_ERR
from ppmessage.core.constant import CONVERSATION_TYPE
from ppmessage.core.constant import CONVERSATION_STATUS
from ppmessage.core.constant import API_LEVEL

import json
import time
import logging

class PPGetUserConversationListHandler(BaseHandler):
    def _get_latest_message(self, conv):
        _task_uuid = conv.get("latest_task")
        if _task_uuid is None:
            return None
        
        _task = redis_hash_to_dict(self.application.redis, MessagePushTask, _task_uuid)
        return _task

    def _get_from_user(self, conv):
        _user_uuid = conv.get("user_uuid")
        if _user_uuid is None:
            return None
        
        _user = redis_hash_to_dict(self.application.redis, DeviceUser, _user_uuid)

        if _user is None:
            return None

        _r = {}
        _r["uuid"] = _user.get("uuid")
        _r["user_name"] = _user.get("user_name")
        _r["user_email"] = _user.get("user_email")
        _r["user_firstname"] = _user.get("user_firstname")
        _r["user_lastname"] = _user.get("user_lastname")
        _r["user_fullname"] = _user.get("user_fullname")
        _r["user_icon"] = _user.get("user_icon")
        _r["user_status"] = _user.get("user_status")
        _r["updatetime"] = int(time.mktime(_user["updatetime"].timetuple()))
        _r["createtime"] = int(time.mktime(_user["createtime"].timetuple()))
        return _r

    def _get_conversation_list(self, _conversations):
        _redis = self.application.redis
        _conv_list = []
        _d_key_pre = ConversationUserData.__tablename__ + \
                     ".app_uuid." + self._app_uuid + \
                     ".user_uuid." + self._user_uuid + \
                     ".conversation_uuid."
        for _conversation_uuid in _conversations:
            _conversation = redis_hash_to_dict(self.application.redis, ConversationInfo, _conversation_uuid)
            _d_key = _redis.get(_d_key_pre + _conversation_uuid)
            _data = redis_hash_to_dict(self.application.redis, ConversationUserData, _d_key)
            _conversation["conversation_data"] = _data
            _conversation["from_user"] = self._get_from_user(_conversation)
            _conversation["latest_message"] = self._get_latest_message(_conversation)
            _conv_list.append(_conversation)
        return _conv_list
    
    def _get(self):
        _redis = self.application.redis
        _key = ConversationUserData.__tablename__ + \
               ".app_uuid." + self._app_uuid + \
               ".user_uuid." + self._user_uuid
        _conversations = _redis.smembers(_key)

        _pi = _redis.pipeline()
        for _conversation_uuid in _conversations:
            _key = ConversationUserData.__tablename__ + \
                   ".app_uuid." + self._app_uuid + \
                   ".user_uuid." + self._user_uuid + \
                   ".conversation_uuid." + _conversation_uuid
            _pi.get(_key)
        _datas = _pi.execute()
        
        _pi = _redis.pipeline()
        _pre = ConversationUserData.__tablename__ + ".uuid."
        for _data_uuid in _datas:
            _key = _pre + _data_uuid
            _pi.hget(_key, "conversation_status")
        _status = _pi.execute()
        
        _cd = dict(zip(_conversations, _status))
        _l = []
        for _i in _cd:
            if _cd[_i] == CONVERSATION_STATUS.OPEN:
                _l.append(_i)

        _r = self.getReturnData()
        _r["list"] = self._get_conversation_list(_l)
        return None
    
    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCOM)
        self.addPermission(api_level=API_LEVEL.PPKEFU)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_KEFU)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        return

    def _Task(self):
        super(PPGetUserConversationListHandler, self)._Task()
        _body = json.loads(self.request.body)
        self._app_uuid = _body.get("app_uuid")
        self._user_uuid = _body.get("user_uuid")
        if self._app_uuid == None or self._user_uuid == None:
            self.setErrorCode(API_ERR.NO_PARA)
            return
        self._get()
        return None

