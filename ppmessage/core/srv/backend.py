# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

from .getqueue import getQueue

import threading
import json

class Backend(threading.Thread):

    def __init__(self, _handler, _app):
        threading.Thread.__init__(self)
        self.setName(self.__class__.__name__)
        self.daemon = True
        self.queue = getQueue()
        self.handler = _handler
        self.app = _app

    def _get(self, _uri):
        for _i in self.handler:
            if _i[0] == _uri:
                return _i[1](self.app)
            
        return None

    def run(self):
        while True:
            _uri, _data = self.queue.get()
            _h = self._get(_uri)
            
            if _h is not None:
                _h.task(json.loads(_data))
            self.queue.task_done()

