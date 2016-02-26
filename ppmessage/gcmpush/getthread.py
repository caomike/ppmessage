# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

from .pushhandler import PushHandler
from ppmessage.core.constant import GCMPUSH_SRV

def getThread():
    _handler_list = [
        ("/"+GCMPUSH_SRV.PUSH, PushHandler),
    ]
    return _handler_list


