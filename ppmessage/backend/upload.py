# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# init/upload.py 
# The entry of upload file service
#
#

from ppmessage.file.uploadapplication import UploadApplication
from ppmessage.core.constant import FILEUPLOAD_PORT

import tornado.httpserver
import tornado.ioloop
import tornado.options

import logging

tornado.options.define("port", default=FILEUPLOAD_PORT, help="", type=int)  

if __name__ == "__main__":

    tornado.options.parse_command_line()

    _app = UploadApplication()
    _http_server = tornado.httpserver.HTTPServer(_app)
    logging.info("Starting Upload servcie.")
    _http_server.listen(tornado.options.options.port)
    loop = tornado.ioloop.IOLoop.instance()
    loop.start()


