# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# 
#

from .basehandler import BaseHandler

from mdm.db.models import SingleCardMaterialInfo

from mdm.api.error import API_ERR

from mdm.core.redis import redis_hash_to_dict

import logging
import json

class GetSingleCardHandler(BaseHandler):
    """
    requst:
    header
    uuid:
    
    response:
    the same as in db model
    {error_code:, title, abstract...}
    """
    
    def _Task(self):
        super(GetSingleCardHandler, self)._Task()

        _uuid = json.loads(self.request.body).get("uuid")
        if _uuid is None:
            self.setErrorCode(API_ERR.NO_PARA)
            return
        
        _redis = self.application.redis
        _single = redis_hash_to_dict(_redis, SingleCardMaterialInfo, _uuid)
        if _single == None:
            self.setErrorCode(API_ERR.NO_MATERIAL)
            return
        
        _rdata = self.getReturnData()
        _rdata.update(_single.__dict__)
        logging.info("getsinglecardmaterial return: %s" % str(_rdata))
        return
