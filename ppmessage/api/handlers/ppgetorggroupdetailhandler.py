# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from ppmessage.core.redis import redis_hash_to_dict
from ppmessage.db.models import OrgGroup
from ppmessage.db.models import ConversationInfo
from ppmessage.api.error import API_ERR
from ppmessage.core.constant import API_LEVEL
import json
import logging

class PPGetOrgGroupDetailHandler(BaseHandler):
    """
    requst:
    header:

    body:
    app_uuid, which app
    group_uuid, which group
    
    response:
    json with error_code
    a org group detail and the org group must belong to this app

    """
    def _get(self, _app_uuid, _group_uuid):
        _redis = self.application.redis
        _key = OrgGroup.__tablename__ + \
                   ".app_uuid." + _app_uuid
        _is = _redis.sismember(_key, _group_uuid)
        if _is != True:
            self.setErrorCode(API_ERR.NO_ORG_GROUP)
            return

        _group = redis_hash_to_dict(_redis, OrgGroup, _group_uuid)
        if _group == None:
            self.setErrorCode(API_ERR.NO_ORG_GROUP)
            return
        _r = self.getReturnData()
        for _i in _group:
            _r[_i] = _group[_i]
        _r["group_uuid"] = _group["uuid"]
        
        _key = ConversationInfo.__tablename__ + \
               ".app_uuid." + _app_uuid + \
               ".group_uuid." + _group_uuid
        _r["conversation_uuid"] = _redis.get(_key)
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
        super(PPGetOrgGroupDetailHandler, self)._Task()
        _body = json.loads(self.request.body)
        if "app_uuid" not in _body or "group_uuid" not in _body:
            self.setErrorCode(API_ERR.NO_PARA)
            return
        self._get(_body.get("app_uuid"), _body.get("group_uuid"))
        return
