# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
#

from ppmessage.core.constant import PPCONSOLE_PORT
from ppmessage.ppconsole.app import App

import tornado.httpserver
import tornado.ioloop
import tornado.options

import logging

tornado.options.define("port", default=PPCONSOLE_PORT, help="", type=int)

if __name__ == "__main__":
    import sys
    reload(sys)
    sys.setdefaultencoding('utf-8')
    tornado.options.parse_command_line()

    _app = App("user")
    http_server = tornado.httpserver.HTTPServer(_app)

    logging.info("Starting ppconsole of user... with port: %d" % tornado.options.options.port)

    http_server.listen(tornado.options.options.port)
    loop = tornado.ioloop.IOLoop.instance()
    loop.start()

