# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# @author kun.zhao@ppmessage.com
#
# PPConsole signup
#

from ppmessage.api.handlers.basehandler import BaseHandler

from ppmessage.core.constant import API_LEVEL
from ppmessage.core.constant import USER_STATUS
from ppmessage.api.error import API_ERR
from ppmessage.api.handlers.ppcreateuserhandler import create_user

import datetime
import uuid
import json
import logging

class PPConsoleSignupHandler(BaseHandler):

    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE_BEFORE_LOGIN)
        return

    def _signup(self, user_email, user_password, user_fullname, app_uuid):

        logging.info("signup with app_uuid: %s", app_uuid)
        
        redis = self.application.redis
        create_user_return_data = create_user(redis, {
            "user_email": user_email,
            "user_password": user_password,
            "user_fullname": user_fullname,
            "app_uuid": app_uuid,
            "is_service_user": False,
            "user_status": USER_STATUS.OWNER_0
        })

        self.getReturnData().update(create_user_return_data)
        return
        
    def _Task(self):
        super(PPConsoleSignupHandler, self)._Task()
        request = json.loads(self.request.body)
        user_email = request.get("user_email")
        user_fullname = request.get("user_fullname")
        user_password = request.get("user_password")
        app_uuid = request.get("app_uuid")
        
        if user_email is None or \
           user_password is None or \
           user_fullname is None or \
           app_uuid is None:
            self.setErrorCode(API_ERR.NO_PARA)
            return
        
        self._signup(user_email, user_password, user_fullname, app_uuid)
