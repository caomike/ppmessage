# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#

from .basehandler import BaseHandler

from mdm.db.models import OrgGroup
from mdm.db.models import AppGroup
from mdm.db.models import DiscussionGroup
from mdm.db.models import OrgUserGroupData
from mdm.db.models import DiscussionUserGroupData

from mdm.api.error import API_ERR

from mdm.core.constant import YVOBJECT
from mdm.core.redis import redis_hash_to_dict

import json
import logging

class GetLeadingGroupListHandler(BaseHandler):
    """
    requst:
    headers with X-x
    {"type:"} //og ag dg

    response:
    {
    error_code: 
    error_string:
    type:
    count:
    list: [
    group_id_1,
    group_id_2,
    ]
    }

    """

    def _org(self):
        _list = []
        _redis = self.application.redis

        _pattern = OrgUserGroupData.__tablename__ + \
                   ".group_uuid.*" + \
                   ".user_uuid." + self.from_uuid

        _group_list = _redis.keys(_pattern)
        for _i in _group_list:
            _data_uuid = _redis.get(_i)
            _data = redis_hash_to_dict(_redis, OrgUserGroupData, _data_uuid)
            if _data.is_leader == True:
                _list.append(_i)

        return _list

    def _app(self):
        _redis = self.application.redis
        _pattern = AppUserGroupData.__tablename__ + \
                   ".group_uuid.*" + \
                   ".user_uuid." + self.from_uuid
        _group_list = _redis.keys(_pattern)
        _s = set()
        for _i in _group_list:
            _group_uuid = _i.split(".")[-3]
            _group = redis_hash_to_dict(self.application.redis, AppGroup, _group_uuid)
            if _group is not None:
                if _group.user_uuid == self.from_uuid:
                    _s.add(_group.uuid)
        return _list(_s)

    def _dg(self):
        _redis = self.application.redis
        _pattern = DiscussionUserGroupData.__tablename__ + \
                   ".group_uuid.*" + \
                   ".user_uuid." + self.from_uuid
        _group_list = _redis.keys(_pattern)
        _s = set()
        for _i in _group_list:
            _group_uuid = _i.split(".")[-3]
            _group = redis_hash_to_dict(self.application.redis, DiscussionGroup, _group_uuid)
            if _group is not None:
                if _group.user_uuid == self.from_uuid:
                    _s.add(_group.uuid)

        return list(_s)

    def _post(self):
    
        _input = json.loads(self.request.body)
        logging.info("GETLEADINGGROUPLIST with (%s)" % (str(_input)))

        if "type" not in _input or "from_uuid" not in _input:
            self.setErrorCode(API_ERR.NO_PARA)
            logging.error("Error for request para (%s)." % (str(_input)))
            return

        _type = _input["type"]
        _from_uuid = _input["from_uuid"]
        self.from_uuid = _from_uuid

        _rdata = self.getReturnData()
        _rdata["count"] = 0
        _rdata["type"] = _type
        _rdata["list"] = []

        _list = None
        if _type == YVOBJECT.OG:
            _list = self._org()
        if _type == YVOBJECT.AG:
            _list = self._app()
        if _type == YVOBJECT.DG:
            _list = self._dg()

        if _list is not None:
            _rdata["count"] = len(_list)
            _rdata["type"] = _type
            _rdata["list"] = _list

        logging.info("GETLEADINGGROUPLIST return (%s)." % (str(_rdata)))
        return

    def _Task(self):
        super(GetLeadingGroupListHandler, self)._Task()
        self._post()
        
        
