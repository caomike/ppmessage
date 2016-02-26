# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage .
# Yuan Wanshang, wanshang.yuan@yvertical.com
# All rights reserved
#

from tornado.web import RequestHandler

import os
import logging

class MainHandler(RequestHandler):

    def get(self):
        _index = os.path.abspath(os.path.dirname(__file__)) + "/ppmessage-pc/www/index.html";
        with open(_index) as _file:
            _str = _file.read()
            logging.info(_str)
            self.write(_str)
        return

class CordovaHandler(RequestHandler):

    def get(self):
        self.write("// mocked cordova.js response to prevent 404 errors during development")
        return
