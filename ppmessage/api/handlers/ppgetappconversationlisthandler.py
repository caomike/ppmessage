# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# kun.zhao@yvertical.com
#
#

from .basehandler import BaseHandler

from ppmessage.api.error import API_ERR
from ppmessage.db.models import ConversationInfo
from ppmessage.core.redis import redis_hash_to_dict

from ppmessage.core.constant import API_LEVEL

from ppmessage.core.utils.deviceuserinfoutils import get_device_user_info
from ppmessage.core.utils.messageutils import get_message_info
from ppmessage.core.utils.messageutils import get_message_count
from ppmessage.core.utils.messageutils import get_app_conversations

import json
import logging

class PPGetAppConversationListHandler(BaseHandler):
    """
    requst:
    app_uuid
    
    response:
    json with error_code
    all conversation list related to the app_uuid
    """
    def _get(self, _app_uuid):
        _redis = self.application.redis
        _conversations = self._get_app_conversations(_redis, _app_uuid)
        _l = []
        for _conversation_uuid in _conversations:
            if _conversation_uuid == None:
                continue
            
            _data = redis_hash_to_dict(_redis, ConversationInfo, _conversation_uuid)
            if _data == None or _data.get("latest_task") == None:
                continue

            # we add user_info here for convenient client to use
            _data['create_user'] = self._get_user_info(_redis, _data['user_uuid'])

            # we add latest message info here for convenient client to use
            _data['latest_message'] = self._get_latest_message(_redis, _data['latest_task'])

            # add message total count
            _data['message_total_count'] = self._get_message_count(_redis, _data['uuid'])
                
            _l.append(_data)

        _r = self.getReturnData()
        _r["list"] = _l
        return

    def _get_app_conversations(self, redis, app_uuid):
        '''
        return conversation uuid list which app_uuid is `app_uuid`
        '''
        return get_app_conversations(redis, app_uuid)
    
    def _get_user_info(self, redis, user_uuid):
        '''
        return user_info who's uuid is `user_uuid`
        '''
        return get_device_user_info(redis, user_uuid)

    def _get_latest_message(self, redis, task_uuid):
        '''
        return latest message info
        '''
        return get_message_info(redis, task_uuid)

    def _get_message_count(self, redis, conversation_uuid):
        '''
        return message count of the `conversation_uuid`
        '''
        return get_message_count(redis, conversation_uuid)

    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCOM)        
        self.addPermission(api_level=API_LEVEL.PPKEFU)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)        
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_KEFU)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        return
    
    def _Task(self):
        super(PPGetAppConversationListHandler, self)._Task()
        _app_uuid = json.loads(self.request.body).get("app_uuid")
        if _app_uuid == None:
            logging.error("no app_uuid provided")
            self.setErrorCode(API_ERR.NO_PARA)
            return
        self._get(_app_uuid)
        return

        
