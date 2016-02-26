# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

from mdm.core.constant import REDIS_HOST
from mdm.core.constant import REDIS_PORT
from mdm.core.constant import IOSPUSH_SRV

from mdm.core.srv.basehandler import BaseHandler

from tornado.web import Application

from Queue import Queue
import datetime
import logging
import redis

class IOSPushApp(Application):
    
    def hasCallback(self):
        return True

    def __init__(self):
        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
        self.apns = {}
        
        settings = {}
        settings["debug"] = True
        handlers = []
        handlers.append(("/"+IOSPUSH_SRV.PUSH, BaseHandler))
        Application.__init__(self, handlers, **settings)
        return

    def outdate(self):
        """
        every 5 five minutes check what connection
        is unused in 5 five minutes
        """        
        _delta = datetime.timedelta(minutes=5)
        for _i in self.apns:
            if self.apns[_i] == None: 
                continue
            if self.apns[_i].apns_session == None:
                continue
            self.apns[_i].apns_session.outdate(_delta)
        return
    
#    def apns_feedback(self):
#        _apns = get_apns(self)
#        _apns.feedback()
#        return
