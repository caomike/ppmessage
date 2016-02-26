# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Yuan Wanshang, wanshang.yuan@yvertical.com
# All rights reserved
#


from ppmessage.core.downloadhandler import DownloadHandler

def getDownloadHandlers():
    handler_list = []
    handler_list.append(("/download/([^\/]+)?$", DownloadHandler, {"path": "/"}))
    return handler_list


