# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

from ppmessage.core.singleton import singleton
from handlers.getwebservicehandlers import getWebServiceHandlers

from ppmessage.core.constant import REDIS_HOST
from ppmessage.core.constant import REDIS_PORT

from tornado.web import Application

import redis
import os

@singleton
class APIApp(Application):
    
    def __init__(self):
        settings = {}
        settings["debug"] = True
        handlers = getWebServiceHandlers()
        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
        Application.__init__(self, handlers, **settings)
        
