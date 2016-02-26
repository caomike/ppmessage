# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# Guijin Ding, dingguijin@gmail.com
#
#

from mdm.db.models import AppInfo
from mdm.db.models import DeviceUser
from mdm.db.models import OrgGroup
from mdm.db.models import ConversationInfo
from mdm.db.models import MessagePushTask

from mdm.core.constant import YVOBJECT
from mdm.core.redis import redis_hash_to_dict

from .policy.policy import AbstractPolicy

import logging
import json

class TaskHandler():

    def __init__(self, _app):
        self.application = _app

    def _dispatch(self):
        _name = self._task["_app"]["app_route_policy"]
        logging.info("DISPATCH POLICY:%s type:%s, subtype:%s, body:%s, ft:%s, tt:%s" % (_name, self._task["message_type"], self._task["message_subtype"], self._task["body"], self._task["from_type"], self._task["to_type"]))
        _cls = AbstractPolicy.get_policy_cls_by_name(_name)
        _obj = _cls(self)
        _obj.dispatch()
        return

    def _prepare(self, _task_uuid):
        if not _task_uuid:
            logging.error("Can't find task for task uuid: %s" % (_data["task_uuid"]))
            return None
        
        _redis = self.application.redis
        _task = redis_hash_to_dict(_redis, MessagePushTask, _task_uuid)
        if _task == None:
            logging.error("Can't find task for task uuid: %s" % (_data["task_uuid"]))
            return None
        
        _app = redis_hash_to_dict(_redis, AppInfo, _task.get("app_uuid"))
        if _app == None:
            logging.error("No app: %s" % _task.get("app_uuid"))
            return None

        _user = None
        if _task.get("from_type") == YVOBJECT.DU:
            _user = redis_hash_to_dict(_redis, DeviceUser, _task.get("from_uuid"))
            if _user != None:
                del _user["user_password"]

        _group = None
        if _task.get("from_type") == YVOBJECT.OG:
            _group = redis_hash_to_dict(_redis, OrgGroup, _task.get("from_uuid"))

        # conversation maybe None for explicit message SYS LOGOUT
        _conversation = redis_hash_to_dict(_redis, ConversationInfo, _task.get("conversation_uuid"))

        _task["_app"] = _app
        _task["_user"] = _user
        _task["_group"] = _group
        _task["_conversation"] = _conversation
        
        self._task = _task
        return self._task
                                           
    def task(self, _data):
        if not self._prepare(_data.get("task_uuid")):
            return
        self._dispatch()
        return

