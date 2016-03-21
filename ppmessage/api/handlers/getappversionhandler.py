# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# 
#

from .basehandler import BaseHandler

from ppmessage.core.redis import redis_hash_to_dict
from ppmessage.db.models import AppPackageInfo
from ppmessage.api.error import API_ERR

from ppmessage.core.constant import API_LEVEL

import json
import traceback
import logging

class GetAppVersionHandler(BaseHandler):
    """
    requst:
    header with X
    body {app_distinct_name:,}

    response:
    body {
          app_frinedly_name:, 
          app_distinct_name:,
          app_file_name:,
          app_version_code:,
          app_version_name:, 
          app_file_id:} 
    """

    def _Before(self):
        return True

    def initialize(self):
        self.addPermission(api_level=API_LEVEL.PPKEFU)
        return
    
    def _Task(self):
        super(GetAppVersionHandler, self)._Task()
        _request = json.loads(self.request.body)
        _app_distinct_name = _request.get("app_distinct_name")
        _app_platform = _request.get("app_platform")
                
        if _app_distinct_name == None or _app_platform == None:
            logging.error("Error for app_distinct_name or app_platform is not in request.")
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _redis = self.application.redis
        _key = AppPackageInfo.__tablename__ + \
               ".app_platform." + _app_platform + \
               ".app_distinct_name." + _app_distinct_name

        _app_uuid = _redis.get(_key)
        if _app_uuid == None:
            logging.error("no such app")
            self.setErrorCode(API_ERR.NO_APP)
            return

        _app = redis_hash_to_dict(_redis, AppPackageInfo, _app_uuid)
        if _app == None:
            logging.error("no such app")
            self.setErrorCode(API_ERR.NO_APP)
            return

        _rdata = self.getReturnData()
        for _k in _app:
            _rdata[_k] = _app[_k]
            
        #logging.info("GETAPPVERSION return " + str(_rdata))
        return
    
