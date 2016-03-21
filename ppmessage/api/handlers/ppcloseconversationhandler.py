# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from ppmessage.db.models import ConversationUserData
from ppmessage.core.constant import CONVERSATION_STATUS
from ppmessage.api.error import API_ERR

from ppmessage.core.constant import API_LEVEL

import json
import logging

class PPCloseConversationHandler(BaseHandler):
    """
    requst:
    app_uuid, coversation_uuid, user_uuid
    
    response:
    json with error_code

    """
    def _close(self, _conversation_uuid, _user_uuid, _app_uuid):
        _redis = self.application.redis
        _key = ConversationUserData.__tablename__ + \
               ".app_uuid." + _app_uuid + \
               ".user_uuid." + _user_uuid + \
               ".conversation_uuid." + _conversation_uuid
        _uuid = _redis.get(_key)
        if _uuid == None:
            logging.error("no such conversation data: %s" % _key)
            self.setErrorCode(API_ERR.NO_CONVERSATION)
            return
        _row = ConversationUserData(uuid=_uuid, conversation_status=CONVERSATION_STATUS.CLOSE)
        _row.async_update()
        _row.update_redis_keys(_redis)
        return

    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCOM)
        self.addPermission(api_level=API_LEVEL.PPKEFU)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)        
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_KEFU)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_PPCONSOLE)
        return
    
    def _Task(self):
        super(PPCloseConversationHandler, self)._Task()
        _request = json.loads(self.request.body)
        _conversation_uuid = _request.get("conversation_uuid")
        _user_uuid = _request.get("user_uuid")
        _app_uuid = _request.get("app_uuid")
        if _conversation_uuid == None or _user_uuid == None or _app_uuid == None:
            self.setErrorCode(API_ERR.NO_PARA)
            return
        self._close(_conversation_uuid, _user_uuid, _app_uuid)
        return

