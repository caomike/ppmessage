# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from ppmessage.core.redis import redis_hash_to_dict
from ppmessage.core.utils.datetimestring import datetime_to_timestamp
from ppmessage.core.utils.datetimestring import string_to_datetime

from ppmessage.core.constant import DATETIME_FORMAT
from ppmessage.core.constant import REDIS_MONITOR_KEY
from ppmessage.core.constant import WEBSOCKET_STATUS
from ppmessage.core.constant import API_LEVEL

from ppmessage.db.models import OrgUserGroupData
from ppmessage.db.models import DeviceUser
from ppmessage.db.models import DeviceInfo
from ppmessage.db.models import OrgGroup

from ppmessage.api.error import API_ERR

import json
import time
import logging
import datetime

from operator import itemgetter

def _online(_redis, _device_uuid):
    _key = DeviceInfo.__tablename__ + \
           ".uuid." + _device_uuid
    if not _redis.exists(_key):
        return False
    if _redis.hget(_key, "device_is_online") == "True":
        return True
    return False

def _group(_redis, _user_uuid):
    _key = OrgUserGroupData.__tablename__ + ".user_uuid." + _user_uuid
    _group_uuid = _redis.get(_key)
    if _group_uuid == None:
        return None
    _key = OrgGroup.__tablename__ + ".uuid." + _group_uuid
    _group_name = _redis.hget(_key, "group_name")
    return {"uuid": _group_uuid, "group_name": _group_name}

def _single(_redis, _user):
    _is_mobile_online = False
    _is_browser_online = False
    _device_uuid = _user.get("mobile_device_uuid")
    if _device_uuid != None:
        _is_mobile_online = _online(_redis, _device_uuid)
    _device_uuid = _user.get("browser_device_uuid")
    if _device_uuid != None:
        _is_browser_online = _online(_redis, _device_uuid)
    _d = {}
    _d["is_browser_online"] = _is_browser_online
    _d["is_mobile_online"] = _is_mobile_online
    _d["group"] = _group(_redis, _user.get("uuid"))

    _fields = [
        "uuid",
        "user_icon",
        "user_email",
        "user_fullname",
        "user_signature",
        "updatetime",
    ]
    for _i in _fields:
        _d[_i] = _user.get(_i)
    if isinstance(_d["updatetime"], str):
        _updatetime = string_to_datetime(_d["updatetime"])
        _d["updatetime"] = datetime_to_timestamp(_updatetime)
    return _d

def single_user(_redis, _user_dict):
    return _single(_redis, _user_dict)
    
class PPGetOrgGroupUserListHandler(BaseHandler):
        
    def _get_users(self, _users):
        _redis = self.application.redis
        _pi = _redis.pipeline()
        _pre = DeviceUser.__tablename__ + ".uuid."
        for _user_uuid in _users:
            _key = _pre + _user_uuid
            _pi.hgetall(_key)
        _unsort = _pi.execute()
        return _unsort
    
    def _get(self, _app_uuid, _group_uuid):
        _redis = self.application.redis
        _key = OrgGroup.__tablename__ + ".app_uuid." + _app_uuid
        _is = _redis.sismember(_key, _group_uuid)
        if _is != True:
            self.setErrorCode(API_ERR.NO_ORG_GROUP)
            return

        _r = self.getReturnData()
        _r["list"] = []
        
        _key = OrgUserGroupData.__tablename__ + ".group_uuid." + _group_uuid
        _users = _redis.smembers(_key)
        if _users == None or len(_users) == 0:
            return
        
        _users = self._get_users(_users)
        for _user in _users:
            _updatetime = string_to_datetime(_user["updatetime"], "extra")
            _user["updatetime"] = datetime_to_timestamp(_updatetime)

        _sorted = sorted(_users, key=itemgetter("updatetime"), reverse=True)

        _return_users = _sorted[:3]
        _shrinked_users = []
        for _user in _return_users:
            _shrinked_users.append(single_user(_redis, _user))

        _r["list"] = _shrinked_users
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
        super(PPGetOrgGroupUserListHandler, self)._Task()
        _body = json.loads(self.request.body)
        if "app_uuid" not in _body or "group_uuid" not in _body:
            self.setErrorCode(API_ERR.NO_PARA)
            return

        self._get(_body.get("app_uuid"), _body.get("group_uuid"))
        return

