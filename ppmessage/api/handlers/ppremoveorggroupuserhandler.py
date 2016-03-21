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

from ppmessage.core.redis import redis_hash_to_dict
from ppmessage.api.handlers.ppaddorggroupuserhandler import update_group_icon

from ppmessage.core.constant import API_LEVEL

import json
import logging

class PPRemoveOrgGroupUserHandler(BaseHandler):
    """
    """

    def _remove(self, _group_uuid, _user_uuid):
        _redis = self.application.redis
        _key = OrgUserGroupData.__tablename__ + \
               ".group_uuid." + _group_uuid
        if _redis.sismember(_key, _user_uuid) == False:
            self.setErrorCode(API_ERR.NOT_GROUP_USER)
            logging.error("user: %s not in group:%s" % (_user_uuid, _group_uuid))
            return False

        _key = OrgUserGroupData.__tablename__ + \
               ".group_uuid." + _group_uuid + \
               ".user_uuid." + _user_uuid
        _data_uuid = _redis.get(_key)
        if _data_uuid == None:
            self.setErrorCode(API_ERR.NOT_GROUP_USER)
            logging.error("user: %s group:%s not bind." % (_user_uuid, _group_uuid))
            return False
        
        _row = OrgUserGroupData(uuid=_data_uuid)
        _row.async_delete()
        _row.delete_redis_keys(_redis)

        update_group_icon(_redis, _group_uuid)
        return True
    
    def _get(self, _app_uuid, _group_uuid, _user_list):
        if _app_uuid == None or _group_uuid == None or _user_list == None:
            self.setErrorCode(API_ERR.NO_PARA)
            return

        if not isinstance(_user_list, list):
            self.setErrorCode(API_ERR.NOT_LIST)
            return
        
        _redis = self.application.redis

        # check the group belongs to app
        _key = OrgGroup.__tablename__ + \
               ".app_uuid." + _app_uuid
        _is = _redis.sismember(_key, _group_uuid)
        if _is != True:
            self.setErrorCode(API_ERR.NO_ORG_GROUP)
            return

        logging.info(_user_list)
        
        for _user_uuid in _user_list:
            _r = self._remove(_group_uuid, _user_uuid)
            if not _r:
                return
        return

    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        return
    
    def _Task(self):
        super(PPRemoveOrgGroupUserHandler, self)._Task()
        _body = json.loads(self.request.body)
        if "app_uuid" not in _body or "group_uuid" not in _body or "user_list" not in _body:
            self.setErrorCode(API_ERR.NO_PARA)
            return
        self._get(_body.get("app_uuid"), _body.get("group_uuid"), _body.get("user_list"))
        return
