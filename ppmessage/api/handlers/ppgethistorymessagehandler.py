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
from ppmessage.core.constant import API_LEVEL
from ppmessage.core.constant import YVOBJECT
from ppmessage.core.constant import MESSAGE_STATUS
from ppmessage.core.constant import TASK_STATUS

from ppmessage.core.redis import redis_hash_to_dict
from ppmessage.core.utils.deviceuserinfoutils import get_device_user_info

from operator import attrgetter
from operator import itemgetter

import logging
import json

class PPGetHistoryMessageHandler(BaseHandler):
    """
    requst:
    header
    conversation uuid
    page_offset: from 0, NOTE: `-1` meaning return all messages !
    page_size: default 20
    
    response:
    
    {error_code:, total_count:, page_size:, page_offset, count:, list:[
    message_1, message_2, message_3,...
    ]}

    How to use?
    - the first request:
    {
        conversation_uuid: xxx,
        page_offset: 0, // -1 : return all messages
        page_size: 20,
    }
    - response { list: [xx, xx, xx, ...], ... } // you should record the max_id: `response.list[0].uuid` here for the left request.

    - the second request:
    {
        conversation_uuid: xxx,
        page_offset: 1,
        page_size: 20,
        max_id: max_id, // your max_id which get from first request
    }

    - the third request:
    {
        conversation_uuid: xxx,
        page_offset: 2,
        page_size: 20,
        max_id: max_id, // your max_id which get from first request
    }

    ...

    - You can also specified the `since_id` as the lower index(or cursor).
    - Response will always return the latest message's `max_id`.

    @see https://dev.twitter.com/rest/public/timelines (Working with Timelines)

    |----page-4----|----page-3----|----page-2----|----page-1----|----page-0----|---> new_message
    |since_id--p4--|----page-3----|----page-2----|----page-1----|----p0--max_id|---> new_message

    """

    # default is 20
    DEFAULT_PAGE_SIZE = 20

    # no pagination offset
    NO_PAGEINATION_OFFSET = -1

    def initialize(self):
        self.addPermission(api_level=API_LEVEL.PPCOM)
        self.addPermission(api_level=API_LEVEL.PPKEFU)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_KEFU)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        return
    
    def _Task(self):
        super(PPGetHistoryMessageHandler, self)._Task()
        _request = json.loads(self.request.body)
        
        _conversation_uuid = _request.get("conversation_uuid")
        _page_offset = _request.get("page_offset")
        _page_size = _request.get("page_size") #optional
        _since_id = _request.get("since_id") #optional
        _max_id = _request.get("max_id") #optional

        self.ignore_max = _request.get("ignore_max") #optional
        self.ignore_since = _request.get("ignore_since") #optional
        
        if _conversation_uuid == None or _page_offset is None:
            self.setErrorCode(API_ERR.NO_PARA)
            return

        # set default page_size if need
        if _page_offset != PPGetHistoryMessageHandler.NO_PAGEINATION_OFFSET:
            if _page_size is None:
                _page_size = PPGetHistoryMessageHandler.DEFAULT_PAGE_SIZE

        self.conversation_uuid = _conversation_uuid
        self.page_offset = _page_offset
        self.page_size = _page_size
        
        _redis = self.application.redis
        _key = MessagePushTask.__tablename__ + ".conversation_uuid." + _conversation_uuid
        _push_tasks = _redis.zrange(_key, 0, -1)

        _unsorted = []
        _user_info_dicts = {} # for cache
        
        for _task_uuid in _push_tasks:
            _task = redis_hash_to_dict(_redis, MessagePushTask, _task_uuid)
            if _task is None:
                continue
            if _task.get("task_status") == TASK_STATUS.PENDING:
                continue

            # we add from_user info here to faciliate client to use
            _user_uuid = _task['from_uuid']
            if _user_uuid in _user_info_dicts:
                _task['from_user'] = _user_info_dicts[_user_uuid]
            else:
                _user_info = self._get_user_info(_redis, _user_uuid) # get user_info
                _user_info_dicts[_user_uuid] = _user_info # cache user_info
                _task['from_user'] = _user_info
            
            _unsorted.append(_task)
            
        _sorted = sorted(_unsorted, key=itemgetter("createtime"), reverse=True)
        
        _filtered = self._filter(_sorted, _since_id, _max_id)
        _seg = self._page(_filtered)
        
        _rdata = self.getReturnData()
        _rdata["total_count"] = len(_sorted)
        _rdata["count"] = len(_seg)
        _rdata["page_size"] = self.page_size
        _rdata["page_offset"] = self.page_offset
        _rdata["list"] = _seg
        _rdata["max_id"] = self._get_max_id(_sorted)

        logging.info("ppgethistorymessage return: %d" % len(_seg))
        return

    def _page(self, _sorted):
        # if page_offset is -1, then will return all history messages
        if self.page_offset == PPGetHistoryMessageHandler.NO_PAGEINATION_OFFSET:
            return _sorted

        # pagination
        _offset = self.page_offset * self.page_size
        _seg = _sorted[_offset:_offset+self.page_size]
        return _seg

    def _filter(self, _sorted, _since_id, _max_id):
        '''
        return _sorted[_since_id(old), _max_id(new)]
        '''
        if _since_id is None and _max_id is None:
            return _sorted

        _max_index = len(_sorted)
        _min_index = 0
        
        _find_max = _max_id is None
        _find_min = _since_id is None
        
        for _index, _task in enumerate(_sorted):
            _uuid = _task.get("uuid")
            
            if _uuid == _max_id:
                if self.ignore_max is True:
                    _min_index = _index + 1
                else:
                    _min_index = _index
                _find_max = True
                if _find_min:
                    break
                
            if _uuid == _since_id:
                if self.ignore_since is True:
                    _max_index = _index - 1
                else:
                    _max_index = _index
                _find_min = True
                if _find_max:
                    break

        logging.info("------[%d, %d]-----" % (int(_min_index), int(_max_index)))
        _arr = _sorted[_min_index: _max_index]
        
        return _arr

    def _get_max_id(self, _sorted):
        '''
        return the latest message push task's uuid
        '''
        if len(_sorted) > 0:
            return _sorted[0].get("uuid")
        return None

    def _get_user_info(self, redis, user_uuid):
        '''
        get user info who's user_uuid is `user_uuid`
        '''
        return get_device_user_info(redis, user_uuid)
