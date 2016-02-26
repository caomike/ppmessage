# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

from .pushthreadhandler import PushThreadHandler

from ppmessage.core.constant import PCSOCKET_SRV

def getThread():
    _handler_list = [("/"+PCSOCKET_SRV.PUSH, PushThreadHandler)]
    return _handler_list
    


