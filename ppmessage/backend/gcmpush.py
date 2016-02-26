# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# backend/gcmpush.py 
# The entry form gcmpush service
#
#


from ppmessage.core.srv.srvapp import SrvApp
from ppmessage.core.srv.backendio import BackendIO

from ppmessage.core.constant import GCMPUSH_PORT

from ppmessage.gcmpush.getthread import getThread
from ppmessage.gcmpush.getweb import getWeb

import tornado.httpserver
import tornado.ioloop
import tornado.options

import datetime
import logging

tornado.options.define("port", default=GCMPUSH_PORT, help="", type=int)  

class GcmPushApp(SrvApp):
    def __init__(self, *args, **kwargs):
        super(GcmPushApp, self).__init__(*args, **kwargs)
        self._gcm_client = None
        return
        
    def hasCallback(self):
        """
        callback will run when loop check
        """    
        return True

    def outdate(self):
        _delta = datetime.timedelta(seconds=30)
        if self._gcm_client == None:
            return
        self._gcm_client.outdate(_delta)
        return

if __name__ == "__main__":
    tornado.options.parse_command_line()
    _app = GcmPushApp(getWeb())
    _io = BackendIO(getThread(), _app)
    _http_server = tornado.httpserver.HTTPServer(_app)
    _http_server.listen(tornado.options.options.port)
    logging.info("Starting gcmpush service......%d" % GCMPUSH_PORT)
    # set the periodic check outdated connection
    tornado.ioloop.PeriodicCallback(_app.outdate, 1000*30).start()
    tornado.ioloop.IOLoop.instance().start()
    
