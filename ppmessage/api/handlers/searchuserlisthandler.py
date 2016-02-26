# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# 
#

from .basehandler import BaseHandler

from ppmessage.api.error import API_ERR

from ppmessage.db.models import DeviceUser

import json
import logging

class SearchUserListHandler(BaseHandler):
    """
    requst:
    headers with X-x
    {
    pattern:,
    page_size:,
    page_offset:,
    }

    response:
    {
    error_code: 
    error_string:
    count:
    list: [
    {user_id_1, user_fullname}
    user_id_2, user_fullname}
    ]
    total:, all users count matched the pattern
    page_size:, return the input
    page_offset, return the input
    
    }

    """

    def _get(self):
        
        _input = json.loads(self.request.body)
        if "page_offset" not in _input or \
           "page_size" not in _input or \
           "pattern" not in _input:
            logging.error("Error for no para.")
            self.setErrorCode(API_ERR.NO_PARA)
            return
        
        _pattern = _input["pattern"]
        _page_size = _input["page_size"]
        _page_offset = _input["page_offset"]

        if isinstance(_pattern, unicode):
            _pattern = _pattern.encode("utf-8")

        _rdata = self.getReturnData()
        if len(_pattern) == 0:
            _rdata["total"] = 0
            _rdata["count"] = 0
            _rdata["list"] = [];
            _rdata["page_size"] = _page_size
            _rdata["page_offset"] = _page_offset
            return
            
        _key_pattern = DeviceUser.__tablename__ + \
                       ".user_fullname.*" + \
                       _pattern + "*.uuid.*"
        _list = self.application.redis.keys(_key_pattern)

        _total = len(_list)
        _offset = _page_size * _page_offset

        _rdata["total"] = _total
        _rlist = _list[_offset:_page_size+_offset]
        _rdata["count"] = len(_rlist)
        _rdata["list"] = []
        _s = set()
        for _i in _rlist:
            #_e = _i.find(".uuid.")
            #_b = len(DeviceUser.__tablename__ + ".user_fullname.")
            #_name = _i[_b:_e]
            _s.add(_i.split(".")[-1])

        _rdata["list"] = list(_s)

        #logging.info("SEARCHUSERLIST return %s.", str(_rdata))
        return

    def _Task(self):
        super(SearchUserListHandler, self)._Task()
        self._get()
        
        

