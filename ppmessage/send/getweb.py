# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 YVertical.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

from mdm.core.srv.basehandler import BaseHandler
from mdm.core.constant import SEND_SRV

def getWeb():
    handler_list = [
        (r"/"+SEND_SRV.SEND, BaseHandler)
    ]
    return handler_list


