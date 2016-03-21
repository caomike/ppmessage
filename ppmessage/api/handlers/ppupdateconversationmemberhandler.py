# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from ppmessage.db.models import AppInfo
from ppmessage.db.models import FileInfo
from ppmessage.db.models import DeviceUser
from ppmessage.db.models import ConversationInfo
from ppmessage.db.models import ConversationUserData

from ppmessage.api.error import API_ERR
from ppmessage.core.redis import redis_hash_to_dict
from ppmessage.core.constant import API_LEVEL
from ppmessage.core.constant import CONVERSATION_TYPE
from ppmessage.core.constant import CONVERSATION_STATUS
from ppmessage.core.constant import CONVERSATION_MEMBER_ACTION

import uuid
import json
import logging

class PPUpdateConversationMemberHandler(BaseHandler):
    """
    requst:
    header
    app_uuid, user_uuid
    
    response:
    json with error_code

    """

    def _add(self):
        _redis = self.application.redis        
        for _user_uuid in self._member_list:
            key = ConversationUserData.__tablename__ + \
                  ".app_uuid." + self._app_uuid + \
                  ".user_uuid." + _user_uuid + \
                  ".conversation_uuid." + self._conv_uuid
            if _redis.exists(key):
                continue
            _values = {
                "uuid": str(uuid.uuid1()),
                "user_uuid": _user_uuid,
                "app_uuid": self._app_uuid,
                "conversation_uuid": self._conv_uuid,
                "conversation_status": CONVERSATION_STATUS.OPEN,
                "conversation_type": self._conv["conversation_type"],
            }
            _row = ConversationUserData(**_values)
            _row.async_add()
            _row.create_redis_keys(_redis)
        return
    
    def _remove(self):
        _redis = self.application.redis
        for _user_uuid in self._member_list:
            key = ConversationUserData.__tablename__ + \
                  ".app_uuid." + self._app_uuid + \
                  ".user_uuid." + _user_uuid + \
                  ".conversation_uuid." + self._conv_uuid
            _uuid = _redis.get(key)
            if _uuid == None:
                continue
            _row = ConversationUserData(uuid=_uuid)
            _row.async_delete()
            _row.delete_redis_keys(_redis)
        return

    def _update_group(self):
        _row = ConversationInfo(uuid=self._conv.get("uuid"), group_uuid=self._group_uuid)
        _row.async_update()
        _row.update_redis_keys(self.application.redis)
        return
        
    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCOM)
        self.addPermission(api_level=API_LEVEL.PPKEFU)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_KEFU)
        return
    
    def _Task(self):
        super(PPUpdateConversationMemberHandler, self)._Task()
        _request = json.loads(self.request.body)

        self._app_uuid = _request.get("app_uuid")
        self._action = _request.get("action")
        self._member_list = _request.get("member_list")
        self._conv_uuid = _request.get("conversation_uuid")
        self._group_uuid = _request.get("group_uuid")
        
        if self._conv_uuid == None or \
           self._app_uuid == None or \
           self._action == None or \
           self._member_list == None:
            logging.error("no conv_uuid/app_uuid/action/member_list.")
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _redis = self.application.redis
        self._conv = redis_hash_to_dict(_redis, ConversationInfo, self._conv_uuid)
        if self._conv == None:
            logging.error("no such conversation for uuid: %s" % self._conv_uuid)
            self.setErrorCode(API_ERR.NO_CONVERSATION)
            return

        if self._group_uuid != None and self._action == CONVERSATION_MEMBER_ACTION.ADD:
            self._update_group()
                
        if self._action == CONVERSATION_MEMBER_ACTION.ADD:
            self._add()
            return

        if self._action == CONVERSATION_MEMBER_ACTION.REMOVE:
            self._remove()
            return

        return

