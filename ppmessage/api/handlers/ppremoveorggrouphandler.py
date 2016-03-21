# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from ppmessage.core.redis import redis_hash_to_dict
from ppmessage.db.models import OrgGroup
from ppmessage.api.error import API_ERR

from ppmessage.core.constant import API_LEVEL

import json
import logging

class PPRemoveOrgGroupHandler(BaseHandler):
    """
    requst:
    header:

    body:
    app_uuid, which app
    group_uuid, which group
    
    response:
    json with error_code
    
    """
    def _get(self, _app_uuid, _group_uuid):
        _redis = self.application.redis
        _key = OrgGroup.__tablename__ + \
               ".app_uuid." + _app_uuid
        _is = _redis.sismember(_key, _group_uuid)
        if _is != True:
            self.setErrorCode(API_ERR.NO_ORG_GROUP)
            return

        _row = OrgGroup(uuid=_group_uuid)
        _row.async_delete()
        _row.delete_redis_keys(_redis)
        return

    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        return
    
    def _Task(self):
        super(PPRemoveOrgGroupHandler, self)._Task()
        _body = json.loads(self.request.body)
        if "app_uuid" not in _body or "group_uuid" not in _body:
            self.setErrorCode(API_ERR.NO_PARA)
            return

        # FIXME: check permission of the app_uuid
        # if self.app_uuid == PPMESSAGE_UUID
        # or self.app_uuid == app_uuid
        self._get(_body.get("app_uuid"), _body.get("group_uuid"))
        return
    
