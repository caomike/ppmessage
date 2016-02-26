# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#

from .basehandler import BaseHandler

from mdm.db.models import OrgGroup
from mdm.db.models import OrgSubGroupData
from mdm.db.models import OrgUserGroupData

from mdm.api.error import API_ERR

from mdm.core.constant import YVOBJECT

import json
import logging

class GetParentsOrgGroupListHandler(BaseHandler):
    
    def _du(self, _uuid):
        _redis = self.application.redis

        _pattern = OrgUserGroupData.__tablename__ + \
                   ".group_uuid.*.user_uuid." + _uuid
        _keys = _redis.keys(_pattern)

        _s = set()
        for _i in _keys:
            _s.add(_i.split(".")[2])
        
        return list(_s)

    def _og(self, _uuid):
        _list = []
        _redis = self.application.redis

        _pattern = OrgSubGroupData.__tablename__ + \
                   ".group_uuid.*.sub_group_uuid." + _uuid
        _keys = _redis.keys(_pattern)

        _s = set()
        for _i in _keys:
            _s.add(_i.split(".")[2])
        
        return list(_s)
        
    def _Task(self):
        super(GetParentsOrgGroupListHandler, self)._Task()

        _input = json.loads(self.request.body)
        if "uuid" not in _input or \
           "type" not in _input:
            logging.error("Error for no para.")
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _uuid = _input["uuid"]
        _type = _input["type"]
        _rdata = self.getReturnData()
        _rdata["count"] = 0
        _rdata["list"] = []

        _list = []
        if _type == YVOBJECT.DU:
            _list = self._du(_uuid)
        elif _type == YVOBJECT.OG:
            _list = self._og(_uuid)
        else:
            console.log("ERROR GETPARENTSORGGROUPLIST unknown type: %s" % (_type))
                
        _rdata["count"] = len(_list)
        _rdata["list"] = _list

        logging.info("GETPARENTSORGGROUPLIST return (%s)." % (str(_rdata)))
        return
        
        
