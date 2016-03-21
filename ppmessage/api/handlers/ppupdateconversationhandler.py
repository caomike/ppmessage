# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from ppmessage.db.models import ConversationInfo
from ppmessage.api.error import API_ERR

from ppmessage.core.constant import API_LEVEL

import uuid
import json
import logging

class PPUpdateConversationHandler(BaseHandler):
    """
    requst:
    header
    body:
    conversation_uuid, owner_uuid
    
    response:
    json with error_code

    """

    def _update(self, _conv_uuid, _assigned_uuid):
        _redis = self.application.redis
        _key = ConversationInfo.__tablename__ + ".uuid." + _conv_uuid

        if not _redis.exists(_key):
            logging.error("no such conversation: %s" % _conv_uuid)
            self.setErrorCode(API_ERR.NO_CONVERSATION)
            return

        _row = ConversationInfo(uuid=_conv_uuid, assigned_uuid=_assigned_uuid)
        _row.async_update()
        _row.update_redis_keys(_redis)

        _rdata = self.getReturnData()
        return

    def initialize(self):
        self.addPermission(api_level=API_LEVEL.PPCOM)
        self.addPermission(api_level=API_LEVEL.PPKEFU)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_KEFU)
        return
    
    def _Task(self):
        super(PPUpdateConversationHandler, self)._Task()
        _request = json.loads(self.request.body)
        _conv_uuid = _request.get("conversation_uuid")
        _assigned_uuid = _request.get("assigned_uuid")
        
        if _assigned_uuid == None or _conv_uuid == None:
            logging.error("no assigned_uuid or conversation_uuid.")
            self.setErrorCode(API_ERR.NO_PARA)
            return
        
        self._update(_conv_uuid, _assigned_uuid)
        return

