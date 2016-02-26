# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Jin He, jin.he@yvertical.com
#

from .basehandler import BaseHandler

from mdm.db.models import DiscussionGroup
from mdm.db.models import DiscussionUserGroupData
from mdm.db.models import DeviceUser
from mdm.db.models import FileInfo
from mdm.db.models import MessagePushTask

from mdm.api.error import API_ERR

from mdm.core.constant import YVOBJECT
from mdm.core.constant import MESSAGE_TYPE
from mdm.core.constant import MESSAGE_SUBTYPE

from mdm.core.redis import redis_hash_to_dict
from mdm.core.srv.signal import signal_cache_update
from mdm.core.srv.signal import signal_cache_add
from mdm.core.srv.signal import signal_cache_delete
from mdm.core.srv.signal import signal_dis_message

import datetime
import uuid
import json
import logging

class SetDiscussionGroupHandler(BaseHandler):
    """
    requst:
    header
    body {group_uuid:, member_list:, group_name:}

    response:
    
    
    """
    def _signal(self, _member_list, _message_subtype):

        # this signal doesn't need sync
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
                    "message_subtype": _message_subtype,
                    "from_type": YVOBJECT.DU,
                    "to_type": YVOBJECT.DU,
                    "from_uuid": self.from_uuid,
                    "to_uuid": _user_uuid,
                    "body": self.group_uuid,
                    "createtime": datetime.datetime.now(),
                    "updatetime": datetime.datetime.now(),
                }
            }
            signal_cache_add(_add)
            signal_dis_message({"task_uuid": _uuid})
        return

    def _update_db(self):
        _update = {
            "table": DiscussionGroup.__tablename__,
            "key": self.group_key,
            "values": {
                "updatetime": datetime.datetime.now()
            }
        }
        signal_cache_update(_update)
        
    def _add_db(self, _user_uuid):
        _uuid = str(uuid.uuid1())
        _add = {
            "table": DiscussionUserGroupData.__tablename__,
            "key": "uuid." + _uuid,
            "values": {
                "uuid": _uuid,
                "group_uuid": self.group_uuid,
                "user_uuid": _user_uuid,
            },
        }
        signal_cache_add(_add)
        return _uuid

    def _remove_db(self, _user_uuid):
        _del = {
            "table": DiscussionUserGroupData.__tablename__,
            "key": "group_uuid." + self.group_uuid + ".user_uuid." + _user_uuid,
            "values": {
                "group_uuid": self.group_uuid,
                "user_uuid": _user_uuid,
            },
        }
        signal_cache_delete(_del)
        
    def _add_member(self, _add_list):
        _redis = self.application.redis
        _key = DiscussionUserGroupData.__tablename__ + \
               ".group_uuid." + self.group_uuid

        for _i in _add_list:
            _data_uuid = self._add_db(_i)
            _n = _key + ".user_uuid." + _i
            _redis.set(_n, _data_uuid)

        self._update_db()
        self._signal(_add_list, MESSAGE_SUBTYPE.DG_INVITED)
        return

    def _remove_member(self, _remove_list):
        _redis = self.application.redis
        _key = DiscussionUserGroupData.__tablename__ + \
               ".group_uuid." + self.group_uuid

        for _i in _remove_list:
            self._remove_db(_i)
            _n = _key + ".user_uuid." + _i
            _redis.delete(_n)
            
        self._update_db()
        self._signal(_remove_list, MESSAGE_SUBTYPE.DG_REMOVED)
        return

    def _update_name(self, _group_name):
        _update = {
            "table": DiscussionGroup.__tablename__,
            "key": self.group_key,
            "values": {
                "group_name": _group_name,
                "updatetime": datetime.datetime.now(),
            }
        }
        signal_cache_update(_update)

    def _update_icon(self, _group_icon):
        _update = {
            "table": DiscussionGroup.__tablename__,
            "key": self.group_key,
            "values": {
                "group_icon": _group_icon,
                "updatetime": datetime.datetime.now(),
            }
        }
        signal_cache_add(_update)
        
    def _post(self, _request, _redis):

        if "group_uuid" not in _request or \
           "from_uuid" not in _request:
            self.setErrorCode(API_ERR.NO_PARA)
            return

        self.group_uuid = _request["group_uuid"]
        self.from_uuid = _request["from_uuid"]
        self.group_key = "uuid." + self.group_uuid
        
        _group = redis_hash_to_dict(_redis, DiscussionGroup, self.group_uuid)
        if _group is None:
            logging.error("No discussion group %s." % (self.group_uuid))
            self.setErrorCode(API_ERR.NO_OBJECT)
            return

        if "group_name" in _request:
            _group_name = _request["group_name"]
            self._update_name(_group_name)

        if "group_icon" in _request:
            _group_icon = _request["group_icon"]
            _file = redis_hash_to_dict(_redis, FileInfo, _group_icon)
            if _file:
                self._update_icon(_group_icon)
            else:
                logging.error("No file: %s." % (_request["group_icon"]))
                self.setErrorCode(API_ERR.NO_FILE)
                return
            
        if "add_member_list" in _request:
            _add_list = _request["add_member_list"]
            self._add_member(_add_list)

        if "remove_member_list" in _request:
            _remove_list = _request["remove_member_list"]
            self._remove_member(_remove_list)
            
        return

    def _Task(self):
        super(SetDiscussionGroupHandler, self)._Task()
        _request = json.loads(self.request.body)
        _redis = self.application.redis
        self._post(_request, _redis)
