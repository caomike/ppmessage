#
# Copyright (C) 2010-2016 PPMessage .
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
#
# ppconsole/server/app.py 
#

from .uihandler import UIHandler

from mdm.core.iconfilehandler import IconFileHandler
from mdm.core.downloadhandler import DownloadHandler

from mdm.core.constant import REDIS_HOST
from mdm.core.constant import REDIS_PORT
from mdm.core.constant import GENERIC_FILE_STORAGE_DIR

from tornado.web import Application
from tornado.web import StaticFileHandler

import os
import redis

class App(Application):
    
    def __init__(self, role):
        self.role = role # role: 'admin', 'user'

        _dir = os.path.dirname(os.path.abspath(__file__))
        settings = {}
        settings["debug"] = True
        settings["static_path"] = _dir + os.path.sep + "/static"
        settings["cookie_secret"] = "24oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo="

        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
        DownloadHandler.set_cls_redis(self.redis)
        handlers = [
            ("/", UIHandler),
        ]
        Application.__init__(self, handlers, **settings)
    

