# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

# api/basehandler.py

from ppmessage.api.error import API_ERR
from ppmessage.api.error import getErrorDesc

from ppmessage.core.utils.datetimeencoder import DateTimeEncoder
from ppmessage.api.getbackendqueue import getBackendQueue

from ppmessage.db.models import ApiTokenData
from ppmessage.db.models import AppInfo

from tornado.web import RequestHandler
from tornado.web import asynchronous
from tornado.ioloop import IOLoop

import json
import hashlib
import logging
import datetime


"""

method could be GET/POST/PUT/DELETE

The derived class need implement the
_Task
_After
_Before
to be overwritten
"""

class BaseHandler(RequestHandler):

    def __init__(self, *args, **kwargs):
        """
        api_uuid list, api_level list
        if api_level list empty, any api level is permitted.
        if api_uuid True, input parameters must include api_uuid
        if app_uuid True, input parameters must include app_uuid

        if app_created True, the app must be created by api

        """        

        self._permission = {
            "api_level": [],
            "api_uuid": False,
            "app_uuid": False,
            "app_owned": False,
        }

        super(BaseHandler, self).__init__(*args, **kwargs)

        self._return_data = {}
        self._return_data["uri"] = self.request.uri
        self.setErrorCode(API_ERR.NO_ERR)

        self.request_body = None
        self.api_uuid = None
        self.api_token = None
        self.api_level = None
        self.app_uuid = None
        
        return
    
    def _header(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.set_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
        self.set_header("Access-Control-Max-Age", "1728000")

    def _after(self):
        self.set_header("Content-Type", "application/json")
        self._header()
        self.write(json.dumps(self._return_data, cls=DateTimeEncoder))
        self.finish()
        return

    def _before(self):
        return self._check()

    def _task(self):
        return

    def _handle_with_io(self):
        if not self._Before():
            self._After()
            return
        queue = getBackendQueue()
        queue.put((self._Task, self._After))
        IOLoop.instance().add_callback(self._Loop)
        return

    def _handle(self):
        if not self._Before():
            self._After()
            return
        self._Task()
        self._After()
        return

    def _Before(self):
        return self._before()

    def _After(self):
        self._after()
        return

    def _Task(self):
        self._task()
        return

    def _Loop(self):
        _queue = getBackendQueue()
        if _queue.empty() == True:
            return
        _delay = _queue.get(False)
        if _delay == None:
            return
        _delay_task = _delay[0]
        _delay_after = _delay[1]
        if _delay_task != None:
            _delay_task()
        if _delay_after != None:
            _delay_after()
        _queue.task_done()
        return

    # overwrite tornado
    def options(self):
        self._header()
        return

    @asynchronous
    def post(self):
        self._handle_with_io()
        return
    
    @asynchronous
    def get(self):
        self._handle_with_io()
        return

    def _has_token(self):
        """
        Authorization: OAuth xxxx
        """
        _auth = self.request.headers.get("Authorization")
        if _auth == None or len(_auth) == 0:
            return False
        _auth = _auth.split(" ")

        if len(_auth) != 2:
            return False
        
        if _auth[0].lower() != "oauth":
            return False

        if len(_auth[1]) == 0:
            return False
        
        self.api_token = _auth[1]
        return True
    
    def _check_token(self):
        _redis = self.application.redis
        _key = ApiTokenData.__tablename__ + ".api_token." + self.api_token
        _api_level = _redis.get(_key)

        if _api_level == None or len(_api_level) == 0:
            logging.error("no api_level found with token: %s" % self.api_token)
            return False

        _api_level = json.loads(_api_level)
        self.api_uuid = _api_level[0]
        self.api_level = _api_level[1]

        _permission = self._permission
        _api_level = _permission.get("api_level")
        if len(_api_level) > 0:
            if self.api_level not in _api_level:
                logging.error("api_level: %s not in permission" % self.api_level)
                return False

        _app_uuid = _permission.get("app_uuid")
        if _app_uuid == True:
            self.app_uuid = self.request_body.get("app_uuid")
            if self.app_uuid == None:
                logging.error("no app_uuid is provided")
                return False

        _api_uuid = _permission.get("api_uuid")
        _app_owned = _permission.get("app_owned")
        if _app_owned == True and _app_uuid == True and _api_uuid == True:
            _key = AppInfo.__tablename__ + ".uuid." + self.app_uuid
            _api_uuid = self.application.redis.hget(_key, "api_uuid")
            if _api_uuid != self.api_uuid:
                logging.error("the app:%s is not created by api:%s" % (self.app_uuid, self.api_uuid))
                return False

        return True

    def _json(self):
        if self.request.method == "GET":
            logging.error("api is POST only, uri:%s" % self.request.uri)
            return False

        _content_type = self.request.headers.get("Content-Type")
        if _content_type and ("application/json" in _content_type.lower()):
            try:
                self.request_body = json.loads(self.request.body)
            except:
                logging.info("api request data not json")
                return False
            return True
        return False

    def _check(self):
        if not self._json():
            logging.error("api request not json")
            self.setErrorCode(API_ERR.NO_JSON)
            return False

        if not self._has_token():
            logging.error("api request has no token")
            self.setErrorCode(API_ERR.NO_ACCESS_TOKEN)
            return False
        
        if not self._check_token():
            logging.error("api request check token failed")
            self.setErrorCode(API_ERR.WRONG_ACCESS_TOKEN)
            return False
        
        return True

    def setErrorCode(self, code):
        self._return_data["error_code"] = code
        self._return_data["error_string"] = getErrorDesc(code)
        return

    def getReturnData(self):
        return self._return_data

    def addPermission(self, app_uuid=None, api_uuid=None, api_level=None):
        if api_uuid != None:
            self._permission["api_uuid"] = api_uuid
        if api_level != None:
            self._permission["api_level"].append(api_level)
        if app_uuid != None:
            self._permission["app_uuid"] = app_uuid
        return
