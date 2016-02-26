# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Yuan Wanshang, wanshang.yuan@yvertical.com
# Guijin Ding, dingguijin@gmail.com
#

from .basehandler import BaseHandler
from ppmessage.api.error import API_ERR
from ppmessage.db.models import AppGroupMenu

from ppmessage.core.redis import redis_hash_to_dict
import logging
import json

class GetAppGroupMenuHandler(BaseHandler):
    """
    requst:
    headers with X-x
    {
    uuid:,
    }

    response:
    {
    error_code: 
    error_string:
    list:[
    menu_dict: {
    menu_title:,
    
    }]

    """

    
    def _get(self):

        _data = json.loads(self.request.body)
        
        logging.info("GETAPPGROUPMENU with (%s)." % (str(_data)))
 
        if "uuid" not in _data:
            logging.error("Error for request para (%s)." % (str(_data)))
            self.writeError(API_ERR.NO_PARA)
            return

        _group_uuid = _data["uuid"]
        _rdata = self.getReturnData()
        _rdata["list"] = []
        
        _redis = self.application.redis
        _p = AppGroupMenu.__tablename__ + \
             ".group_uuid." + _group_uuid + \
             ".uuid.*"
        _menus = _redis.keys(_p)
        _l = []
        for _i in _menus:
            _menu_uuid = _i.split(".")[-1]
            _menu = redis_hash_to_dict(_redis, AppGroupMenu, _menu_uuid)
            if _menu is None:
                continue
            _l.append(_menu.__dict__)

        _rdata = self.getReturnData()
        _rdata["list"] = _l
        #logging.info("GETAPPGROUPMENU return (%s)."  % (str(_rdata)))
        return
        
    def _Task(self):
        super(GetAppGroupMenuHandler, self)._Task()
        self._get()
        
