# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from ppmessage.db.models import ConversationUserData
from ppmessage.db.models import ConversationInfo
from ppmessage.db.models import DeviceUser

from ppmessage.api.error import API_ERR
from ppmessage.core.redis import redis_hash_to_dict
from ppmessage.core.constant import API_LEVEL
from ppmessage.core.constant import CONVERSATION_TYPE
from ppmessage.api.handlers.ppgetorggroupuserlisthandler import single_user

import json
import logging

class PPGetConversationUserListHandler(BaseHandler):
    """
    """
    def _get(self, _app_uuid, _conversation_uuid):
        _redis = self.application.redis
        _key = ConversationUserData.__tablename__ + \
               ".conversation_uuid." + _conversation_uuid
        _uuids = _redis.smembers(_key)

        _users = []
        for _user_uuid in _uuids:
            _user = redis_hash_to_dict(_redis, DeviceUser, _user_uuid)
            if _user == None:
                continue
            _single = single_user(_redis, _user)
            _users.append(_single)
            
        _r = self.getReturnData()
        _r["list"] = _users
        return

    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCOM)
        self.addPermission(api_level=API_LEVEL.PPKEFU)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_KEFU)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        return

    def _Task(self):
        super(PPGetConversationUserListHandler, self)._Task()
        _request = json.loads(self.request.body)
        _app_uuid = _request.get("app_uuid")
        _conversation_uuid = _request.get("conversation_uuid")
        if _conversation_uuid == None or _app_uuid == None:
            self.setErrorCode(API_ERR.NO_PARA)
            return
        self._get(_app_uuid, _conversation_uuid)
        return

