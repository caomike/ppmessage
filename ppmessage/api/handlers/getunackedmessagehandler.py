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
from ppmessage.core.constant import MESSAGE_STATUS
from ppmessage.core.redis import redis_hash_to_dict

from ppmessage.core.constant import API_LEVEL

import logging
import json

class GetUnackedMessageHandler(BaseHandler):
    """
    requst:
    header    
    
    response:
    
    {error_code:, message:}
    """

    def initialize(self):
        self.addPermission(api_level=API_LEVEL.PPCOM)
        self.addPermission(api_level=API_LEVEL.PPKEFU)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_KEFU)
        return
    
    def _Task(self):
        super(GetUnackedMessageHandler, self)._Task()

        _uuid = json.loads(self.request.body).get("uuid")
        if _uuid is None:
            self.setErrorCode(API_ERR.NO_PARA)
            return
        _redis = self.application.redis
        _push = redis_hash_to_dict(_redis, MessagePush, _uuid)
        if _push is None:
            self.setErrorCode(API_ERR.NO_PUSH)
            logging.error("Error no push uuid:%s." % (_uuid))
            return

        if _push["status"] == MESSAGE_STATUS.ACKED:
            logging.info("Already acked uuid:%s." % (_uuid))
            self.setErrorCode(API_ERR.NO_ERR)
            return

        _task = redis_hash_to_dict(_redis, MessagePushTask, _push["task_uuid"])
        if _task is None:
            self.setErrorCode(API_ERR.NO_TASK)
            logging.error("Error no task uuid:%s." % (_push["task_uuid"]))
            return

        _rdata = self.getReturnData()
        if isinstance(_task["message_body"], unicode):
            _task["message_body"] = _task["message_body"].encode("utf-8")

        _rdata["message"] = json.loads(_task.message_body)
        return

