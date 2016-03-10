# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2015 YVertical.
# Ding Guijin, guijin.ding@yvertical.com
#

from ppmessage.core.constant import OS

from ppmessage.core.constant import PPMESSAGE_APP
from ppmessage.core.constant import DEV_MODE
from ppmessage.core.constant import CONVERSATION_TYPE

# from ppmessage.help.getipaddress import getIPAddress
from ppmessage.db.models import DeviceUser

from ppmessage.bootstrap.data import BOOTSTRAP_DATA

import tornado.httpclient
import uuid
import unittest
import traceback
import json
import redis
import hashlib
import logging

class TestApiCase(unittest.TestCase):
    def setUp(self):
        self._redis = redis.Redis(db=1)
        self._access_token = self._get_access_token()
        if self._access_token is None:
            raise ValueError, "token is None"
        return

    def tearDown(self):
        pass

    def _get_return(self, _name):
        if self._return_data == None:
            return None
        #print self._return_data
        return self._return_data.get(_name)
    
    def _prepare_login_signature(self, _uuid, _pass):
        _pass = hashlib.sha1(_pass).hexdigest()
        _sig = hashlib.sha1(_uuid + _pass).hexdigest();
        return _sig

    def _prepare_login_user_uuid(self, _email):
        _key = DeviceUser.__tablename__ + ".user_email." + _email
        _uuid = self._redis.get(_key)
        return _uuid

    def _create_body_string(self, params):
        body = ""
        for param in params:
            body += "&" + param + "=" + str(params[param])
        return body.lstrip("&")

    def _get_access_token(self):
        TOKEN_URI = "http://localhost:8080/ppauth/token"
        body = self._create_body_string({
            "grant_type": "client_credentials",
            "client_id": BOOTSTRAP_DATA["PPCOM"]["api_key"],
            "client_secret": BOOTSTRAP_DATA["PPCOM"]["api_secret"]
        })
        request = tornado.httpclient.HTTPRequest(TOKEN_URI, method="POST", body=body)
        client = tornado.httpclient.HTTPClient()
        response = client.fetch(request)
        res_body = json.loads(response.body)
        return res_body.get("access_token")
            
    def _prepare(self, _cmd):

        self._headers = {
            "Content-Type": "application/json",
            "Authorization": "OAuth " + self._access_token
        }

        _http = "https://"
        _host = "ppmessage.cn"
        _port = 80
        if DEV_MODE:
            # _host = getIPAddress()
            _host = "localhost"
            _http = "http://"
            _port = 8080

        self._url = _http + _host + ":" + str(_port) + "/api/" + _cmd
        return
    
    def _exec(self, _data):
        http_client = tornado.httpclient.HTTPClient()
        try:
            response = http_client.fetch(self._url,
                                         method="POST",
                                         headers=self._headers,
                                         body=json.dumps(_data))
            _r = json.loads(response.body)
            self._return_data = None
            if _r["error_code"] == 0:
                self._return_data = _r
            else:
                print _r
            self.assertEqual(_r["error_code"], 0)
            
        except tornado.httpclient.HTTPError as e:
            self.assertEqual(1, 0)
        finally:
            http_client.close()
        return
                                    
    def create_p2s_conversation(self):
        _api = "PP_CREATE_ANONYMOUS"
        _data = {
            "ppcom_trace_uuid": str(uuid.uuid1()),
            "app_uuid": BOOTSTRAP_DATA["team"]["app_uuid"]
        }
        self._prepare(_api)
        self._exec(_data)
        _user_uuid = self._get_return("user_uuid")

        _api = "PP_CREATE_CONVERSATION"
        _data = {
            "user_uuid": _user_uuid,
            "conversation_type": CONVERSATION_TYPE.P2S,
            "app_uuid": BOOTSTRAP_DATA["team"]["app_uuid"]
        }
        self._prepare(_api)
        self._exec(_data)
        _conversation_uuid = self._get_return("uuid")

        _api = "PP_SEND_MESSAGE"
        _data = {
            "uuid": str(uuid.uuid1()),
            "to_uuid": _conversation_uuid,
            "to_type": CONVERSATION_TYPE.P2S,
            "from_uuid": _user_uuid,
            "from_type": "DU",
            "conversation_uuid": _conversation_uuid,
            "conversation_type": CONVERSATION_TYPE.P2S,
            "app_uuid": BOOTSTRAP_DATA["team"]["app_uuid"],
            "device_uuid": str(uuid.uuid1()),
            "message_type": "NOTI",
            "message_subtype": "TEXT",
            "message_body": str(uuid.uuid1())
        }
        self._prepare(_api)
        self._exec(_data)
        return

    def test_create_massive_conversations(self):
        for i in range(30):
            self.create_p2s_conversation()
        
if __name__ == "__main__":
    unittest.main()

