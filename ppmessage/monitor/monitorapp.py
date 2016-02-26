# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#


from ppmessage.core.constant import REDIS_HOST
from ppmessage.core.constant import REDIS_PORT
from ppmessage.core.constant import REDIS_MONITOR_KEY
from ppmessage.core.constant import WEBSOCKET_STATUS
from ppmessage.core.constant import OS

from ppmessage.help.datetimestring import now_to_string
from ppmessage.help.datetimestring import string_to_datetime

from ppmessage.db.models import DeviceInfo

from tornado.web import Application
from tornado.web import RequestHandler
from tornado.web import asynchronous

import datetime
import logging
import redis
import uuid
import time
import json

class MainHandler(RequestHandler):
    def _handle(self):
        _redis = self.application.redis
        _pattern = REDIS_MONITOR_KEY+".websocket_status.device_uuid.*"
        _keys = _redis.keys(_pattern)
        _o = {}
        _pi = _redis.pipeline()
        for _i in _keys:
            _pi.hgetall(_i)
        _o = _pi.execute()
        _open_count = 0
        _close_count = 0
        _null_count = 0
        for _i in _o:
            if _i.get("status") == "OPEN":
                _open_count = _open_count + 1
            if _i.get("status") == "CLOSE":
                _close_count = _close_count + 1
            if _i.get("status") == "NULL":
                _null_count = _null_count + 1

        _count = {
            "open": _open_count,
            "close": _close_count,
            "null": _null_count,
        }
        
        self.write("<html><body>")
        self.write("<p>")
        self.write(json.dumps(_count))
        self.write("<p>")
        for _i in _o:
            self.write(json.dumps(_i))
            self.write("<br>")
        self.write("</body></html>")
        self.finish()
        return
    
    @asynchronous
    def post(self):
        self._handle()

    @asynchronous
    def get(self):
        self._handle()

class MonitorApp(Application):
    
    def __init__(self):
        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
        settings = {}
        settings["debug"] = True
        handlers = []
        handlers.append(("/", MainHandler))
        Application.__init__(self, handlers, **settings)
        return
    
    def every_twenty_seconds(self):
        _keep = []
        _pattern = REDIS_MONITOR_KEY+".websocket_status.device_uuid.*"
        _keys = self.redis.keys(_pattern)
        for _i in _keys:
            _status = self.redis.hget(_i, "status")
            
            # WS not close
            if _status != WEBSOCKET_STATUS.CLOSE:
                continue

            # CLOSE
            # WS already close, needs care to autologout
            _device_uuid = _i.split(".")[-1]

            _key = DeviceInfo.__tablename__ + ".uuid." + _device_uuid
            _os = self.redis.hget(_key, "device_ostype")

            # always online mobile
            if _os == OS.AND or _os == OS.IOS:
                continue
            
            _to_be = self.redis.hincrby(_i, "auto_logout", -20)
            self.redis.hset(_i, "updatetime", now_to_string("basic"))

            if _to_be > 0:
                continue
            
            self.redis.hset(_i, "status", WEBSOCKET_STATUS.NULL)
            self._ppcom_offline(_device_uuid)
        
        return

    def _ppcom_offline(self, _device_uuid):
        _row = DeviceInfo(uuid=_device_uuid, device_is_online=False)
        _row.async_update()
        _row.update_redis_keys(self.redis)
        # FIXME: UserOnlineStatusLog
        return
