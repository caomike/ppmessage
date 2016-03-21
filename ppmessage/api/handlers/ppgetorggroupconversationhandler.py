# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from ppmessage.db.models import ConversationInfo
from ppmessage.api.error import API_ERR
from ppmessage.core.constant import API_LEVEL
import json
import logging

class PPGetOrgGroupConversationHandler(BaseHandler):
    """
    requst:
    header:

    body:
    app_uuid, group_uuid, user_uuid
    user_uuid is portal user
    
    response:
    conversation uuid created by the portal user_uuid for group_uuid

    """
    def _get(self, _app_uuid, _group_uuid, _user_uuid):
        _redis = self.application.redis
        _key = ConversationInfo.__tablename__ + \
               ".app_uuid." + _app_uuid + \
               ".user_uuid." + _user_uuid + \
               ".group_uuid." + _group_uuid
        _uuid = _redis.get(_key)
        if _uuid == None:
            self.setErrorCode(API_ERR.NO_CONVERSATION)
            return
        _r = self.getReturnData()
        _r["conversation_uuid"] = _uuid
        return

    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCOM)
        return

    def _Task(self):
        super(PPGetOrgGroupConversationHandler, self)._Task()
        _body = json.loads(self.request.body)
        if "app_uuid" not in _body or \
           "group_uuid" not in _body or \
           "user_uuid" not in _body:
            self.setErrorCode(API_ERR.NO_PARA)
            return
        self._get(_body.get("app_uuid"),
                  _body.get("group_uuid"),
                  _body.get("user_uuid"))
        return

