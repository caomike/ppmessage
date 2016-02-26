# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# Guijin Ding, dingguijin@gmail.com
#
#

from .policy import AbstractPolicy

from ppmessage.core.constant import APP_POLICY

class GroupPolicy(AbstractPolicy):
    def __init__(self, dis):
        super(GroupPolicy, self).__init__(dis)
        self._name = APP_POLICY.GROUP
        return

    @classmethod
    def name(cls):
        return APP_POLICY.GROUP

    @classmethod
    def fallback_users(cls, _app_uuid, _group_uuid, _redis):
        _key = OrgUserGroupData.__tablename__ + ".group_uuid." + _group_uuid
        _users = _redis.smembers(_key)
        if len(_users) > 0:
            return _users[0]
        _key = AppUserData.__tablename__ + ".app_uuid." + ".is_service_user.True.is_distributor_user.True"
        _users = _redis.smembers(_key)
        if len(_users) > 0:
            return _users[0]
        _key = AppUserData.__tablename__ + ".app_uuid." + ".is_service_user.True"
        _users = _redis.smembers(_key)
        if len(_users) > 0:
            return _users[0]
        return None
    
    @classmethod
    def create_conversation_users(cls, _app_uuid, _group_uuid, _redis):
        """
        if no group then app group and broadcast
        if got group then try group algorithm
        """
        _users = None
        if _group_uuid == None:
            _users = AbstractPolicy.distributor_users(_app_uuid, _redis)
        else:
            _users = cls._search_best_with_group(_app_uuid, _group_uuid, _redis)
            if _users == None or len(_users) == 0:
                _users = cls.fallback_users(_app_uuid, _group_uuid, _redis)
        return _users
    
    def _sort_conversation_users(self):
        _app_uuid = self._task["app_uuid"]
        _coversation_uuid = self._task["conversation_uuid"]

        if len(self._conversation_users) == 0:
            return None
        
        _l = []
        for _user_uuid in self._conversation_users:
            _user_data = self._conversation_user_datas_uuid[_user_uuid]
            _data = redis_hash_to_dict(self._redis, ConversationUserData, _user_data)
            if _data == None:
                continue
            self._conversation_user_datas_hash[_user_uuid] = _data
            _d = {"user_uuid": _user_uuid, "createtime": _data["createtime"]}
            _l.append(_d)

        _sl = sorted(_l, key=itemgetter("createtime"), reverse=True)
        return _sl

    def _any_service_user_online(self, _users):
        for _i in _users:
            _user_uuid = _i["user_uuid"]
            if _user_uuid not in self._users_hash:
                _user = redis_hash_to_dict(self._redis, DeviceUser, _user_uuid)
                if _user == None:
                    logging.error("no such user in cache: %s" % _user_uuid)
                    continue
                self._users_hash[_user_uuid] = _user
            _user = self._users_hash[_user_uuid]
            _device_name = ["mobile_device_uuid", "browser_device_uuid"]
            for _i in _device_name:
                _device_uuid = _user.get(_i)
                if _device_uuid == None:
                    continue
                
                _key = DeviceInfo.__tablename__ + ".uuid." + _device_uuid
                _d = self._redis.hget(_key, "device_is_online")
                if _d != None and _d == "True":
                    return _user_uuid
        return None
    
    @classmethod
    def _search_best_with_group(cls, _app_uuid, _group_uuid, _redis):
        if _group_uuid == None or _app_uuid == None:
            return None

        _group = redis_hash_to_dict(_redis, OrgGroup, _group_uuid)
        if _group == None:
            logging.error("no group in cache:%s" % _group_uuid)
            return None
        
        _cls = AbstractAlgorithm.get_algorithm_cls_by_name(_group["group_route_algorithm"])
        _best = _cls.best(_app_uuid, _group_uuid, _redis)
        return _best

    def _create_new_conversation(self, _users):
        """
        if portal user try send message to a new service
        """
        _app_uuid = self._task["app_uuid"]
        _conversation_uuid = self._task["conversation_uuid"]
        
        for _user_uuid in _users:
            _row = ConversationUserData(uuid=str(uuid.uuid1),
                                        app_uuid=_app_uuid,
                                        conversation_uuid=_conversation_uuid,
                                        user_uuid=_user_uuid)
            _row.async_add()
            _row.create_redis_keys(self._redis)
        return

    def users(self):
        super(GroupPolicy, self).users()
        return

    @classmethod
    def get_service_care_users(cls, _app_uuid, _user_uuid, _redis):
        _a_users = []
        _key = OrgUserGroupData.__tablename__ + ".user_uuid." + _user_uuid
        _group_uuid = _redis.get(_key)
        if _group_uuid != None:
            _key = OrgUserGroupData.__tablename__ + ".group_uuid." + _group_uuid
            _a_users = list(_redis.smembers(_key))
        _b_users = AbstractPolicy.app_users(_app_uuid, False, _redis)    
        return _a_users + _b_users

    @classmethod
    def get_portal_care_users(cls, _app_uuid, _user_uuid, _redis):
        _a_users = AbstractPolicy.app_users(_app_uuid, True, _redis)        
        return _a_users


