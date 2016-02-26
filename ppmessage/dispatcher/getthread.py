# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

from .task import TaskHandler
from mdm.core.constant import DIS_SRV

def getThread():
    _handler_list = [("/"+DIS_SRV.MESSAGE_DIS, TaskHandler)]
    return _handler_list
    


