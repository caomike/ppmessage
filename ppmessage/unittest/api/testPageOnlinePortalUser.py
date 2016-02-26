# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2015 YVertical.
# Ding Guijin, guijin.ding@yvertical.com
#

from mdm.core.constant import OS

from mdm.core.constant import CONVERSATION_TYPE
from mdm.core.constant import PPMESSAGE_APP
from mdm.core.constant import DEV_MODE

from mdm.help.getipaddress import getIPAddress
from mdm.db.models import DeviceUser

import tornado.httpclient
import uuid
import unittest
import traceback
import json
import uuid
import redis
import hashlib

class TestPageHistoryMessageCase(unittest.TestCase):
    def setUp(self):
        self._redis = redis.Redis(db=1)
        return

    def tearDown(self):
        pass

    def _get_return(self, _name):
        if self._return_data == None:
            return None
        return self._return_data.get(_name)
    
    def _prepare_login_signature(self, _uuid, _pass):
        _pass = hashlib.sha1(_pass).hexdigest()
        _sig = hashlib.sha1(_uuid + _pass).hexdigest();
        return _sig

    def _prepare_login_user_uuid(self, _email):
        _key = DeviceUser.__tablename__ + ".user_email." + _email
        _uuid = self._redis.get(_key)
        return _uuid
    
    def _prepare(self, _cmd):
        _request_uuid = str(uuid.uuid1())
        _secret = PPMESSAGE_APP["secret"] + _request_uuid
        _request_signature = hashlib.sha1(_secret).hexdigest()

        _headers = {}
        _headers["Content-Type"] = "application/json"
        _headers["X-If-IMAPP"] = "true"
        _headers["X-App-Key"] = PPMESSAGE_APP["key"]
        _headers["X-Request-UUID"] = _request_uuid
        _headers["X-Request-Signature"] = _request_signature

        self._headers = _headers
        
        _http = "https://"
        _host = "ppmessage.cn"
        _port = 80
        if DEV_MODE:
            _host = getIPAddress()
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
            #print(response.body)
            _r = json.loads(response.body)
            self._return_data = None
            if _r["error_code"] == 0:
                self._return_data = _r

            if _r["error_code"] != 0:
                print(_r)
            
            self.assertEqual(_r["error_code"], 0)
            
        except tornado.httpclient.HTTPError as e:
            self.assertEqual(1, 0)
        finally:
            http_client.close()
            
        return
                                    
    def test_pp_page_user_conversation(self):
        _app_uuid = "1e47652b-8907-11e5-a8af-58b035f16bf4"
        _api = "PP_PAGE_ONLINE_PORTAL_USER"
        _data = {"app_uuid": _app_uuid}
        self._prepare(_api)
        self._exec(_data)
        return

if __name__ == "__main__":
    unittest.main()

