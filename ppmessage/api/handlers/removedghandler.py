# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#

from .basehandler import BaseHandler

from ppmessage.db.models import MessagePushTask
from ppmessage.db.models import DiscussionGroup
from ppmessage.db.models import DiscussionUserGroupData

from ppmessage.api.error import API_ERR

from ppmessage.core.constant import MESSAGE_TYPE
from ppmessage.core.constant import MESSAGE_SUBTYPE
from ppmessage.core.constant import YVOBJECT

from ppmessage.core.srv.signal import signal_dis_message
from ppmessage.core.srv.signal import signal_cache_add
from ppmessage.core.srv.signal import signal_cache_delete

import uuid
import json
import logging
import datetime

class RemoveDGHandler(BaseHandler):

    def _signal(self, _dg_uuid, _member_list):

        # this signal need sync
        for _user_uuid in _member_list:
            if _user_uuid == self.from_uuid:
                continue
            
            _uuid = str(uuid.uuid1())
            _add = {
                "table": MessagePushTask.__tablename__,
                "key": "uuid." + _uuid,
                "values": {
                    "uuid": _uuid,
                    "message_type": MESSAGE_TYPE.NOTI,
                    "message_subtype": MESSAGE_SUBTYPE.DG_REMOVED,
                    "from_type": YVOBJECT.DU,
                    "from_device_uuid": self.device_uuid,
                    "to_type": YVOBJECT.DU,
                    "from_uuid": self.from_uuid,
                    "to_uuid": _user_uuid,
                    "body": _dg_uuid,
                    "createtime": datetime.datetime.now(),
                    "updatetime": datetime.datetime.now(),
                }
            }
            signal_cache_add(_add)
            signal_dis_message({"task_uuid": _uuid})
        return

    def _permission(self, _dg_uuid, _from_uuid):
        _redis = self.application.redis
        _key = DiscussionGroup.__tablename__ + \
               ".uuid." + _dg_uuid
        _user_uuid = _redis.hget(_key, "user_uuid")
        if _user_uuid == _from_uuid:
            return True

        return False

    def _delete_data(self, _key):
        _redis = self.application.redis
        _data_uuid = _redis.get(_key)
        _del = {
            "table": DiscussionUserGroupData.__tablename__,
            "key": "uuid." + _data_uuid,
            "values": {
                "uuid": _data_uuid
            }
        }
        signal_cache_delete(_del)
        return

    def _delete_dg(self, _dg_uuid):
        _del = {
            "table": DiscussionGroup.__tablename__,
            "key": "uuid." + _dg_uuid,
            "values": {
                "uuid": _dg_uuid
            }
        }
        signal_cache_delete(_del)
        return

    def _delete(self, _dg_uuid):

        _redis = self.application.redis
        _n = DiscussionUserGroupData.__tablename__ + \
             ".group_uuid." + _dg_uuid + \
             ".user_uuid.*" 
        _keys = _redis.keys(_n)
        _user_list = []

        for _i in _keys:
            self._delete_data(_i)
            _redis.delete(_i)
            _user = _i.split(".")[-1]
            _user_list.append(_user)
            
        self._delete_dg(_dg_uuid)
        self._signal(_dg_uuid, _user_list)
        
        return
    
    def _Task(self):
        super(RemoveDGHandler, self)._Task()

        _input = json.loads(self.request.body)
        if "uuid" not in _input or \
           "from_uuid" not in _input or \
           "device_uuid" not in _input:
            logging.error("Error for no para.")
            self.setErrorCode(API_ERR.NO_PARA)
            return

        self.device_uuid = _input["device_uuid"]
        self.from_uuid = _input["from_uuid"]
        _from_uuid = _input["from_uuid"]
        _dg_uuid = _input["uuid"]
        
        if _dg_uuid is None or len(_dg_uuid) == 0:
            logging.error("Error for no para.")
            self.setErrorCode(API_ERR.NO_PARA)
            return
        
        if not self._permission(_dg_uuid, _from_uuid):
            logging.error("Error for permission")
            self.setErrorCode(API_ERR.NO_PERM)
            return
            
        self._delete(_dg_uuid)
        
        return
        
        
