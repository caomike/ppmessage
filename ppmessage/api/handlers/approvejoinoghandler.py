# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from mdm.core.srv.signal import signal_cache_add
from mdm.core.srv.signal import signal_dis_message

from mdm.core.redis import redis_hash_to_dict

from mdm.db.models import DeviceUser
from mdm.db.models import OrgUserGroupData
from mdm.db.models import MessagePushTask
from mdm.db.models import OrgGroup
from mdm.core.constant import MESSAGE_TYPE
from mdm.core.constant import MESSAGE_SUBTYPE
from mdm.core.constant import YVOBJECT

from mdm.api.error import API_ERR

import logging
import datetime
import traceback
import json
import uuid

class ApproveJoinOGHandler(BaseHandler):

    def _input_data(self):
        self.input_data = json.loads(self.request.body)
        if "group_uuid" not in self.input_data \
           or "from_uuid" not in self.input_data \
           or "user_uuid" not in self.input_data:
            self.writeError(API_ERR.NO_PARA)
            return False
        return True

    def _db(self):
        _user_uuid = self.input_data.get("user_uuid")
        _group_uuid = self.input_data.get("group_uuid")
        
        _redis = self.application.redis
        _uuid = str(uuid.uuid1())
        _add = {
            "table": OrgUserGroupData.__tablename__,
            "key": "uuid."+_uuid,
            "values": {
                "uuid": _uuid,
                "user_uuid": _user_uuid,
                "group_uuid": _group_uuid,
                "is_leader": False,
                "createtime": datetime.datetime.now(),
                "updatetime": datetime.datetime.now(),
            }
        }
        signal_cache_add(_add)
        _key = OrgUserGroupData.__tablename__ + ".group_uuid." + _group_uuid + ".user_uuid." + _user_uuid
        _redis.set(_key, _uuid)
        
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
            og_name = og.get("group_name")
            og_desc = og.get("group_desc")
            
        return json.dumps({
            "og_uuid" : og_uuid,
            "og_name" : og_name,
            "og_desc" : og_desc,
        }) 

    def _message(self, _from_uuid):
        _user_uuid = self.input_data.get("user_uuid")
        _group_uuid = self.input_data.get("group_uuid")
        _uuid = str(uuid.uuid1())
        _add = {
            "table": MessagePushTask.__tablename__,
            "key": "uuid."+_uuid,
            "values": {
                "uuid": _uuid,
                "message_type": MESSAGE_TYPE.NOTI,
                "message_subtype": MESSAGE_SUBTYPE.APPROVE_JOIN_OG,
                "from_type": YVOBJECT.DU,
                "from_uuid": self.input_data.get("from_uuid"),
                "to_type": YVOBJECT.DU,
                "to_uuid": _user_uuid,
                "body": self._queryOGDetailInfo(_group_uuid),
                "createtime": datetime.datetime.now(),
                "updatetime": datetime.datetime.now(),
            }
        }
        signal_cache_add(_add)
        signal_dis_message({"task_uuid": _uuid})
        return True
    
    def _approve(self):

        if self._input_data() is False:
            return

        if self._db() is False:
            return

        if self._message() is False:
            return
        
        return

    def _Task(self):
        super(ApproveJoinOGHandler, self)._Task()
        logging.info("JOINOGHANDLER with %s." % (self.request.body))
        self._approve()

        return
