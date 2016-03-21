# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#
from .basehandler import BaseHandler
from ppmessage.api.error import API_ERR
from ppmessage.send.proc import Proc
from ppmessage.core.constant import API_LEVEL

import logging

class PPSendMessageHandler(BaseHandler):

    """
    POST
    requst:
    header
    message {
    app_uuid:
    to_uuid:,
    to_type:,
    body:
    }

    response:
    nothing
    """

    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCOM)
        self.addPermission(api_level=API_LEVEL.PPKEFU)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_KEFU)
        return
    
    def _Task(self):
        super(PPSendMessageHandler, self)._Task()
        _proc = Proc(self.application)
        if not _proc.check(self.request.body):
            self.setErrorCode(API_ERR.NO_PARA)
            return
        if not _proc.parse():
            self.setErrorCode(API_ERR.MESSAGE)
            return
        _proc.save()
        return
