# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2015 YVertical.
# Ding Guijin, guijin.ding@yvertical.com
#

from ppmessage.core.constant import DEV_MODE
from ppmessage.core.constant import CONVERSATION_TYPE
from ppmessage.bootstrap.data import BOOTSTRAP_DATA

import tornado.httpclient
import uuid
import unittest
import traceback
import json
import redis
import hashlib
import logging

PAGE_SIZE = 10

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
                                    
    def _get_conversation_by_page(self, page_offset, page_size):
        _api = "PP_PAGE_USER_CONVERSATION"
        _data = {
            "app_uuid": BOOTSTRAP_DATA["team"]["app_uuid"],
            "user_uuid": BOOTSTRAP_DATA["user"]["user_uuid"],
            "page_offset": page_offset,
            "page_size": page_size
        }
        self._prepare(_api)
        self._exec(_data)

        return self._get_return("list")
    
    def _get_conversation_by_max_uuid(self, max_uuid, page_size): 
        _api = "PP_PAGE_USER_CONVERSATION"
        _data = {
            "app_uuid": BOOTSTRAP_DATA["team"]["app_uuid"],
            "user_uuid": BOOTSTRAP_DATA["user"]["user_uuid"],
            "max_uuid": max_uuid,
            "page_size": page_size
        }
        self._prepare(_api)
        self._exec(_data)
        return self._get_return("list")

    def _get_conversation_by_min_uuid(self, min_uuid, page_size): 
        _api = "PP_PAGE_USER_CONVERSATION"
        _data = {
            "app_uuid": BOOTSTRAP_DATA["team"]["app_uuid"],
            "user_uuid": BOOTSTRAP_DATA["user"]["user_uuid"],
            "min_uuid": min_uuid,
            "page_size": page_size
        }
        self._prepare(_api)
        self._exec(_data)
        return self._get_return("list")        

    def _test(self, offset, size):
        """
        1. get a list of conversation by page as [list_page], mark the first(newest) conversation's uuid
        as [max_uuid], the last(oldest) conversation's uuid as [min_uuid]
        
        2. get a list of conversation by max_uuid as [list_max], another list of conversation by min_uuid 
        as [list_min]. 

        3. [list_max] and [list_min] should both be 1 element shorter than [list_page], because [max_uuid]
        and [min_uuid] was removed before api return.
        
        4. list_page[i] == list_min[i], list_page[i+1] == list_max[i]
        """

        list_page = self._get_conversation_by_page(offset, size)
        length_page = len(list_page)
        if length_page == 0:
            print "last page reached, return now"
            return
        
        max_uuid = list_page[0].get("uuid")
        min_uuid = list_page[length_page - 1].get("uuid")

        list_max = self._get_conversation_by_max_uuid(max_uuid, length_page)
        list_min = self._get_conversation_by_min_uuid(min_uuid, length_page)
        length_max = len(list_max)
        length_min = len(list_min)

        self.assertEqual(length_page, length_min + 1)
        self.assertEqual(length_page, length_max + 1)

        for i, conv in enumerate(list_max):
            uuid1 = conv.get("uuid")
            uuid2 = list_page[i+1].get("uuid")
            self.assertEqual(uuid1, uuid2)

        for i, conv in enumerate(list_min):
            uuid1 = conv.get("uuid")
            uuid2 = list_page[i].get("uuid")
            self.assertEqual(uuid1, uuid2)

        print "list_by_page"
        for conv in list_page:
            uuid = conv.get("uuid")
            time = conv.get("updatetime")
            print uuid, time
        print "\n"
        

        print "list_by_max_uuid"
        for conv in list_max:
            uuid = conv.get("uuid")
            time = conv.get("updatetime")
            print uuid, time
        print "\n"

        print "list_by_min_uuid"
        for conv in list_min:
            uuid = conv.get("uuid")
            time = conv.get("updatetime")
            print uuid, time
        print "\n"

        return
    
    def test_page_conversations(self):
        max_page = 5
        page_size = 10
        for i in range(max_page):
            self._test(i, page_size)
        return

if __name__ == "__main__":
    unittest.main()

