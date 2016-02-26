# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#

from .basehandler import BaseHandler

from mdm.db.models import MessagePushTask
from mdm.db.models import DiscussionUserGroupData

from mdm.api.error import API_ERR

from mdm.core.constant import MESSAGE_TYPE
from mdm.core.constant import MESSAGE_SUBTYPE

from mdm.core.srv.signal import signal_dis_message
from mdm.core.srv.signal import signal_cache_add
from mdm.core.srv.signal import signal_cache_delete

import uuid
import json
import logging
import datetime

class QuitDGHandler(BaseHandler):

    def _quit(self, _from_uuid, _dg_uuid):

        _redis = self.application.redis
        _n = DiscussionUserGroupData.__tablename__ + \
             ".group_uuid." + _dg_uuid + \
             ".user_uuid." + _from_uuid

        if not _redis.exists(_n):
            return
                
        _data_uuid = _redis.get(_n)
           
        _del = {
            "table": DiscussionUserGroupData.__tablename__,
            "key": "uuid." + _data_uuid,
            "values": {
                "uuid": _data_uuid,
            },
        }
        signal_cache_delete(_del)

        _redis.delete(_n)
        return
    
    def _Task(self):
        super(QuitDGHandler, self)._Task()

        _input = json.loads(self.request.body)
        if "uuid" not in _input or "from_uuid" not in _input:
            logging.error("Error for no para.")
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _from_uuid = _input["from_uuid"]
        _dg_uuid = _input["uuid"]
        
        if _dg_uuid is None or len(_dg_uuid) == 0:
            logging.error("Error for no para.")
            self.setErrorCode(API_ERR.NO_PARA)
            return
        self._quit(_from_uuid, _dg_uuid)
        
        return
        
        
