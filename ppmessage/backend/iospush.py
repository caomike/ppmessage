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


from ppmessage.iospush.iospushapp import IOSPushApp
from ppmessage.iospush.getthread import getThread

from ppmessage.core.srv.backendio import BackendIO
from ppmessage.core.constant import IOSPUSH_PORT

from ppmessage.bootstrap.data import BOOTSTRAP_DATA

import tornado.httpserver
import tornado.ioloop
import tornado.options

import logging

tornado.options.define("port", default=IOSPUSH_PORT, help="", type=int)  

if __name__ == "__main__":

    tornado.options.parse_command_line()

    _config = BOOTSTRAP_DATA.get("apns")
    _name = _config.get("name")
    _dev = _config.get("dev")
    _pro = _config.get("pro")

    if _name == None or len(_name) == 0 or _dev == None or len(_dev) == 0 or _pro == None or len(_pro) == 0:
        logging.info("apns not config, iospush can not start")
        return
    
    _app = IOSPushApp()
    _io = BackendIO(getThread(), _app)
    _http_server = tornado.httpserver.HTTPServer(_app)
    _http_server.listen(tornado.options.options.port)

    # set the periodic check outdated connection
    tornado.ioloop.PeriodicCallback(_app.outdate, 1000*60*5).start()
    logging.info("IOSPush service starting...")
    tornado.ioloop.IOLoop.instance().start()
    
