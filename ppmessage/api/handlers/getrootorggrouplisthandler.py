# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#

from .basehandler import BaseHandler

from ppmessage.db.models import OrgGroup
from ppmessage.db.models import OrgSubGroupData

from ppmessage.api.error import API_ERR

from ppmessage.core.redis import redis_hash_to_dict

import json
import logging

class GetRootOrgGroupListHandler(BaseHandler):
    
    def _root(self):
        _list = []
        _redis = self.application.redis

        _pattern = OrgGroup.__tablename__ + ".uuid.*" 
        _all = _redis.keys(_pattern)
        for _i in _all:
            _uuid = _i.split(".")[-1]
            _group_row = redis_hash_to_dict(_redis, OrgGroup, _uuid)
            if _group_row.is_root:
                _list.append(_uuid)
        return _list
    
    def _Task(self):
        super(GetRootOrgGroupListHandler, self)._Task()
        _rdata = self.getReturnData()
        _rdata["count"] = 0
        _rdata["list"] = []

        _list = self._root()
        if _list is not None:
            _rdata["count"] = len(_list)
            _rdata["list"] = _list

        logging.info("GETROOTORGGROUPLIST return (%s)." % (str(_rdata)))
        return
        
        
