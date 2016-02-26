# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 YVertical.
# Guijin Ding, dingguijin@gmail.com
#
#

from mdm.pcsocket.error import DIS_ERR
from .proc import Proc
import logging

class SendHandler():
    
    def __init__(self, _app):
        self._app = _app
        self._redis = _app.redis
        return
    
    def task(self, _body):
        logging.info("recv %s" % _body)
        _proc = Proc(self._app)
        if not _proc.check(_body):
            _proc.ack(DIS_ERR.PARAM)
            return
        if not _proc.parse():
            _proc.ack(DIS_ERR.MESSAGE)
            return
        _proc.save()
        _proc.ack(DIS_ERR.NOERR)
        return

