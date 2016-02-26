# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# @author kun.zhao@ppmessage.com
# 
#

from ppmessage.db.models import MessagePushTask
from ppmessage.db.models import ConversationUserData

from ppmessage.core.redis import redis_hash_to_dict
from ppmessage.core.constant import CONVERSATION_STATUS

def get_app_conversations(redis, app_uuid):
    '''
    return the conversation uuid list which app_uuid is `app_uuid`
    '''
    
    if redis == None or app_uuid == None:
        return []
    
    key = ConversationUserData.__tablename__ + ".app_uuid." + app_uuid + ".conversation_status." + CONVERSATION_STATUS.OPEN
    conversations = redis.zrevrange(key, 0, -1) or []
    return conversations
    
def get_message_info(redis, task_uuid):
    '''
    return the message info which task_uuid is `task_uuid`
    '''
    
    # illegal params
    if redis is None or task_uuid is None:
        return None

    return redis_hash_to_dict(redis, MessagePushTask, task_uuid)

def get_message_count(redis, conversation_uuid):
    '''
    get the total count of the conversation_uuid
    '''

    # illegal params
    if redis is None or conversation_uuid is None:
        return 0

    key = MessagePushTask.__tablename__ + ".conversation_uuid." + conversation_uuid
    return zcard(key)
