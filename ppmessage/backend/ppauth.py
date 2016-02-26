# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# backend/apiauth.py 
# The entry form auth service

"""
All api request need a token which got from ppauth service

"""

from ppmessage.core.constant import PPAUTH_PORT
from ppmessage.ppauth.ppauthapp import PPAuthApp

import tornado.ioloop
import tornado.options
import tornado.httpserver

import datetime
import logging

tornado.options.define("port", default=PPAUTH_PORT, help="", type=int)  
        
if __name__ == "__main__":
    tornado.options.parse_command_line()
    _app = PPAuthApp()
    _http_server = tornado.httpserver.HTTPServer(_app)
    _http_server.listen(tornado.options.options.port)
    logging.info("Starting ppauth service......%d" % tornado.options.options.port)
    tornado.ioloop.IOLoop.instance().start()
    
