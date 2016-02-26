# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# 
#

from ppmessage.core.singleton import singleton
from Queue import Queue

@singleton
class BackendQueue(Queue):
    pass

def getQueue():
    return BackendQueue()
    
