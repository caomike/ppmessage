# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# backend/dispatcher.py 
# The entry form Dispatcher service
#
#


from ppmessage.dispatcher.getthread import getThread
from ppmessage.dispatcher.getweb import getWeb

from ppmessage.core.srv.srvapp import SrvApp
from ppmessage.core.srv.backendio import BackendIO

from ppmessage.core.constant import DIS_PORT

import tornado.httpserver
import tornado.ioloop
import tornado.options

import datetime
import logging

tornado.options.define("port", default=DIS_PORT, help="", type=int)  

class DisApp(SrvApp):
    def hasCallback(self):
        return True

if __name__ == "__main__":
    import sys
    reload(sys)
    sys.setdefaultencoding('utf8')

    tornado.options.parse_command_line()
            
    _app = DisApp(getWeb())
    _backend = BackendIO(getThread(), _app)

    _http_server = tornado.httpserver.HTTPServer(_app)
    _http_server.listen(tornado.options.options.port)

    logging.info("Starting dis service......")

    # check dispatcher every 5 minutes
    # tornado.ioloop.PeriodicCallback(_app.every_five_minutes, 1000*60*5).start()
    # tornado.ioloop.PeriodicCallback(_backend.loop, 100).start()
    tornado.ioloop.IOLoop.instance().start()
    
