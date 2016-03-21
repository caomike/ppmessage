# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from ppmessage.db.models import OrgGroup
from ppmessage.db.models import ConversationInfo

from ppmessage.api.error import API_ERR
from ppmessage.core.redis import redis_hash_to_dict
from ppmessage.core.constant import CONVERSATION_TYPE
from ppmessage.dispatcher.policy.algorithm import AbstractAlgorithm

from ppmessage.core.constant import API_LEVEL

import uuid
import json
import logging

class PPSelectUsersByGroupAlgorithmHandler(BaseHandler):
    """
    requst:
    header
    app_uuid, group_uuid, conversation_uuid
    
    response:
    list: user uuid list

    """
        
    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCOM)
        self.addPermission(api_level=API_LEVEL.PPKEFU)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_KEFU)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        return
    
    def _Task(self):
        super(PPSelectUsersByGroupAlgorithmHandler, self)._Task()
        _request = json.loads(self.request.body)

        _app_uuid = _request.get("app_uuid")
        _group_uuid = _request.get("group_uuid")
        _conversation_uuid = _request.get("conversation_uuid")
                
        if _conversation_uuid == None or \
           _app_uuid == None or \
           _group_uuid == None:
            logging.error("no conversation_uuid/app_uuid/group_uuid")
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _redis = self.application.redis
        _conv = redis_hash_to_dict(_redis, ConversationInfo, _conversation_uuid)
        if _conv == None:
            logging.error("no such conversation for uuid: %s" % _conversation_uuid)
            self.setErrorCode(API_ERR.NO_CONVERSATION)
            return

        if _conv.get("conversation_type") != CONVERSATION_TYPE.P2S and \
           _conv.get("conversation_type") != CONVERSATION_TYPE.S2P:
            self.setErrorCode(API_ERR.CONVERSATION_TYPE)
            return

        if _conv.get("group_uuid") == _group_uuid:
            self.setErrorCode(API_ERR.EX_GROUP_USER)
            return

        _group = redis_hash_to_dict(_redis, OrgGroup, _group_uuid)
        if _group == None:
            self.setErrorCode(API_ERR.NO_ORG_GROUP)
            return None
        
        _cls = AbstractAlgorithm.get_algorithm_cls_by_name(_group["group_route_algorithm"])
        _best = _cls.best(_app_uuid, _group_uuid, _redis)
        _r = self.getReturnData()
        logging.info(_best)
        _r["list"] = list(_best)
        return

