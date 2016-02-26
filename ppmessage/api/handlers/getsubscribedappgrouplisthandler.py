# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# 

from .basehandler import BaseHandler

from ppmessage.db.models import AppGroup
from ppmessage.db.models import AppUserGroupData

from ppmessage.api.error import API_ERR

import logging
import json

class GetSubscribedAppGroupListHandler(BaseHandler):
    """
    requst:
    headers with X-x

    response:
    {
    error_code: 
    error_string:
    count:
    list: [
    group_uuid_1,
    group_uuid_2,
    ]
    }

    """

    def _get(self):
        _redis = self.application.redis

        _rdata = self.getReturnData()
        _list = []

        _from_uuid = json.loads(self.request.body).get("from_uuid")
        if _from_uuid == None:
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _pattern = AppUserGroupData.__tablename__ + \
                   ".group_uuid.*.user_uuid." + _from_uuid
        _keys = _redis.keys(_pattern)

        for _i in _keys:
            _list.append(_i.split(".")[2])

        _rdata["count"] = len(_list)
        _rdata["list"] = _list

        logging.info("GETSUBAPPGROUPLIST return (%s)." % (str(_rdata)))
        return
        
    def _Task(self):
        super(GetSubscribedAppGroupListHandler, self)._Task()
        self._get()
        
