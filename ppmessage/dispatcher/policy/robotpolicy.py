# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# Guijin Ding, dingguijin@gmail.com
#
#

from .policy import AbstractPolicy
from .algorithm import RobotAppAlgorithm

from mdm.core.constant import APP_POLICY

import random

class RobotPolicy(AbstractPolicy):
    def __init__(self, dis):
        super(RobotPolicy, self).__init__(dis)
        self._name = APP_POLICY.ROBOT
        return

    @classmethod
    def name(cls):
        return APP_POLICY.ROBOT

    @classmethod
    def fallback_users(cls, _group_uuid, _redis):
        _key = AppUserData.__tablename__ + ".app_uuid." + ".is_service_user.True.is_distributor_user.True"
        _users = _redis.smembers(_key)
        if len(_users) > 0:
            return _users[0]
        _key = AppUserData.__tablename__ + ".app_uuid." + ".is_service_user.True"
        _users = _redis.smembers(_key)
        _count = len(_users)
        if _count > 0:
            return _users[random.randint(0, _count - 1)]
        return None

    @classmethod
    def _search_best_with_app(cls, _app_uuid, _redis):
        _users = AbstractPolicy.distributor_users(_app_uuid, _redis)
        return RobotAppAlgorithm._best(_users, _redis)

    @classmethod
    def create_conversation_users(cls, _app_uuid, _group_uuid, _redis):
        _users = cls._search_best_with_app(_app_uuid, _redis)
        if _users == None or len(_users) == 0:
            _users = cls.fallback_users(_app_uuid, _redis)
        return _users
    
    def users(self):
        super(RobotPolicy, self).users()
        return

    @classmethod
    def get_service_care_users(cls, _app_uuid, _user_uuid, _redis):
        _a_users = AbstractPolicy.app_users(_app_uuid, True, _redis)
        _b_users = AbstractPolicy.app_users(_app_uuid, False, _redis)
        return _a_users + _b_users

    @classmethod
    def get_portal_care_users(cls, _app_uuid, _user_uuid, _redis):
        _a_users = AbstractPolicy.app_users(_app_uuid, True, _redis)
        return _a_users

