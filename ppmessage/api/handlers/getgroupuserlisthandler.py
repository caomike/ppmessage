# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# 
#

from .basehandler import BaseHandler

from mdm.api.error import API_ERR

from mdm.core.constant import YVOBJECT

from mdm.db.models import AppUserGroupData
from mdm.db.models import OrgUserGroupData
from mdm.db.models import DiscussionGroup
from mdm.db.models import DiscussionUserGroupData

import json
import logging

class GetGroupUserListHandler(BaseHandler):
    """
    requst:
    headers with X-x
    group_id and group_type
    {id:, type:}

    response:
    {
    error_code: 
    error_string:
    count:
    list: [
    user_id_1,
    user_id_2,
    ]
    }

    """

    def _get(self):
        
        _input = json.loads(self.request.body)
        if "group_uuid" not in _input or\
           "group_type" not in _input:
            logging.error("Error for no para.")
            self.setErrorCode(API_ERR.NO_PARA)
            return
        
        _group_uuid = _input["group_uuid"]
        _group_type = _input["group_type"]

        _key = None
        if _group_type == YVOBJECT.AG:
            _key = AppUserGroupData.__tablename__
        if _group_type == YVOBJECT.OG:
            _key = OrgUserGroupData.__tablename__
        if _group_type == YVOBJECT.DG:
            _key = DiscussionUserGroupData.__tablename__

        _key = _key + ".group_uuid." + _group_uuid + ".user_uuid.*"
        _list = self.application.redis.keys(_key)

        _rdata = self.getReturnData()
        _rdata["count"] = 0
        _rdata["list"] = []
        _rdata["leader"] = [];
        if _list is not None:
            _rdata["count"] = len(_list)
            for _i in _list:
                _u_uuid = _i.split(".")[-1]
                _rdata["list"].append(_u_uuid)
                if _group_type == YVOBJECT.OG:
                    _d_uuid = self.application.redis.get(_i)
                    _d_key = OrgUserGroupData.__tablename__ + ".uuid." + _d_uuid
                    _is_leader = self.application.redis.hget(_d_key, "is_leader")
                    if _is_leader == "True":
                        _rdata["leader"].append(_u_uuid)
                if _group_type == YVOBJECT.DG:
                    _d_key = DiscussionGroup.__tablename__ + ".uuid." + _group_uuid
                    _leader_uuid = self.application.redis.hget(_d_key, "user_uuid")
                    if _u_uuid == _leader_uuid:
                        _rdata["leader"].append(_leader_uuid)
                    
        
        logging.info("GETGROUPUSERLIST return %s.", str(_rdata))
        return

    def _Task(self):
        super(GetGroupUserListHandler, self)._Task()
        self._get()
        
        
