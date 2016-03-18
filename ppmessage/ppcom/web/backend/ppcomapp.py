# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage .
# Guijin Ding, dingguijin@gmail.com
#
#

import tornado.web

import logging
import base64
import json
import os
import urllib

class EnterpriseHandler(tornado.web.RequestHandler):
    def get(self, enterprise_string):
        _enterprise = base64.b64decode(enterprise_string)
        _enterprise = json.loads(_enterprise)
        logging.info('enterprise html preview %s', _enterprise)
        _enterprise["app_uuid"] = _enterprise["uuid"]
        _enterprise["app_name"] = urllib.unquote(str(_enterprise["app_name"]))
        self.render("enterprise.html", **_enterprise)
        return

class PPComApp(tornado.web.Application):
    
    def __init__(self):
        settings = {}
        settings["debug"] = True
        settings["cookie_secret"] = "24oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo="
        settings["template_path"]= os.path.join(os.path.dirname(__file__), "../assets/templates")
        _a_settings = {
            "path": os.path.join(os.path.dirname(__file__), "../assets"),
        }
        
        handlers=[
            (r"/enterprise/(.*)", EnterpriseHandler),
            (r"/assets/(.*)", tornado.web.StaticFileHandler, _a_settings),
        ]
        tornado.web.Application.__init__(self, handlers, **settings)
    
