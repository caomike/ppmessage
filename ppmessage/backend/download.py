# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Yuan Wanshang, wanshang.yuan@yvertical.com
# Guijin Ding, dingguijin@gmail.com
#
# All rights reserved
#

from ppmessage.file.downloadapplication import DownloadApplication
from ppmessage.core.constant import FILEDOWNLOAD_PORT

import tornado.httpserver
import tornado.ioloop
import tornado.options

import logging

tornado.options.define("port", default=FILEDOWNLOAD_PORT, help="", type=int)

if __name__ == "__main__":
    tornado.options.parse_command_line()
    _app = DownloadApplication()
    http_server = tornado.httpserver.HTTPServer(_app)
    http_server.listen(tornado.options.options.port)
    logging.info("Starting Download servcie...")
    tornado.ioloop.IOLoop.instance().start()
