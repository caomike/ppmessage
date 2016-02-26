# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

from .createhandler import CreateHandler
from .updatehandler import UpdateHandler
from .deletehandler import DeleteHandler

def getThread():
    _handler_list = [
        ("/ADD", CreateHandler),
        ("/DELETE", DeleteHandler),
        ("/UPDATE", UpdateHandler)]
    
    return _handler_list


