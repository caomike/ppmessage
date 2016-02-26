# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# 
#

from .basehandler import BaseHandler

from mdm.db.models import MultipleCardMaterialInfo
from mdm.db.models import SingleCardMaterialInfo

from mdm.api.error import API_ERR

from mdm.core.redis import redis_hash_to_dict

import logging
import json

class GetMultipleCardHandler(BaseHandler):
    """
    requst:
    header
    uuid:
    
    response:    
    {error_code:, body, card}
    body is a list
    card is a dict
    """
    
    def _Task(self):
        super(GetMultipleCardHandler, self)._Task()

        _uuid = json.loads(self.request.body).get("uuid")
        if _uuid is None:
            self.setErrorCode(API_ERR.NO_PARA)
            return
        
        _redis = self.application.redis
        _rdata = self.getReturnData()

        _multiple = redis_hash_to_dict(_redis, MultipleCardMaterialInfo, _uuid)

        if _multiple == None:
            self.setErrorCode(API_ERR.NO_MATERIAL)
            return
        _body = json.loads(_multiple.body)
        _card = {}
        for _single_uuid in _body:
            _single = redis_hash_to_dict(_redis, SingleCardMaterialInfo, _single_uuid)
            if _single == None:
                _body.remove(_single_uuid)
                contine
            _card[_single_uuid] = _single.__dict__
            
        _rdata["body"] = _body
        _rdata["card"] = _card
        logging.info("getmultiplecardmaterial return: %s" % str(_rdata))
        return
