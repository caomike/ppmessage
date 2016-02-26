# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# 
#

from .basehandler import BaseHandler

from ppmessage.db.models import AppMessageAction

from ppmessage.api.error import API_ERR

from ppmessage.core.constant import MESSAGE_STATUS
from ppmessage.core.constant import MESSAGE_TYPE
from ppmessage.core.constant import YVOBJECT

from ppmessage.core.redis import redis_hash_to_dict
from ppmessage.core.srv.signal import signal_cache_add

import logging
import json
import time
import datetime
import uuid

class GetActionMessageHandler(BaseHandler):
    """
    requst:
    header    
    
    response:
    
    {error_code:, message:}
    """
    
    def _body(self, _group_uuid, _action, _from_uuid):
        _message = {}
        #_message["id"] = _action.uuid
        _message["id"] = str(uuid.uuid1())
        _message["fi"] = _group_uuid
        _message["ti"] = _from_uuid
        _message["ft"] = YVOBJECT.AG
        _message["tt"] = YVOBJECT.DU
        _message["mt"] = MESSAGE_TYPE.ACT
        _message["ms"] = _action.message_subtype

        _message["tl"] = _action.title
        _message["bo"] = _action.body

        if isinstance(_action.title, unicode):
            _message["tl"] = _action.title.encode("utf-8")
        if isinstance(_action.body, unicode):
            _message["bo"] = _action.body.encode("utf-8")

        _message["ts"] = int(time.mktime(datetime.datetime.now().timetuple())) 
        _message["ts"] = round(_message["ts"])
        return _message

    def _Task(self):
        super(GetActionMessageHandler, self)._Task()

        _request = json.loads(self.request.body)
        _from_uuid = _request.get("from_uuid")
        _action_uuid = _request.get("action_uuid")
        _group_uuid = _request.get("group_uuid")
        
        if _action_uuid is None or _group_uuid is None or _from_uuid is None:
            self.setErrorCode(API_ERR.NO_PARA)
            return
        
        _redis = self.application.redis
        _action = redis_hash_to_dict(_redis, AppMessageAction, _action_uuid)
        if _action is None:
            self.setErrorCode(API_ERR.NO_ACTION)
            logging.error("Error no action for uuid:%s." % (_action_uuid))
            return
        
        logging.info(_action)
        _message_body = self._body(_group_uuid, _action, _from_uuid)
        
        _rdata = self.getReturnData()
        _rdata["message"] = _message_body
        return

