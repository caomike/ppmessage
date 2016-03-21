# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from ppmessage.db.models import OrgGroup
from ppmessage.db.models import AppInfo
from ppmessage.db.models import FileInfo
from ppmessage.db.models import DeviceUser
from ppmessage.db.models import ConversationInfo
from ppmessage.db.models import ConversationUserData

from ppmessage.core.redis import redis_hash_to_dict

from ppmessage.api.error import API_ERR
from ppmessage.core.constant import API_LEVEL
from ppmessage.core.constant import CONVERSATION_TYPE
from ppmessage.core.constant import CONVERSATION_STATUS

from ppmessage.dispatcher.policy.policy import AbstractPolicy
from ppmessage.dispatcher.policy.policy import BroadcastPolicy

from ppmessage.core.utils.createicon import create_group_icon

import copy
import uuid
import json
import time
import logging
import datetime

class Conversation():
    def _result_data(self, _conversation, _member_list):
        _rdata = {}
        _rdata["user_list"] = _member_list        
        _rdata["uuid"] = _conversation["uuid"]
        _rdata["app_uuid"] = self._app_uuid
        _rdata["user_uuid"] = self._user_uuid
        _rdata["assigned_uuid"] = _conversation.get("assigned_uuid")
        _rdata["group_uuid"] = self._group_uuid
        _rdata["status"] = CONVERSATION_STATUS.NEW
        _rdata["conversation_name"] = self._return_name
        _rdata["conversation_icon"] = self._return_icon
        _rdata["conversation_type"] = self._conv_type
        _rdata["updatetime"] = datetime.datetime.now()
        _rdata["createtime"] = datetime.datetime.now()
        return _rdata

    def _get_conversation_user_list(self):
        _key = AppInfo.__tablename__ + ".uuid." + self._app_uuid
        _policy_name = self._redis.hget(_key, "app_route_policy")
        _cls = AbstractPolicy.get_policy_cls_by_name(_policy_name)
        _list = _cls.create_conversation_users(self._app_uuid, self._group_uuid, self._redis)
        return _list

    def _datarow(self, _user_uuid, _user_name, _conversation_type, _conversation_uuid, _conversation_name, _conversation_icon):
        _values = {
            "uuid": str(uuid.uuid1()),
            "app_uuid": self._app_uuid,
            "user_uuid": _user_uuid,
            "user_name": _user_name,
            "conversation_type": _conversation_type,
            "conversation_uuid": _conversation_uuid,
            "conversation_name": _conversation_name,
            "conversation_icon": _conversation_icon,
            "conversation_status": CONVERSATION_STATUS.NEW,
        }
        _row = ConversationUserData(**_values)
        _row.async_add()
        _row.create_redis_keys(self._redis)
        return
        
    def _userdata(self, _conversation, _member_list):
        _redis = self._redis
        _conversation_uuid = _conversation["uuid"]
        _user_uuid = _conversation["user_uuid"]
        _conversation_name = _conversation.get("conversation_name")
        _conversation_icon = _conversation.get("conversation_icon")
        _conversation_type = _conversation.get("conversation_type")

        if _conversation_type == CONVERSATION_TYPE.P2S:
            # i is service users
            for _i in _member_list:
                self._datarow(_i, None, _conversation_type, _conversation_uuid, _conversation_name, _conversation_icon)

            # only one member it is a portal user
            if len(_member_list) == 1:
                _user_key = DeviceUser.__tablename__ + ".uuid." + _member_list[0]
                _conversation_icon = _redis.hget(_user_key, "user_icon")
                _conversation_name = _redis.hget(_user_key, "user_fullname")
                
            # multiple service users may come from a group or whole app team
            if len(_member_list) > 1:
                _group_users = copy.deepcopy(_member_list)
                _group_users.append(_user_uuid)
                _conversation_icon = create_group_icon(_redis, _group_users)
                
                if self._group_uuid != None:
                    _group_key = OrgGroup.__tablename__ + ".uuid." + self._group_uuid
                    _conversation_name = _redis.hget(_group_key, "group_name")
                else:
                    _app_key = AppInfo.__tablename__ + ".uuid." + self._app_uuid
                    _conversation_name = _redis.hget(_app_key, "app_name")

            self._datarow(_user_uuid, None, _conversation_type, _conversation_uuid, _conversation_name, _conversation_icon)
            self._return_name = _conversation_name
            self._return_icon = _conversation_icon
            return

        if _conversation_type == CONVERSATION_TYPE.S2S:
            # ONE TO ONE
            if len(_member_list) == 1:
                _key = DeviceUser.__tablename__ + ".uuid." + _member_list[0]
                _other = _redis.hmget(_key, ["user_icon", "user_fullname"])
                _other_icon = _other[0]
                _other_fullname = _other[1]
                
                self._datarow(_user_uuid, self._user_fullname, _conversation_type, _conversation_uuid, _other_fullname, _other_icon)
                
                self._datarow(_member_list[0], _other_fullname, _conversation_type, _conversation_uuid, self._user_fullname, self._user_icon)

                self._return_name = _other_fullname
                self._return_icon = _other_icon
                return

            # GROUP
            if len(_member_list) > 1:
                _member_list.append(_user_uuid)
                for _i in _member_list:
                    self._datarow(_i, None, _conversation_type, _conversation_uuid, _conversation_name, _conversation_icon)
                return
        return

    def _create(self):
        _key = DeviceUser.__tablename__ + ".uuid." + self._user_uuid
        _user = self._redis.hmget(_key, ["user_icon", "user_fullname"])
        self._user_icon = _user[0]
        self._user_fullname = _user[1]
        
        _conv_icon = self._user_icon

        if self._conv_type != CONVERSATION_TYPE.P2S and len(self._member_list) > 1:
            _group_users = copy.deepcopy(self._member_list)
            _group_users.append(self._user_uuid)
            _conv_icon = create_group_icon(self._redis, _group_users)

        self._return_icon = _conv_icon
        self._return_name = self._conv_name

        _list = self._member_list
        if self._conv_type == CONVERSATION_TYPE.P2S:
            if _list == None or len(_list) == 0:
                _list = self._get_conversation_user_list()

        if _list == None or len(_list) == 0:
            self._handler.setErrorCode(API_ERR.NO_CONVERSATION_MEMBER)
            return None

        _assigned_uuid = None
        if len(_list) == 1:
            _assigned_uuid = _list[0]
            
        _conv_uuid = str(uuid.uuid1())
        _values = {
            "uuid": _conv_uuid,
            "user_uuid": self._user_uuid,
            "assigned_uuid": _assigned_uuid,
            "app_uuid": self._app_uuid,
            "group_uuid": self._group_uuid,
            "conversation_name": self._conv_name,
            "conversation_icon": _conv_icon,
            "conversation_type": self._conv_type,
            "status": CONVERSATION_STATUS.NEW,
        }
        # create it
        _row = ConversationInfo(**_values)
        _row.async_add()
        _row.create_redis_keys(self._redis)

        self._userdata(_values, copy.deepcopy(_list))

        return self._result_data(_values, _list)

    def create(self, _handler, _request):
        self._handler = _handler
        self._redis = _handler.application.redis
        
        self._conv_type = _request.get("conversation_type")
        self._conv_name = _request.get("conversation_name")
        self._user_uuid = _request.get("user_uuid")
        self._app_uuid = _request.get("app_uuid")
        self._group_uuid = _request.get("group_uuid")
        self._member_list = _request.get("member_list")
        
        if self._app_uuid == None:
            self._app_uuid = _handler.app_uuid

        if self._member_list != None and isinstance(self._member_list, list) == True:
            self._member_list = list(set(self._member_list))

        return self._create()
        

