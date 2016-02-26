# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

# apiauth/authhandler.py

from ppmessage.db.models import ApiInfo
from ppmessage.db.models import ApiTokenData

from tornado.web import RequestHandler

import uuid
import json
import base64
import hashlib
import logging
import datetime


class AuthHandler(RequestHandler):
    """
    A typical auth request with authorization code mode
    
    /auth?redirect_uri=xxx&client_id=xxx&state=xxx&response_type=xxx&scope=xxx
    
    response_type, for authorization code mode, it is "code", for implicit mode is "token"
    PPMessage support code only.

    client_id, is api_key, ppcom api_key, ppkefu api_key, ppconsole api_key, third_party_ppkefu, third_party_ppconsole
    
    redirect_uri, for ppcom, ignore it, because there is no interactive process
    """
    def _header(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.set_header("Access-Control-Allow-Headers", "Content-Type")
        self.set_header("Access-Control-Max-Age", "1728000")
        
    # overwrite tornado
    def options(self):
        self._header()
        return

    def post(self, *args, **kwargs):
        self.send_error(404)
        return
    
    def get(self, *args, **kwargs):
        _fields = ["client_id", "redirect_uri", "state", "scope", "response_type"]
        _request_dict = {}
        for _field in _fields:
            _request_dict[_field] = self.get_query_argument(_field, default=None)

        if _request_dict.get("response_type") != "code":
            logging.error("response_type not code")
            self.send_error(501)
            return

        if _request_dict.get("client_id") == None:
            logging.error("no client_id")
            self.send_error(400)
            return

        _redis = self.application.redis
        _key = ApiInfo.__tablename__ + ".api_key." + _request_dict.get("client_id")
        _api = _redis.get(_key)
        if _api == None:
            logging.error("no api_key:%s" % _request_dict.get("client_id"))
            self.send_error(404)
            return

        _api = json.loads(_api)
        _app_uuid = _api[0]
        _api_uuid = _api[1]
        _api_level = _api[2]

        _api_code = str(uuid.uuid1())
        _api_code = hashlib.sha1(_api_code).hexdigest()
        _api_code = base64.b64encode(_api_code)

        _api_token = str(uuid.uuid1())
        _api_token = hashlib.sha1(_api_token).hexdigest()
        _api_token = base64.b64encode(_api_token)
        
        _row = ApiTokenData(uuid=str(uuid.uuid1()), api_code=_api_code, api_token=_api_token,
                            app_uuid=_app_uuid, api_uuid=_api_uuid, api_level=_api_level)
        _row.async_add()
        _row.create_redis_keys(_redis)

        if _request_dict.get("redirect_uri") != None:
            # FIXME: add task to handle the request
            # generate a login html and set callback
            self.send_error(500)
            return

        if _request_dict.get("redirect_uri") == None:
            self.set_header("Content-Type", "application/json")
            self._header()
            _return = {
                "state": _request_dict.get("state"),
                "code": _row.api_code,
            }
            self.write(json.dumps(_return))
            return
        
        return
