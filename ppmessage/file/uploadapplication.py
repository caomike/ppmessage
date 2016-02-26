# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

from mdm.core.singleton import singleton
from .getuploadhandlers import getUploadHandlers
from mdm.core.constant import REDIS_HOST
from mdm.core.constant import REDIS_PORT

from tornado.web import Application
import os

import redis

@singleton
class UploadApplication(Application):
    
    def __init__(self):
        settings = {}
        settings["debug"] = True
        handlers = []
        handlers.extend(getUploadHandlers())
        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)        
        Application.__init__(self, handlers, **settings)
    
