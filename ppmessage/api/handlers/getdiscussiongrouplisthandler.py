# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#

from .basehandler import BaseHandler

from mdm.db.models import DiscussionUserGroupData

from mdm.api.error import API_ERR

import json
import logging

class GetDiscussionGroupListHandler(BaseHandler):
    
    def _dis(self, _from_uuid):
        _redis = self.application.redis
        _pattern = DiscussionUserGroupData.__tablename__ + \
                   ".group_uuid.*." + "user_uuid." + _from_uuid
        _keys = _redis.keys(_pattern)
        _s = set()
        for _i in _keys:
            _s.add(_i.split(".")[2])
        
        return list(_s)
    
    def _Task(self):
        super(GetDiscussionGroupListHandler, self)._Task()

        _from_uuid = json.loads(self.request.body).get("from_uuid")
        if _from_uuid == None:
            logging.error("send message failed for input.")
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _rdata = self.getReturnData()
        _list = self._dis(_from_uuid)
        _rdata["count"] = len(_list)
        _rdata["list"] = _list

        logging.info("GETDISCUSSIONGROUPLIST return (%s)." % (str(_rdata)))
        return
        
        
