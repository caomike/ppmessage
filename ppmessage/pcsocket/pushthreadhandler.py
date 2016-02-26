# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

import logging
import json

class PushThreadHandler():

    def __init__(self, _app):
        self.application = _app

    def task(self, _data):
        _hash = self.application.ws_hash
        _body = _data.get("body")        
        if _body == None:
            logging.error("no body in push: %s" % (_data))
            return
        _pcsocket = _data.get("pcsocket") 
        if _pcsocket == None:
            logging.error("no pcsocket in push: %s" % (_data))
            return
        _device_uuid = _pcsocket.get("device_uuid")
        _ws = _hash.get(_device_uuid)
        if _ws == None:
            logging.error("no ws <-> device:%s" % _device_uuid)
            return
        _ws.send_msg(_body)
        return

