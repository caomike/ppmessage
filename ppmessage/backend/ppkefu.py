# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
#

from ppmessage.ppkefu.ppkefu import PCApp
from ppmessage.core.constant import PCAPP_PORT

import tornado.httpserver
import tornado.ioloop
import tornado.options

import logging

tornado.options.define("port", default=PPKEFU_PORT, help="", type=int)

if __name__ == "__main__":
    tornado.options.parse_command_line()
    http_server = tornado.httpserver.HTTPServer(PCApp(), max_body_size=1024*1024*1024)
    http_server.listen(tornado.options.options.port)

    logging.info("Starting PPKEFU...")
    tornado.ioloop.IOLoop.instance().start()
