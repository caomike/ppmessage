# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# 
#

from .basehandler import BaseHandler

from ppmessage.db.models import MessagePush
from ppmessage.db.models import MessagePushTask

from ppmessage.api.error import API_ERR

from ppmessage.core.constant import YVOBJECT
from ppmessage.core.constant import MESSAGE_STATUS
from ppmessage.core.constant import TASK_STATUS

from ppmessage.core.redis import redis_hash_to_dict

from operator import attrgetter
from operator import itemgetter

import logging
import json

class GetMessageHistoryHandler(BaseHandler):
    """
    requst:
    header
    peer_uuid:
    peer_type:
    page_offset: from 0
    page_size: default 12
    
    response:
    
    {error_code:, total_count:, page_size:, page_offset, count:, list:[
    message_1, message_2, message_3,...
    ]}
    """
    def _Task(self):
        super(GetMessageHistoryHandler, self)._Task()
        _request = json.loads(self.request.body)
        
        _peer_uuid = _request.get("peer_uuid")
        _peer_type = _request.get("peer_type")
        _page_offset = _request.get("page_offset")
        _page_size = _request.get("page_size")
        _from_uuid = _request.get("from_uuid")
        
        if _from_uuid is None or _peer_uuid is None or _peer_type is None or\
           _page_offset is None or _page_size is None:
            self.setErrorCode(API_ERR.NO_PARA)
            return

        self.from_uuid = _from_uuid
        self.peer_uuid = _peer_uuid
        self.peer_type = _peer_type
        self.page_offset = _page_offset
        self.page_size = _page_size
        
        _redis = self.application.redis
        _pre = MessagePushTask.__tablename__ + ".uuid.*"
        _push_tasks = _redis.keys(_pre)
        _unsorted = []
        for _uuid in _push_tasks:
            _task = redis_hash_to_dict(_redis, _uuid)

            if _task is None:
                continue
            
            if not self._related(_task):
                continue
            _unsorted.append(_task)
                        
        _sorted = sorted(_unsorted, key=itemgetter("createtime"), reverse=True)
        _seg = self._page(_sorted)
        
        _rdata = self.getReturnData()
        _rdata["total_count"] = len(_sorted)
        _rdata["count"] = len(_seg)
        _rdata["page_size"] = self.page_size
        _rdata["page_offset"] = self.page_offset
        _rdata["list"] = _seg

        logging.info("getmessagehistory return: %d" % len(_seg))
        return


    def _related(self, _task):

        if _task.get("task_status") == TASK_STATUS.PENDING:
            return False

        if self.peer_type == YVOBJECT.DU:
            return self._check_du(_task)
        if self.peer_type == YVOBJECT.AU:
            return self._check_au(_task)
        if self.peer_type == YVOBJECT.AG:
            return self._check_ag(_task)
        if self.peer_type == YVOBJECT.OG:
            return self._check_og(_task)
        if self.peer_type == YVOBJECT.DG:
            return self._check_dg(_task)

        return False


    def _check_du(self, _task):
        if _task.get("from_uuid") == self.from_uuid and \
           _task.get("to_uuid") == self.peer_uuid:
            return True
        
        if _task.get("from_uuid") == self.peer_uuid and \
           _task.get("to_uuid") == self.from_uuid:
            return True
        
        return False

    def _check_au(self, _task):
        return self._check_du(_task)
    
    def _check_og(self, _task):
        if _task.get("to_uuid") == self.peer_uuid:
            return True
        return False

    def _check_dg(self, _task):
        return self._check_og(_task)

    def _check_ag(self, _task):

        if _task.get("to_uuid") == self.peer_uuid and \
           _task.get("from_uuid") == self.peer_uuid:
            return True

        if _task.get("to_uuid") == self.from_uuid and \
           _task.get("from_uuid") == self.peer_uuid:
            return True

        if _task.get("to_uuid") == self.peer_uuid and \
           _task.get("from_uuid") == self.from_uuid:
            return True

        return False

    def _page(self, _sorted):
        _offset = self.page_offset * self.page_size
        _seg = _sorted[_offset:_offset+self.page_size]
        return _seg
