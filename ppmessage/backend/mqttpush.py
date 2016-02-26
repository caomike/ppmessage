# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# backend/mqttpush.py 
# The entry form mqttpush service
#
#


from mdm.core.srv.srvapp import SrvApp
from mdm.core.srv.backendio import BackendIO

from mdm.core.constant import MQTTPUSH_PORT

from mdm.mqttpush.getthread import getThread
from mdm.mqttpush.getweb import getWeb

import tornado.httpserver
import tornado.ioloop
import tornado.options

import datetime
import logging

tornado.options.define("port", default=MQTTPUSH_PORT, help="", type=int)  

class MqttPushApp(SrvApp):
    def __init__(self, *args, **kwargs):
        super(MqttPushApp, self).__init__(*args, **kwargs)
        self._mqtt_client = None
        return
        
    def hasCallback(self):
        """
        callback will run when loop check
        """    
        return True

    def outdate(self):
        _delta = datetime.timedelta(seconds=30)
        if self._mqtt_client == None:
            return
        self._mqtt_client.outdate(_delta)
        return

if __name__ == "__main__":
    tornado.options.parse_command_line()
    _app = MqttPushApp(getWeb())
    _io = BackendIO(getThread(), _app)
    _http_server = tornado.httpserver.HTTPServer(_app)
    _http_server.listen(tornado.options.options.port)
    logging.info("Starting mqttpush service......%d" % MQTTPUSH_PORT)
    # set the periodic check outdated connection
    tornado.ioloop.PeriodicCallback(_app.outdate, 1000*30).start()
    tornado.ioloop.IOLoop.instance().start()
    
