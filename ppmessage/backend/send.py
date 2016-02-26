# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# backend/send.py 
# The entry form send service
#
#


from ppmessage.core.srv.srvapp import SrvApp
from ppmessage.core.srv.backendio import BackendIO

from ppmessage.core.constant import SEND_PORT

from ppmessage.send.getthread import getThread
from ppmessage.send.getweb import getWeb

import tornado.httpserver
import tornado.ioloop
import tornado.options
import logging

tornado.options.define("port", default=SEND_PORT, help="", type=int)  


class SendApp(SrvApp):
    """
    callback will run when loop check
    """
    def hasCallback(self):
        return True
    

if __name__ == "__main__":
    tornado.options.parse_command_line()
    _app = SendApp(getWeb())
    _io = BackendIO(getThread(), _app)
    _http_server = tornado.httpserver.HTTPServer(_app)
    _http_server.listen(tornado.options.options.port)
    logging.info("Starting send service......%d" % SEND_PORT)
    tornado.ioloop.IOLoop.instance().start()
    
