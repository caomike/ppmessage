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

class PPUpdateOrgGroupHandler(BaseHandler):
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
    def _get(self, _app_uuid, _group_uuid, _body):
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
        del _body["group_uuid"]
        del _body["app_uuid"]
        
        for _i in _body:
            if _i not in _group:
                logging.error("can not set: %s" % _i)
                continue
            _group[_i] = _body[_i]
            
        _r = self.getReturnData()
        for _i in _group:
            _r[_i] = _group[_i]
        _r["group_uuid"] = _group["uuid"]

        del _group["createtime"]
        del _group["updatetime"]

        _row = OrgGroup(**_group)
        _row.async_update()
        _row.update_redis_keys(_redis)
        return

    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        return
    
    def _Task(self):
        super(PPUpdateOrgGroupHandler, self)._Task()
        _body = json.loads(self.request.body)
        if "app_uuid" not in _body or "group_uuid" not in _body:
            self.setErrorCode(API_ERR.NO_PARA)
            return

        # FIXME: check permission of the app_uuid
        # if self.app_uuid == PPMESSAGE_UUID
        # or self.app_uuid == app_uuid
        self._get(_body.get("app_uuid"), _body.get("group_uuid"), _body)
        return
