# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Yuan Wanshang, wanshang.yuan@yvertical.com
# Guijin Ding, dingguijin@gmail.com
#
# All rights reserved
#

from mdm.core.downloadhandler import DownloadHandler
from mdm.core.identiconhandler import IdenticonHandler
from mdm.core.constant import REDIS_HOST
from mdm.core.constant import REDIS_PORT

from tornado.web import Application

import redis

class DownloadApplication(Application):
    
    def __init__(self):
        settings = {}
        settings["debug"] = True
        handlers = []
        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
        DownloadHandler.set_cls_redis(self.redis)
        handlers.append(("/download/([^\/]+)?$", DownloadHandler, {"path": "/"}))
        handlers.append(("/identicon/([^\/]+)?$", IdenticonHandler, {"path": "/"}))
        Application.__init__(self, handlers, **settings)
    
