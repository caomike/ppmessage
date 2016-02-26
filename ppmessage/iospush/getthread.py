# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

from .pushthreadhandler import PushThreadHandler
from mdm.core.constant import IOSPUSH_SRV

def getThread():
    _handler_list = [("/"+IOSPUSH_SRV.PUSH, PushThreadHandler)]
    return _handler_list
    


