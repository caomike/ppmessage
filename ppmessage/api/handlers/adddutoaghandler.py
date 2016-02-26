# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#

from .basehandler import BaseHandler

from mdm.db.models import MessagePushTask
from mdm.db.models import AppUserGroupData

from mdm.api.error import API_ERR

from mdm.core.constant import MESSAGE_TYPE
from mdm.core.constant import MESSAGE_SUBTYPE

from mdm.core.srv.signal import signal_dis_message
from mdm.core.srv.signal import signal_cache_add

import uuid
import json
import logging
import datetime

class AddDUToAGHandler(BaseHandler):

    def _add_message(self, _ag_uuid, _from_uuid, _user_uuid):
        _uuid = str(uuid.uuid1())
        _add = {
            "table": MessagePushTask.__tablename__,
            "key": "uuid."+_uuid,
            "values": {
                "uuid": _uuid,
                "message_type": MESSAGE_TYPE.NOTI,
                "message_subtype": MESSAGE_SUBTYPE.AG_INVITED,
                "from_type": YVOBJECT.DU,
                "from_uuid": _from_uuid,
                "to_type": YVOBJECT.DU,
                "to_uuid": _user_uuid,
                "body": _ag_uuid,
                "createtime": datetime.datetime.now(),
                "updatetime": datetime.datetime.now(),
            }
        }
        signal_cache_add(_add)
        signal_dis_message({"task_uuid": _uuid})
        return _uuid

    def _add_data(self, _ag_uuid, _user_uuid):
        _uuid = str(uuid.uuid1())
        _add = {
            "table": AppUserGroupData.__tablename__,
            "values": {
                "uuid": _uuid,
                "group_uuid": _ag_uuid,
                "user_uuid": _user_uuid,
            },
        }
        signal_cache_add(_add)
        
        _n = AppUserGroupData.__tablename__ + \
             ".group_uuid." + _ag_uuid + ".user_uuid." + _user_uuid
        self.application.redis.set(_n, _uuid)
        return
    
    def _Task(self):
        super(AddDUToAGHandler, self)._Task()

        _input = json.loads(self.request.body)
        if "from_uuid" not in _input or \
           "uuid" not in _input or \
           "list" not in _input:
            logging.error("Error for no para.")
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _from_uuid = _input["from_uuid"]
        _ag_uuid = _input["uuid"]
        _user_list = _input["list"]
        if _ag_uuid is None:
            logging.error("Error for no para.")
            self.setErrorCode(API_ERR.NO_PARA)
            return
        
        for _i in _user_list:
            _uuid = self._add_message(_ag_uuid, _from_uuid, _i)
            self._add_data(_ag_uuid, _i)
        return
        
        
