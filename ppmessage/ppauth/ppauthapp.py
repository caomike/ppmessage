#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
#
# ppauth/ppauthapp.py
#

from .authhandler import AuthHandler
from .tokenhandler import TokenHandler

from ppmessage.core.constant import REDIS_HOST
from ppmessage.core.constant import REDIS_PORT

from tornado.web import Application

import os
import redis

class PPAuthApp(Application):
    
    def __init__(self):
        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
        settings = {
            "debug": True,
        }
        handlers = [
            ("/auth/?.*", AuthHandler),
            ("/token/?.*", TokenHandler),
        ]
        Application.__init__(self, handlers, **settings)
    

