# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# backend/cache.py 
# The entry form cache service
#
#

from mdm.core.constant import CACHE_PORT

from mdm.core.srv.srvapp import SrvApp
from mdm.core.srv.backendio import BackendIO

from mdm.cache.getweb import getWeb
from mdm.cache.getthread import getThread

import tornado.httpserver
import tornado.ioloop
import tornado.options
import logging

tornado.options.define("port", default=CACHE_PORT, help="", type=int)  

if __name__ == "__main__":

    tornado.options.parse_command_line()
    _app = SrvApp(getWeb())
    _io = BackendIO(getThread(), _app)
    _http_server = tornado.httpserver.HTTPServer(_app)
    _http_server.listen(tornado.options.options.port)
    tornado.ioloop.PeriodicCallback(_io.loop, 1000).start()
    logging.info("Starting cache service......")
    tornado.ioloop.IOLoop.instance().start()
