# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

# apiauth/tokenhandler.py
from ppmessage.db.models import ApiInfo
from ppmessage.db.models import DeviceUser
from ppmessage.db.models import ApiTokenData

from ppmessage.core.constant import API_LEVEL

from tornado.web import RequestHandler

import json
import uuid
import base64
import hashlib
import logging
import datetime

class TokenHandler(RequestHandler):
    """
    Get access token with code
    For ppcom, no intercation process, so if code, then token
    For ppkefu, code with user login success the token would be valid
    For ppconsole, code with user login success the token would be valid
    For ppconsole no login, code without user login the token would be valid
    
    For third party ppkefu, code with user login success, the token would be valid
    For third party console, code valid, token valid

    token request must via POST
    the body:
    code=xxx&redirect_uri=xxx&client_id=xxx&client_secret=xxx&grant_type=xxx

    code, from auth request
    client_id, client_secret is api_key and api_secret
    grant_type, for ppcom and third party console "client_credentials" 
                so that no needs to check code authorized by user intercation process
                for ppkefu, ppconsole, third party ppkefu, "authorization_code" which needs the code is authorized by user.

    """    
    def _header(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.set_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.set_header("Access-Control-Max-Age", "1728000")

    def _write_error(self):
        self.set_header("Content-Type", "application/json")
        self._header()
        _return = {
            "error_code": -1,
        }
        self.write(json.dumps(_return))
        return
        
    def _client_credentials(self, _request):
        _api_key = _request.get("client_id")
        _api_secret = _request.get("client_secret")
        _redis = self.application.redis
        _key = ApiInfo.__tablename__ + ".api_key." + _api_key
        _api = _redis.get(_key)
        if _api == None:
            logging.error("no api_key:%s" % _api_key)
            self.send_error(400)
            return

        _api = json.loads(_api)
        _app_uuid = _api[0]
        _api_uuid = _api[1]
        _api_level = _api[2]
        # _api[3] is api_secret

        if _api_level != API_LEVEL.PPCOM and _api_level != API_LEVEL.PPCONSOLE and _api_level != API_LEVEL.THIRD_PARTY_CONSOLE:
            self.send_error(400)
            return
        
        if _api_level == API_LEVEL.PPCONSOLE:
            _api_level = API_LEVEL.PPCONSOLE_BEFORE_LOGIN

        if _api_secret != _api[3]:
            logging.error("client_secret not match client_id:%s, client_secret:%s, api_scecret:%s" % (_api_key, _api_secret, _api[3]))
            self.send_error(400)
            return

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

        self.set_header("Content-Type", "application/json")
        self._header()
        _return = {
            "access_token": _api_token,
            "token_type": "Bearer",
        }
        self.write(json.dumps(_return))
        return

    def _password(self, _request):
        _api_key = _request.get("client_id")
        _user_email = _request.get("user_email")
        _user_password = _request.get("user_password")

        _redis = self.application.redis
        _key = ApiInfo.__tablename__ + ".api_key." + _api_key
        _api = _redis.get(_key)
        if _api == None:
            logging.error("no api_key:%s" % _api_key)
            self._write_error()
            return

        _api = json.loads(_api)
        _app_uuid = _api[0]
        _api_uuid = _api[1]
        _api_level = _api[2]
        # _api[3] is api_secret

        if _api_level != API_LEVEL.PPKEFU and _api_level != API_LEVEL.PPCONSOLE:
            logging.error("only PPKEFU / PPCONSOLE use password mode")
            self._write_error()
            return

        _key = DeviceUser.__tablename__ + ".user_email." + _user_email
        _user_uuid = _redis.get(_key)
        if _user_uuid == None:
            logging.error("no such user %s" % _user_email)
            self._write_error()
            return

        _key = DeviceUser.__tablename__ + ".uuid." + _user_uuid
        _password = _redis.hget(_key, "user_password")
        if _user_password != _password:
            logging.error("password not match in:%s, real:%s" % (_user_password, _password))
            self._write_error()
            return

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

        self.set_header("Content-Type", "application/json")
        self._header()
        _return = {
            "error_code": 0,
            "access_token": _api_token,
            "user_uuid": _user_uuid,
            "token_type": "Bearer",
        }
        self.write(json.dumps(_return))
        return

    def _authorization_code(self, _request_dict):
        _redis = self.application.redis
        _key = ApiTokenData.__tablename__ + ".api_code." + _request_dict.get("code")
        _data = _redis.get(_key)
        if _data == None:
            self.send_error(400)
            return
        _data = json.loads(_data)
        _api_uuid = _data[0]
        _api_data = _data[1]

        _key = ApiInfo.__tablename__ + ".uuid." + _api_uuid
        _api = _redis.hmget(_key, ["api_key", "api_secret", "api_level"])
        if _api == [None] * 3:
            self.send_error(400)
            return
        if _api[0] != _request_dict["client_id"] or _api[1] != _request_dict["client_secret"]:
            self.send_error(400)
            return

        _key = ApiTokenData.__tablename__ + ".uuid." + _api_data
        _token_data = _redis.hmget(_key, ["api_token", "api_code", "is_code_authorized"])
        if _token_data == [None] * 3:
            self.send_error(400)
            return
        if _token_data[1] != _request_dict["code"]:
            self.send_error(400)
            return

        if _request_dict["grant_type"] == "authorization_code":
            if _api[2] != API_LEVEL.PPKEFU and _api[2] != API_LEVEL.THIRD_PARTY_KEFU and \
               _api[2] != API_LEVEL.PPCONSOLE and _api[2] != API_LEVEL.THIRD_PARTY_CONSOLE:
                self.send_error(400)
                return
            if _token_data[2] != "True":
                self.send_error(400)
                return

        if _request_dict.get("redirect_uri") != None:
            # start task to handle http request
            self.set_header("Content-Type", "application/json")
            self._header()
            _return = {
                "access_token": _token_data[0],
                "token_type": "Bearer",
                "exipired_in": 3600*24
            }
            self.write(json.dumps(_return))
            return

        if _request_dict.get("redirect_uri") == None:
            self.set_header("Content-Type", "application/json")
            self._header()
            _return = {
                "access_token": _token_data[0],
                "token_type": "Bearer",
                "exipired_in": 3600*24
            }
            self.write(json.dumps(_return))
            return        
        return

        
    # overwrite tornado
    def options(self):
        self._header()
        return

    def post(self, *args, **kwargs):
        logging.info(self.request.body)
        
        _fields = ["code", "client_id", "client_secret", "redirect_uri", "grant_type", "user_email", "user_password"]
        _request_dict = {}
        for _field in _fields:
            _request_dict[_field] = self.get_body_argument(_field, default=None)

        if _request_dict.get("grant_type") == None:
            self.send_error(400)
            return

        if _request_dict["grant_type"] == "client_credentials":
            return self._client_credentials(_request_dict)

        if _request_dict["grant_type"] == "password":
            return self._password(_request_dict)
        
        if _request_dict["grant_type"] == "authorization_code":
            return self._authorization_code(_request_dict)

        logging.error("unknown grant_type: %s" % _request_dict.get("grant_type"))
        self.send_error(400)
        return
    
    def get(self, *args, **kwargs):
        self.send_error(500)
        return
