# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage .
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

# ppconsole/server/uihandler.py

from mdm.core.constant import WEB_TITLE
from tornado.web import RequestHandler
import logging
import os

class UIHandler(RequestHandler):

    # ppcom library load from where
    def get(self, id=None):
        _dir = os.path.dirname(os.path.abspath(__file__))
        _html_path = _dir + os.path.sep + "html" + os.path.sep + "index.html"        
        _html_file = open(_html_path, "rb")
        _html = _html_file.read()
        _html_file.close()
        _html = _html.replace('WEB_ROLE', self.application.role)
        _html = _html.replace('WEB_TITLE', WEB_TITLE[self.application.role])        
        self.write(_html)
        self.finish()

