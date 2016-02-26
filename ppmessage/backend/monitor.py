# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# backend/monitor.py 
# The entry form monitor service
#
#

from mdm.monitor.monitorapp import MonitorApp
from mdm.core.constant import MONITOR_PORT

import tornado.httpserver
import tornado.ioloop
import tornado.options
import logging

tornado.options.define("port", default=MONITOR_PORT, help="", type=int)  

if __name__ == "__main__":
    tornado.options.parse_command_line()
    _app = MonitorApp()
    _http_server = tornado.httpserver.HTTPServer(_app)
    _http_server.listen(tornado.options.options.port)
    tornado.ioloop.PeriodicCallback(_app.every_twenty_seconds, 1000*20).start()
    logging.info("Starting monitor service......")
    tornado.ioloop.IOLoop.instance().start()
    
