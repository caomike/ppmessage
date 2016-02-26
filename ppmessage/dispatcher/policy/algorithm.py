# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# Guijin Ding, dingguijin@gmail.com
#
#

from mdm.db.models import DeviceUser
from mdm.db.models import DeviceInfo
from mdm.db.models import OrgUserGroupData
from mdm.db.models import MessagePushTask

from mdm.core.constant import GROUP_ALGORITHM

import random

_algorithm_registry = {}

class AlgorithmMeta(type):
    def __init__(cls, name, bases, dict_):
        _algorithm_registry[name] = cls
        type.__init__(cls, name, bases, dict_)
        return

    @classmethod
    def name(cls):
        return GROUP_ALGORITHM.META


Algorithm = AlgorithmMeta("Algorithm", (object,), {})

class AbstractAlgorithm(Algorithm):
    def __init__(self):    
        return

    @classmethod
    def get_algorithm_cls_by_name(cls, _name):
        _p = BroadcastAlgorithm
        
        if _name == None:
            return _p
        
        for i in _algorithm_registry:
            if _algorithm_registry[i].name() == _name:
                _p = _algorithm_registry[i]
                break
        return _p
    
    @classmethod
    def name(cls):
        return GROUP_ALGORITHM.ABASTRACT

    @classmethod
    def best(cls, _app_uuid, _group_uuid, _redis):
        return []

    @classmethod
    def is_online(cls, _user_uuid, _redis):
        _key = DeviceUser.__tablename__ + ".uuid." + _user_uuid
        _device_name = ["mobile_device_uuid", "browser_device_uuid"]
        for _i in _device_name:
            _d = _redis.hget(_key, _i)
            if _d == None:
                continue
            _d_key = DeviceInfo.__tablename__ + ".uuid." + _d
            _is = _redis.hget(_d_key, "device_is_online")
            if _is == "True":
                return True
        return False
    
    @classmethod
    def active_time(cls, _user_uuid, _redis):
        _key = DeviceUser.__tablename__ + ".uuid." + _user_uuid
        return _redis.hget(_key, "latest_send_message_time")

    @classmethod
    def today_message_load(cls, _user_uuid, _redis):
        _key = MessagePushTask.__tablename__ + \
               ".today_message_load." + \
               ".from_uuid." + _user_uuid
        _load = _redis.get(_key)
        return int(_load)

    @classmethod
    def today_customer_load(cls, _user_uuid, _redis):
        _key = MessagePushTask.__tablename__ + \
               ".today_customer_load." + \
               ".from_uuid." + _user_uuid
        _load = _redis.smembers(_key)
        return len(_load)

class BroadcastAlgorithm(AbstractAlgorithm):
    @classmethod
    def name(cls):
        return GROUP_ALGORITHM.BROADCAST
    
    @classmethod
    def best(cls, _app_uuid, _group_uuid, _redis):
        _key = OrgUserGroupData.__tablename__ + \
                   ".group_uuid." + _group_uuid
        _users = _redis.smembers(_key)
        return _users

class SmartAlgorithm(AbstractAlgorithm):
    @classmethod
    def name(cls):
        return GROUP_ALGORITHM.SMART
    
    @classmethod
    def best(cls, _app_uuid, _group_uuid, _redis):
        _key = OrgUserGroupData.__tablename__ + \
               ".group_uuid." + _group_uuid
        _users = _redis.smembers(_key)
        _l = []
        for _user_uuid in _users:
            if cls.is_service_user_online(_user_uuid):
                _l.append(_user_uuid)

        _min_load = 99999999999
        _user_uuid = None
        for _i in _l:
            _load = cls.today_customer_load(_i, _redis)
            if _load < _min_load:
                _min_load = _load
                _user_uuid = _i

        if _user_uuid != None:
            return [_user_uuid]        
        return []

class LoadAlgorithm(AbstractAlgorithm):
    """
    which algorith need every day reset the message_load
    """
    def __init__(self):
        return
    
    @classmethod
    def name(cls):
        return GROUP_ALGORITHM.LOAD

    @classmethod
    def best(cls, _app_uuid, _group_uuid, _redis):
        _key = OrgUserGroupData.__tablename__ + \
               ".group_uuid." + _group_uuid
        _users = _redis.smembers(_key)
        _l = []
        for _user_uuid in _users:
            if cls.is_service_user_online(_user_uuid):
                _l.append(_user_uuid)
        
        _min_load = 99999999999
        _user_uuid = None
        for _i in _l:
            _load = cls.today_message_load(_i, _redis)
            if _load < _min_load:
                _min_load = _load
                _user_uuid = _i

        if _user_uuid != None:
            return [_user_uuid]        
        return []


class SmartAppAlgorithm(AbstractAlgorithm):
    @classmethod
    def name(cls):
        return GROUP_ALGORITHM.SMART
    
    @classmethod
    def best(cls, _users, _redis):

        _online_users = []
        for _user_uuid in _users:
            if cls.is_service_user_online(_user_uuid):
                _online_users.append(_user_uuid)
        
        _min_load = 99999999999
        _is = None
        for _user_uuid in _online_users:
            _load = cls.today_customer_load(_user_uuid, _redis)
            if _load < _min_load:
                _min_load = _load
                _is = _user_uuid
        return _is


class RobotAppAlgorithm(AbstractAlgorithm):
    @classmethod
    def name(cls):
        return GROUP_ALGORITHM.ROBOT
    
    @classmethod
    def best(cls, _users, _redis):
        _online_users = []
        for _user_uuid in _users:
            if cls.is_service_user_online(_user_uuid):
                _online_users.append(_user_uuid)
        _c = len(_online_users)
        if _c > 0:
            return _online_users[random.randint(0, (_c-1))]
        return None

