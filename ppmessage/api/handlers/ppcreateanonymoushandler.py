# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from ppmessage.api.error import API_ERR
from ppmessage.db.models import DeviceUser
from ppmessage.db.models import AppUserData

from ppmessage.core.constant import API_LEVEL
from ppmessage.core.constant import USER_NAME
from ppmessage.core.constant import USER_STATUS
from ppmessage.core.redis import redis_hash_to_dict
from ppmessage.core.utils.createicon import create_user_icon
from ppmessage.bootstrap.data import BOOTSTRAP_DATA

import json
import uuid
import logging
import urllib2

class PPCreateAnonymousHandler(BaseHandler):
    
    def _create(self, _ppcom_trace_uuid):
        _redis = self.application.redis
        _key = DeviceUser.__tablename__ + ".ppcom_trace_uuid." + _ppcom_trace_uuid
        _uuid = _redis.get(_key)
        logging.info(_key)
        if _uuid != None:
            _user = redis_hash_to_dict(_redis, DeviceUser, _uuid)
            if _user != None:
                _rdata = self.getReturnData()
                _rdata["user_uuid"] = _uuid
                _rdata["user_email"] = _user["user_email"]
                _rdata["user_fullname"] = _user["user_fullname"]
                _rdata["user_icon"] = _user["user_icon"]
                return
        
        _du_uuid = str(uuid.uuid1())
        _user_email = _du_uuid[:6] + "@" + self.app_uuid[:6]
        _user_name = self._create_user_name()
        
        _values = {
            "uuid": _du_uuid,
            "ppcom_trace_uuid": _ppcom_trace_uuid,
            "user_status": USER_STATUS.ANONYMOUS,
            "is_anonymous_user": True,
            "user_name": _user_name,
            "user_email": _user_email,
            "user_fullname": _user_name,
            "user_icon": create_user_icon(_du_uuid),
        }
        
        _row = DeviceUser(**_values)
        _row.async_add()
        _row.create_redis_keys(self.application.redis)

        _data_uuid = str(uuid.uuid1())
        _values = {
            "uuid": _data_uuid,
            "user_uuid": _du_uuid,
            "app_uuid": self.app_uuid,
            "is_portal_user": True,
            "is_service_user": False,
            "is_owner_user": False,
            "is_distributor_user": False,
        }
        _row = AppUserData(**_values)
        _row.async_add()
        _row.create_redis_keys(self.application.redis)
        
        _rdata = self.getReturnData()
        _rdata["user_uuid"] = _du_uuid
        _rdata["user_fullname"] = _user_name
        _rdata["user_email"] = _user_email
        _rdata["user_name"] = _user_name
        return
    
    def _create_user_name(self):
        """
        Get user nickName
        """

        _language = "en"
        _string = USER_NAME["en"]
        if BOOTSTRAP_DATA.get("user_language") == "zh_cn":
            _language = "zh-CN"
            _string = USER_NAME["cn"]

        if BOOTSTRAP_DATA.get("user_language") == "zh_tw":
            _language = "zh-TW"
            _string = USER_NAME["tw"]

        _ip = self.request.headers["X-Real-Ip"]

        if _ip == None or _ip == "127.0.0.1" or _ip == "localhost" or "192.168." in _ip:
            return _string.get("local") + _string.get("user")

        _city = None
        try:
            _city = self.application.geoip_reader.city(_ip)
        except:
            logging.error("geoip failed: %s" % _ip)
            _city = None
            
        if _city == None:
            return _string.get("unknown") + _string.get("user")

        
        _country_name = _city.country.names.get(_language)
        _city_name = _city.city.names.get(_language)

        if _city_name != None and _country_name != None:
            return _country_name + _city_name + _string.get("user")

        if _city_name != None:
            return _city_name + _string.get("user")
        
        if _country_name != None:
            return _country_name + _string.get("user")
        
        return _string.get("unknown") + _string.get("user")

    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCOM)
        return

    def _Task(self):
        super(PPCreateAnonymousHandler, self)._Task()
        _request = json.loads(self.request.body)
        _ppcom_trace_uuid = _request.get("ppcom_trace_uuid")
        if _ppcom_trace_uuid == None:
            logging.error("no ppcom trace id provided.")
            self.setErrorCode(API_ERR.NO_PARA)
            return
        self._create(_ppcom_trace_uuid)
        return

