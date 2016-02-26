# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
#

from ppmessage.core.constant import PPCOM_PORT
# from ppmessage.ppcom.jquery.backend.ppcomapp import PPLibrary
from ppmessage.ppcom.jquery.backend.ppcomapp import PPComApp

import tornado.httpserver
import tornado.ioloop
import tornado.options

import logging

tornado.options.define("port", default=PPCOM_PORT, help="", type=int)

if __name__ == "__main__":
    import sys
    reload(sys)
    sys.setdefaultencoding('utf-8')
    tornado.options.parse_command_line()

    _app = PPComApp()
    http_server = tornado.httpserver.HTTPServer(_app)

    logging.info("Starting PPCOM..")

    http_server.listen(tornado.options.options.port)
    loop = tornado.ioloop.IOLoop.instance()
    loop.start()

