# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

from ppmessage.api.apiapp import APIApp
from ppmessage.core.constant import API_PORT

from geoip2 import database

import tornado.httpserver
import tornado.options
import tornado.ioloop

import os
import sys
import logging
import subprocess

tornado.options.define("port", default=API_PORT, help="", type=int)  

if __name__ == "__main__":
    import sys
    reload(sys)
    sys.setdefaultencoding('utf8')

    _api_path = os.path.dirname(os.path.abspath(__file__)) + os.path.sep + ".." + os.path.sep + "api"
    _mmdb = "GeoLite2-City.mmdb"
    _mmdb = _api_path + os.path.sep + "geolite2" + os.path.sep + _mmdb
    
    if not os.path.exists(_mmdb):
        logging.error("no geolite2 mmdb, run scripts/download_geolite2.sh to download.")
        sys.exit()
        
    tornado.options.parse_command_line()
    _app = APIApp()
    _app.geoip_reader = database.Reader(_mmdb)
        
    _http_server = tornado.httpserver.HTTPServer(_app)
    _http_server.listen(tornado.options.options.port)
    logging.info("Starting API servcie.")
    tornado.ioloop.IOLoop.instance().start()


