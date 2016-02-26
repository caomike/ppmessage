# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from ppmessage.core.srv.signal import signal_cache_add
from ppmessage.core.srv.signal import signal_dis_message

from ppmessage.core.redis import redis_hash_to_dict

from ppmessage.db.models import DeviceUser
from ppmessage.db.models import OrgUserGroupData
from ppmessage.db.models import MessagePushTask
from ppmessage.db.models import OrgGroup

from ppmessage.api.error import API_ERR

from ppmessage.core.constant import MESSAGE_TYPE
from ppmessage.core.constant import MESSAGE_SUBTYPE
from ppmessage.core.constant import YVOBJECT

import logging
import datetime
import traceback
import json
import uuid

class RequestJoinOGHandler(BaseHandler):

    def _input_data(self):
        self.input_data = json.loads(self.request.body)
        if "group_uuid" not in self.input_data or "from_uuid" not in self.input_data:
            self.writeError(API_ERR.NO_PARA)
            return False

        return True

    def _leader(self):
        _group_uuid = self.input_data.get("group_uuid")
        _pattern = OrgUserGroupData.__tablename__ + ".group_uuid." + _group_uuid + ".user_uuid.*"
        _redis = self.application.redis
        _keys = _redis.keys(_pattern)
        self.leaders = []
        for i in _keys:
            _data_uuid = _redis.get(i)
            _is_leader = _redis.hget(OrgUserGroupData.__tablename__ + ".uuid." + _data_uuid, "is_leader")
            if _is_leader == "True" or _is_leader == "1":
                self.leaders.append(i.split(".")[-1])

        if len(self.leaders) == 0:
            self.writeError(API_ERR.NO_LEADER)
            return False
        
        return True

    '''
    get organization detail info in json by uuid
    '''
    def _queryOGDetailInfo (self, organizationUuid):
        _redis = self.application.redis
        og = redis_hash_to_dict(_redis, OrgGroup, organizationUuid)

        og_uuid = organizationUuid
        og_name = ""
        og_desc = ""
        
        if og is not None:
            og_name = og.group_name
            og_desc = og.group_desc
            
        return json.dumps({
            "og_uuid" : og_uuid,
            "og_name" : og_name,
            "og_desc" : og_desc,
        }) 

    def _message(self):
        for i in self.leaders:
            _uuid = str(uuid.uuid1())
            _add = {
                "table": MessagePushTask.__tablename__,
                "key": "uuid."+_uuid,
                "values": {
                    "uuid": _uuid,
                    "message_type": MESSAGE_TYPE.NOTI,
                    "message_subtype": MESSAGE_SUBTYPE.REQUEST_JOIN_OG,
                    "from_type": YVOBJECT.DU,
                    "from_uuid": self.input_data.get("from_uuid"),
                    "to_type": YVOBJECT.DU,
                    "to_uuid": i,
                    "body": self._queryOGDetailInfo(self.input_data.get("group_uuid")),
                    "createtime": datetime.datetime.now(),
                    "updatetime": datetime.datetime.now(),
                }
            }
            signal_cache_add(_add)
            signal_dis_message({"task_uuid": _uuid})
            
        return True
    
    def _join(self):

        if self._input_data() is False:
            return

        if self._leader() is False:
            return

        if self._message() is False:
            return
        
        return

    def _Task(self):
        super(RequestJoinOGHandler, self)._Task()

        logging.info("REQUESTJOINOGHANDLER with %s." % (self.request.body))
        self._join()

        return
