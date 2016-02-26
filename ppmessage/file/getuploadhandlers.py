# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#


from .uploadfilehandler import UploadFileHandler

def getUploadHandlers():
    handler_list = []
    handler_list.append((r"/upload", UploadFileHandler))
    return handler_list

