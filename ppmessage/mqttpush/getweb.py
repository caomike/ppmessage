# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

from mdm.core.srv.basehandler import BaseHandler
from mdm.core.constant import MQTTPUSH_SRV

def getWeb():
    handler_list = [
        (r"/"+MQTTPUSH_SRV.PUSH, BaseHandler)
    ]
    return handler_list


