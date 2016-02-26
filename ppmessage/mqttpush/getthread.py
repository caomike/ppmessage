# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

from .pushhandler import PushHandler
from mdm.core.constant import MQTTPUSH_SRV

def getThread():
    _handler_list = [
        ("/"+MQTTPUSH_SRV.PUSH, PushHandler),
    ]
    return _handler_list


