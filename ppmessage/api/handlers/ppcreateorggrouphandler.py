# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from ppmessage.core.redis import redis_hash_to_dict
from ppmessage.core.utils.createicon import create_user_icon

from ppmessage.db.models import OrgGroup
from ppmessage.api.error import API_ERR
from ppmessage.core.constant import API_LEVEL

import json
import uuid
import logging

class PPCreateOrgGroupHandler(BaseHandler):
    """
    requst:
    app_uuid, which app
    group_name, which group
    
    response:
    json with error_code
    an org group detail which just created.
    """

    def _get(self, _app_uuid, _group_name, _group_desc):
        _redis = self.application.redis
        _uuid = str(uuid.uuid1())
        _row = OrgGroup(
            uuid=_uuid,
            app_uuid=_app_uuid,
            group_name=_group_name,
            group_icon=create_user_icon(_uuid), 
            group_desc=_group_desc
        )
        _row.async_add()
        _row.create_redis_keys(_redis)
                
        _group = redis_hash_to_dict(_redis, OrgGroup, _row.uuid)
        if _group == None:
            self.setErrorCode(API_ERR.NO_ORG_GROUP)
            return
        _r = self.getReturnData()
        _r.update(_group)
        return

    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_PPCONSOLE)
        return
        
    def _Task(self):
        super(PPCreateOrgGroupHandler, self)._Task()
        _body = json.loads(self.request.body)

        _app_uuid = _body.get("app_uuid")
        _group_name = _body.get("group_name")
        _group_desc = _body.get("group_desc")

        if _app_uuid == None or _group_name == None or _group_desc == None:
            self.setErrorCode(API_ERR.NO_PARA)
            return        
        self._get(_app_uuid, _group_name, _group_desc)
        return
