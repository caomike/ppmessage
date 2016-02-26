# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

# mdm/dispatcher/webservicebasehandler.py


from .getqueue import getQueue

from tornado.web import RequestHandler
from tornado.web import asynchronous
from tornado.ioloop import IOLoop

import copy
import json

class BaseHandler(RequestHandler):

    def _Before(self):
        return

    def _hasThread(self):
        return True
    
    def post(self):
        self._return = {}
        
        if not self._JSON():
            self._writeErrorJSON()
            self.finish()
            return

        if self._hasThread():
            queue = getQueue()
            queue.put((copy.deepcopy(self.request.uri), copy.deepcopy(self.request.body)))
            
        if self.application.hasCallback():
            IOLoop.instance().add_callback(self.application.backend.loop)
            
        self._Before()
        self._writeSuccessJSON()
        self.finish()
        return
            
    def _JSON(self):
        _content_type = self.request.headers.get("Content-Type")
        if _content_type and (_content_type.lower() == "application/json"):
            return True
        return False

    def _writeErrorJSON(self):
        self._return["error_code"] = -1
        self._return["error_string"] = "fail."
        self.write(json.dumps(self._return))
        return
    
    def _writeSuccessJSON(self):
        self._return["error_code"] = 0
        self.write(json.dumps(self._return))
        return
    
    def getReturnData(self):
        return self._return

