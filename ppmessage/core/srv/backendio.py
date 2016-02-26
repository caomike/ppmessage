# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

from .getqueue import getQueue

import json

class BackendIO():

    def __init__(self, _handler, _app):
        self.queue = getQueue()
        self.handler = _handler
        self.app = _app
        self.app.backend = self

    def _get(self, _uri):
        for _i in self.handler:
            if _i[0] == _uri:
                return _i[1](self.app)            
        return None

    def loop(self):
        if self.queue.empty() == True:
            return
        _tuple = self.queue.get(False)
        if _tuple == None:
            return
        
        _h = self._get(_tuple[0])
        if _h != None:
            _h.task(json.loads(_tuple[1]))
        self.queue.task_done()

