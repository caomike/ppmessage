# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# backend/pcsocket.py 
# The entry form pcsocket service
#
#


from mdm.iospush.iospushapp import IOSPushApp
from mdm.iospush.getthread import getThread

from mdm.core.srv.backendio import BackendIO
from mdm.core.constant import IOSPUSH_PORT

import tornado.httpserver
import tornado.ioloop
import tornado.options

import logging

tornado.options.define("port", default=IOSPUSH_PORT, help="", type=int)  

if __name__ == "__main__":

    tornado.options.parse_command_line()
    _app = IOSPushApp()
    _io = BackendIO(getThread(), _app)
    _http_server = tornado.httpserver.HTTPServer(_app)
    _http_server.listen(tornado.options.options.port)

    # set the periodic check outdated connection
    tornado.ioloop.PeriodicCallback(_app.outdate, 1000*60*5).start()
    logging.info("IOSPush service starting...")
    tornado.ioloop.IOLoop.instance().start()
    
