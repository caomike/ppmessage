# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage .
# Yuan Wanshang, wanshang.yuan@yvertical.com
# Guijin Ding, dingguijin@gmail.com
#
# All rights reserved
#

from .mainhandler import MainHandler, CordovaHandler
from .uploadhandler import UploadHandler

from ppmessage.core.downloadhandler import DownloadHandler
from ppmessage.core.materialfilehandler import MaterialFileHandler

from ppmessage.core.constant import REDIS_HOST
from ppmessage.core.constant import REDIS_PORT

from ppmessage.bootstrap.data import BOOTSTRAP_DATA

from tornado.web import Application
from tornado.web import StaticFileHandler

import os
import redis

class PCApp(Application):
    
    def __init__(self):
       
        settings = {}
        settings["debug"] = True
        settings["cookie_secret"] = "PzEMu2OLSsKGTH2cnyizyK+ydP38CkX3rhbmGPqrfBs="

        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
        DownloadHandler.set_cls_redis(self.redis)
        _root = os.path.abspath(os.path.dirname(__file__)) + "/ppmessage-pc/www"

        _generic_store = BOOTSTRAP_DATA.get("server")
        _generic_store = _generic_store.get("generic_store")
        
        handlers = [
            (r"^/$", MainHandler),
            (r"^/cordova.js$", CordovaHandler),
            (r"/js/(.*)", StaticFileHandler, {"path": _root + "/js"}),
            (r"/build/(.*)", StaticFileHandler, {"path": _root + "/build"}),
            (r"/css/(.*)", StaticFileHandler, {"path": _root + "/css"}),
            (r"/templates/(.*)", StaticFileHandler, {"path": _root + "/templates"}),
            (r"/lib/(.*)", StaticFileHandler, {"path": _root + "/lib"}),
            (r"/img/(.*)", StaticFileHandler, {"path": _root + "/img"}),
            
            (r"/download/(.*)", DownloadHandler, {"path": "/"}),
            (r"/icon/([^\/]+)?$", StaticFileHandler, {"path": _generic_store + os.path.sep}),
            (r"/material/([^\/]+)?$", MaterialFileHandler, {"path": _generic_store + os.path.sep}),
            (r"/upload/(.*)", UploadHandler),
        ]

        Application.__init__(self, handlers, **settings)

