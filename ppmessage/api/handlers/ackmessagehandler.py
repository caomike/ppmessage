# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from mdm.db.models import MessagePushTask
from mdm.db.models import MessagePush
from mdm.db.models import SingleCardMaterialInfo
from mdm.db.models import MultipleCardMaterialInfo

from mdm.api.error import API_ERR

from mdm.core.constant import MESSAGE_TYPE
from mdm.core.constant import MESSAGE_SUBTYPE
from mdm.core.constant import MESSAGE_STATUS

import json
import logging

class AckMessageHandler(BaseHandler):
    """
    """
    
    def _ack(self, _uuid):
        _redis = self.application.redis
        _key = MessagePush.__tablename__ + ".uuid." + _uuid
        if not _redis.exists(_key):
            return
        _row = MessagePush(uuid=_uuid, status=MESSAGE_STATUS.ACKED)
        _row.async_update()
        _row.delete_redis_keys(_redis)
        return

    def _ack_list(self, _list):
        for _uuid in _list:
            if _uuid == None:
                continue
            self._ack(_uuid)
        return
            
    def _Task(self):
        super(AckMessageHandler, self)._Task()
        _request = json.loads(self.request.body)
        _list = _request.get("list")

        if not isinstance(_list, list):
            self.setErrorCode(API_ERR.NO_PARA)
            return
        
        self._ack_list(_list)           
        return
