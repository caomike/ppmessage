# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

from ppmessage.api.apiapp import APIApp
from ppmessage.core.constant import API_PORT

import tornado.httpserver
import tornado.ioloop
import tornado.options
import logging

tornado.options.define("port", default=API_PORT, help="", type=int)  

if __name__ == "__main__":
    import sys
    reload(sys)
    sys.setdefaultencoding('utf8')

    tornado.options.parse_command_line()
    _app = APIApp()
    _http_server = tornado.httpserver.HTTPServer(_app)
    _http_server.listen(tornado.options.options.port)
    logging.info("Starting API servcie.")
    tornado.ioloop.IOLoop.instance().start()