class PPCreateConversationHandler(BaseHandler):
    """
    For the member_list length == 1, if the conversation has been created 
    return the existed conversation

    For the group_uuid != None, if the conversation has been created
    return the existed conversation
    
    """
    def _return(self, _conversation_uuid):
        _conversation = redis_hash_to_dict(self.application.redis, ConversationInfo, _conversation_uuid)
        if _conversation == None:
            self.setErrorCode(API_ERR.NO_CONVERSATION)
            return
        _r = self.getReturnData()
        _r.update(_conversation)
        return
    
    def _existed(self, _request):
        _app_uuid = _request.get("app_uuid")
        _user_uuid = _request.get("user_uuid")
        _group_uuid = _request.get("group_uuid")
        _member_list = _request.get("member_list")
        _conversation_type = _request.get("conversation_type")
        _redis = self.application.redis
        
        if _group_uuid != None:
            _key = ConversationInfo.__tablename__ + ".app_uuid." + _app_uuid + \
                   ".user_uuid." + _user_uuid + ".group_uuid." + _group_uuid
            _conversation_uuid = _redis.get(_key)
            if _conversation_uuid != None:
                self._return(_conversation_uuid)
                return True
            return False
        
        if _member_list != None and isinstance(_member_list, list) == True and len(_member_list) == 1:
            _assigned_uuid = _member_list[0]
            if _assigned_uuid == None:
                return False
            _key = ConversationInfo.__tablename__ + ".app_uuid." + _app_uuid + \
                   ".user_uuid." + _user_uuid + ".assigned_uuid." + _assigned_uuid
            _conversation_uuid = _redis.get(_key)
            if _conversation_uuid != None:
                _key = ConversationUserData.__tablename__ + ".conversation_uuid." + _conversation_uuid
                _count = len(_redis.smembers(_key))
                if _count == 2:
                    self._return(_conversation_uuid)
                    _r = self.getReturnData()
                    _key = ConversationUserData.__tablename__ + ".app_uuid." + _app_uuid + \
                           ".user_uuid." + _user_uuid + ".conversation_uuid." + _conversation_uuid
                    _data_uuid = _redis.get(_key)
                    if _data_uuid != None:
                        _key = ConversationUserData.__tablename__ + ".uuid." + _data_uuid
                        _data = _redis.hmget(_key, ["conversation_name", "conversation_icon"])
                        if _data[0] != None:
                            _r["conversation_name"] = _data[0]
                        if _data[1] != None:
                            _r["conversation_icon"] = _data[1]
                    return True
            return False

        if _member_list != None and isinstance(_member_list, list) == True and len(_member_list) > 1:
            _members = set(_member_list + [_user_uuid])
            _key = ConversationUserData.__tablename__ + ".app_uuid." + _app_uuid + ".user_uuid." + _user_uuid
            _coversations = _redis.smembers(_key)
            if len(_conversations) == 0:
                return False
            for _conversation_uuid in _conversations:
                _key = ConversationUserData.__tablename + ".conversation_uuid." + _conversation_uuid
                if _members == _redis.smembers(_key):
                    self._return(_conversation_uuid)
                    return True
            return False

        if _member_list == None and _conversation_type == CONVERSATION_TYPE.P2S:
            _key = ConversationUserData.__tablename__ + ".app_uuid." + _app_uuid + ".user_uuid." + _user_uuid
            _conversations = _redis.smembers(_key)
            if len(_conversations) == 0:
                return False

            _pi = _redis.pipeline()
            for _conversation_uuid in _conversations:
                _key = ConversationInfo.__tablename__ + ".uuid." + _conversation
                _pi.hget(_key, "updatetime")
            _updatetime = _pi.execute()
            
            _unsorted = zip(_conversations, _updatetime)
            _sorted = sorted(_unsorted, lambda x,y: cmp(x[1], y[1]), reverse=True)
            self._return(_sorted[0][0])
            return True

        return False

    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCOM)
        self.addPermission(api_level=API_LEVEL.PPKEFU)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_KEFU)
        return
    
    def _Task(self):
        super(PPCreateConversationHandler, self)._Task()
        _request = json.loads(self.request.body)

        _app_uuid = _request.get("app_uuid")
        _user_uuid = _request.get("user_uuid")
        _conversation_type = _request.get("conversation_type")
        
        _member_list = _request.get("member_list")
        _group_uuid = _request.get("group_uuid")
        
        if _app_uuid == None or _user_uuid == None or _conversation_type == None:
            self.setErrorCode(API_ERR.NO_PARA)
            return

        # if P2S, group_uuid/member_list/none is permitted
        if _conversation_type != CONVERSATION_TYPE.P2S and _member_list == None:
            self.setErrorCode(API_ERR.NO_PARA)
            return None

        if self._existed(_request):
            return

        _conv = Conversation()
        _r = _conv.create(self, _request)
        if _r != None:
            _res = self.getReturnData()
            _res.update(_r)
        return

