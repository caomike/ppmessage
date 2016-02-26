# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 YVertical.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

from .sendhandler import SendHandler

from ppmessage.core.constant import SEND_SRV

def getThread():
    _handler_list = [
        ("/"+SEND_SRV.SEND, SendHandler),
    ]
    return _handler_list


