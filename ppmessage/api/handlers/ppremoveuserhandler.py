# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from ppmessage.db.models import DeviceUser
from ppmessage.db.models import AppInfo
from ppmessage.api.error import API_ERR
from ppmessage.core.constant import API_LEVEL

import json
import hashlib
import logging

class PPRemoveUserHandler(BaseHandler):
    """
    PP_REMOVE_USER remove the user from PPMESSAGE
    if user has own any APP, remove APP first
    """
    def _remove(self, _user_uuid, _user_password):
        _redis = self.application.redis
        _key = DeviceUser.__tablename__ + ".uuid." + _user_uuid
        if not _redis.exists(_key):
            self.setErrorCode(API_ERR.NO_USER)
            return

        _pass_hash = _redis.hget(_key, "user_password")
        _pass_hash = hashlib.sha1(_pass_hash).hexdigest()
        if _pass_hash != _user_password:
            self.setErrorCode(API_ERR.ERR_MIS)
            return

        _key = AppInfo.__tablename__ + ".user_uuid." + _user_uuid
        if _redis.exists(_key):
            self.setErrorCode(API_ERR.APP_OWNER)
            return

        # FIXME: other org group data
        # conversation data / app user data etc.
        _row = DeviceUser(uuid=_user_uuid)
        _row.async_delete()
        _row.delete_redis_keys(_redis)
        return

    def initialize(self):
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        return
    
    def _Task(self):
        super(PPRemoveUserHandler, self)._Task()
        _request = json.loads(self.request.body)
        _user_uuid = _request.get("user_uuid")
        _user_password = _request.get("user_password")
        if _user_uuid == None or _user_password == None:
            self.setErrorCode(API_ERR.NO_PARA)
            return
        self._remove(_user_uuid, _user_password)
        return

