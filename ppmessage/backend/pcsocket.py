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


from mdm.pcsocket.pcsocketapp import PCSocketApp
from mdm.pcsocket.getthread import getThread

from mdm.core.srv.backendio import BackendIO
from mdm.core.constant import PCSOCKET_PORT

import tornado.httpserver
import tornado.ioloop
import tornado.options

import logging

tornado.options.define("port", default=PCSOCKET_PORT, help="", type=int)  

if __name__ == "__main__":

    tornado.options.parse_command_line()
    _port = tornado.options.options.port
    _app = PCSocketApp()

    _app.register_service(str(_port))
    _io = BackendIO(getThread(), _app)
    
    _http_server = tornado.httpserver.HTTPServer(_app)
    _http_server.listen(_port)
    
    logging.info("Starting pcsocket service......")
    tornado.ioloop.IOLoop.instance().start()
    

