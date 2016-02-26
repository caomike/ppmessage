# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

from mdm.core.srv.basehandler import BaseHandler

def getWeb():
    handler_list = []

    handler_list.append((r"/ADD", BaseHandler))
    handler_list.append((r"/UPDATE", BaseHandler))
    handler_list.append((r"/DELETE", BaseHandler))

    return handler_list


