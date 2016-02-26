# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#

from .basehandler import BaseHandler

from mdm.db.models import OrgGroup
from mdm.db.models import OrgSubGroupData

from mdm.api.error import API_ERR

import json
import logging

class GetSubOrgGroupListHandler(BaseHandler):
    
    def _sub(self, _uuid):
        _s = set()
        _redis = self.application.redis

        _pattern = OrgSubGroupData.__tablename__ + \
                   ".group_uuid." + _uuid + \
                   ".sub_group_uuid.*"
        _group_list = _redis.keys(_pattern)
        for _i in _group_list:
            _s.add(_i.split(".")[-1])
                    
        return list(_s)
    
    def _Task(self):
        super(GetSubOrgGroupListHandler, self)._Task()

        _input = json.loads(self.request.body)
        if "group_uuid" not in _input:
            logging.error("Error for no para.")
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _rdata = self.getReturnData()
        _rdata["count"] = 0
        _rdata["list"] = []

        _list = self._sub(_input["group_uuid"])
        if _list is not None:
            _rdata["count"] = len(_list)
            _rdata["list"] = _list

        logging.info("GETSUBORGGROUPLIST return (%s)." % (str(_rdata)))
        return
        
        
