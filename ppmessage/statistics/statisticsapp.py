# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage YVertical.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#


from mdm.core.constant import REDIS_HOST
from mdm.core.constant import REDIS_PORT

from tornado.web import Application

import time
import redis
import logging
import datetime

class StatisticsApp(Application):
    
    def __init__(self):
        settings = {}
        settings["debug"] = True
        handlers = []
        Application.__init__(self, handlers, **settings)

    def day_cleanup(self):
        _now = time.localtime()
        if _now.tm_hour > 2 and _now.tm_hour < 3:
            _redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
            _ps = [
                MessagePushTask.__tablename__ + ".today_customer_load.*",
                MessagePushTask.__tablename__ + ".today_message_load.*"
            ]
            for _p in _ps:
                _keys = _redis.keys(_p)
                for _key in _keys:
                    _redis.delete(_key)
        return
