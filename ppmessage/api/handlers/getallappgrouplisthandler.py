# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com 
#

from .basehandler import BaseHandler

from ppmessage.db.models import AppGroup
from ppmessage.api.error import API_ERR

class GetAllAppGroupListHandler(BaseHandler):
    """
    requst:
    headers with X-x

    response:
    {
    error_code: 
    error_string:
    count:
    list: [
    group_uuid,
    group_uuid,
    ]
    }

    """
        
    def _get(self):
        _pattern = AppGroup.__tablename__ + ".uuid.*"
        _keys = self.application.redis.keys(_pattern)

        _list = []
        for _i in _keys:
            _list.append(_i.split(".")[-1])
            
        _r = self.getReturnData()
        _r["count"] = 0
        _r["list"] = []
        if _list is not None:
            _r["count"] = len(_list)
            _r["list"] = _list
        return

    def _Task(self):
        super(GetAllAppGroupListHandler, self)._Task()
        self._get()
