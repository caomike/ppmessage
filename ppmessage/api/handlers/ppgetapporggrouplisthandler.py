# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from ppmessage.api.error import API_ERR
from ppmessage.db.models import OrgGroup
from ppmessage.db.models import OrgUserGroupData

from ppmessage.db.models import ConversationInfo
from ppmessage.core.redis import redis_hash_to_dict

from ppmessage.core.constant import API_LEVEL

import json
import logging

class PPGetAppOrgGroupListHandler(BaseHandler):
    """
    """
    def _get(self, _app_uuid):
        _redis = self.application.redis
        _key = OrgGroup.__tablename__ + ".app_uuid." + _app_uuid
        _group_uuid_list = list(_redis.smembers(_key))

        _pre = OrgGroup.__tablename__ + ".uuid."
        _pi = _redis.pipeline()
        for _group_uuid in _group_uuid_list:
            _key = _pre + _group_uuid
            _pi.hgetall(_key)
        _groups = _pi.execute()

        _key_pre = OrgUserGroupData.__tablename__ + ".group_uuid."
        for _group in _groups:
            _key = _key_pre + _group.get("uuid")
            _users = _redis.smembers(_key)
            if _users == None:
                _group["user_count"] = 0
            else:
                _group["user_count"] = len(_users)
        
        _pre = ConversationInfo.__tablename__ + \
               ".app_uuid." + _app_uuid + \
               ".group_uuid."
        _pi = _redis.pipeline()
        for _group_uuid in _group_uuid_list:
            _key = _pre + _group_uuid
            _pi.get(_key)
        _conversation_uuid_list = _pi.execute()
        _conversation_dict = dict(zip(_group_uuid_list, _conversation_uuid_list))

        for _group in _groups:
            _group["conversation_uuid"] = _conversation_dict.get(_group["uuid"])

        _r = self.getReturnData()
        _r["list"] = _groups
        return

    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCOM)
        self.addPermission(api_level=API_LEVEL.PPKEFU)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_KEFU)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        return

    def _Task(self):
        super(PPGetAppOrgGroupListHandler, self)._Task()
        
        _body = json.loads(self.request.body)
        if "app_uuid" not in _body:
            self.setErrorCode(API_ERR.NO_PARA)
            return
        
        self._get(_body.get("app_uuid"))
        return

