# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# @author kun.zhao@ppmessage.com
#
# PPConsole signup
#

from ppmessage.api.handlers.basehandler import BaseHandler

from ppmessage.db.models import ApiInfo
from ppmessage.core.constant import API_LEVEL
from ppmessage.api.error import API_ERR
from ppmessage.api.handlers.ppcreateuserhandler import create_user

import datetime
import uuid
import base64
import hashlib
import json
import logging

def encode(_key):
    '''
    @see ppmessage/scripts/bootstrap.py _encode
    '''
    _key = hashlib.sha1(_key).hexdigest()
    _key = base64.b64encode(_key)
    return _key

class PPConsoleSignupHandler(BaseHandler):

    def initialize(self):
        self.addPermission(app_uuid=True)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE)
        self.addPermission(api_level=API_LEVEL.THIRD_PARTY_CONSOLE)
        self.addPermission(api_level=API_LEVEL.PPCONSOLE_BEFORE_LOGIN)
        return

    def _create_apiinfo(self, user_uuid, app_uuid, api_level):
        _redis = self.application.redis
        _row_data = {
            "createtime": datetime.datetime.now(),
            "updatetime": datetime.datetime.now(),
            "uuid": str(uuid.uuid1()),
            "user_uuid": user_uuid,
            "app_uuid": app_uuid,
            "api_level": api_level,
            "api_key": encode(str(uuid.uuid1())),
            "api_secret": encode(str(uuid.uuid1())),
        }
        _row = ApiInfo(**_row_data)
        _row.async_add()
        _row.create_redis_keys(_redis)

    def _create_kefu_client_apiinfo(self, user_uuid, app_uuid):
        '''
        create `PPKEFU` client apikey and apiSecret
        '''
        self._create_apiinfo(user_uuid, app_uuid, API_LEVEL.THIRD_PARTY_KEFU)

    def _create_console_client_apiinfo(self, user_uuid, app_uuid):
        '''
        create `PPCONSOLE` client apiKey and apiSecret
        '''
        self._create_apiinfo(user_uuid, app_uuid, API_LEVEL.THIRD_PARTY_CONSOLE)

    def _signup(self, user_email, user_password, user_fullname, app_uuid):

        logging.info("signup with app_uuid: %s", app_uuid)
        
        redis = self.application.redis
        create_user_return_data = create_user(redis, {
            "user_email": user_email,
            "user_password": user_password,
            "user_fullname": user_fullname,
            "app_uuid": app_uuid,
            "is_service_user": False,
            "user_status": "OWNER_0"
        })

        self.getReturnData().update(create_user_return_data)

        # create user error
        if create_user_return_data["error_code"] != API_ERR.NO_ERR:
            return

        # create api_info
        user_uuid = create_user_return_data["uuid"]
        self._create_kefu_client_apiinfo(user_uuid, app_uuid)
        self._create_console_client_apiinfo(user_uuid, app_uuid)
        
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
