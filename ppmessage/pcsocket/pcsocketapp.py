# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

from .wshandler import WSHandler

from ppmessage.core.constant import REDIS_HOST
from ppmessage.core.constant import REDIS_PORT

from ppmessage.core.constant import PCSOCKET_SRV

from ppmessage.core.constant import REDIS_TYPING_KEY
from ppmessage.core.constant import REDIS_MONITOR_KEY
from ppmessage.core.constant import REDIS_ONLINE_KEY

from ppmessage.core.constant import DIS_WHAT

from ppmessage.core.constant import TIMEOUT_WEBSOCKET_OFFLINE

from ppmessage.core.srv.basehandler import BaseHandler

from ppmessage.core.srv.signal import async_signal
from ppmessage.core.srv.signal import async_signal_send_send

from ppmessage.help.getipaddress import getIPAddress
from ppmessage.help.datetimestring import now_to_string

from ppmessage.db.models import AppInfo
from ppmessage.db.models import DeviceInfo
from ppmessage.db.models import PCSocketInfo
from ppmessage.db.models import PCSocketDeviceData
from ppmessage.db.models import ConversationUserData
from ppmessage.db.models import DeviceNavigationData

from ppmessage.dispatcher.policy.policy import AbstractPolicy

from .error import DIS_ERR

from tornado.web import Application
from tornado.web import RequestHandler
from tornado.ioloop import IOLoop

from Queue import Queue

import datetime
import logging
import redis
import uuid
import time
import json
import copy

def pcsocket_user_online(_redis, _user_uuid, _body):
    _key = REDIS_ONLINE_KEY + ".user_uuid." + _user_uuid
    _listeners = _redis.smembers(_key)
    for _i in _listeners:
        _listener = json.loads(_i)
        _body["device_uuid"] = _listener["device_uuid"]
        async_signal(_listener["host"], _listener["port"], PCSOCKET_SRV.ONLINE, copy.deepcopy(_body))
    return
    
class MainHandler(RequestHandler):
    def get(self):
        self.write("PCSOCKET WORKED.")
        return

class TypingHandler(RequestHandler):
    def post(self):
        _body = json.loads(self.request.body)
        _device_uuid = _body.get("listen_device")
        _user_uuid = _body.get("typing_user")
        _conversation_uuid = _body.get("typing_conversation")
        _ws = self.application.ws_hash.get(_device_uuid)
        if _ws == None:
            return
        _ws.send_typing(_user_uuid, _conversation_uuid)
        return

class OnlineHandler(RequestHandler):
    def post(self):
        _body = json.loads(self.request.body)
        logging.info("recv online:%s" % str(_body))
        _device_uuid = _body.get("device_uuid")
        _ws = self.application.ws_hash.get(_device_uuid)
        if _ws == None:
            logging.error("no such ws<->device needs noti:%s" % _device_uuid)
            return
        _ws.send_online(_body)
        return

class AckHandler(RequestHandler):
    def post(self):
        _body = json.loads(self.request.body)
        logging.info("recv ack:%s" % str(_body))
        _device_uuid = _body.get("device_uuid")
        _ws = self.application.ws_hash.get(_device_uuid)
        if _ws == None:
            logging.error("no such ws<->device needs noti:%s" % _device_uuid)
            return
        _ws.send_ack(_body)
        return

class LogoutHandler(RequestHandler):
    def post(self):
        _body = json.loads(self.request.body)
        logging.info("recv logout:%s" % str(_body))
        _device_uuid = _body.get("device_uuid")
        _ws = self.application.ws_hash.get(_device_uuid)
        if _ws == None:
            logging.error("no websocket for the device:%s" % _device_uuid)
            return
        _ws.send_logout(_body)
        return

class PCSocketApp(Application):

    def hasCallback(self):
        return True
    
    def __init__(self):
        self.ws_hash = {}
        self.send_queue = Queue()
        self.redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
        
        settings = {}
        settings["debug"] = True
        handlers = []
        handlers.append(("/", MainHandler))
        handlers.append(("/"+PCSOCKET_SRV.WS, WSHandler))
        handlers.append(("/"+PCSOCKET_SRV.ACK, AckHandler))
        handlers.append(("/"+PCSOCKET_SRV.PUSH, BaseHandler))
        handlers.append(("/"+PCSOCKET_SRV.TYPING, TypingHandler))
        handlers.append(("/"+PCSOCKET_SRV.ONLINE, OnlineHandler))
        handlers.append(("/"+PCSOCKET_SRV.LOGOUT, LogoutHandler))
        Application.__init__(self, handlers, **settings)
        return

    def monitor_device(self, _device_uuid, _status):
        _key = REDIS_MONITOR_KEY + ".websocket_status.device_uuid." + _device_uuid
        _now = now_to_string("basic")
        self.redis.hset(_key, "auto_logout", str(TIMEOUT_WEBSOCKET_OFFLINE))
        self.redis.hset(_key, "status", _status)
        self.redis.hset(_key, "updatetime",  _now)
        return
        
    def _remove_device_data_by_pattern(self, _pattern):
        _keys = self.redis.keys(_pattern)
        for _i in _keys:
            _row = PCSocketDeviceData(uuid=self.redis.get(_i))
            _row.delete_redis_keys(self.redis)
            _row.async_delete()
        return

    def _remove_device_data_by_uuid(self, _uuid):
        if _uuid == None:
            return
        _row = PCSocketDeviceData(uuid=_uuid)
        _row.delete_redis_keys(self.redis)
        _row.async_delete()
        return

    def register_service(self, _port):
        _ip = getIPAddress()
        self.register = {"host": _ip, "port": _port}
        
        _key = PCSocketInfo.__tablename__ + \
               ".host." + _ip + \
               ".port." + _port
        # existed
        if self.redis.exists(_key):
            _row = PCSocketInfo(uuid=self.redis.get(_key),
                                latest_register_time=datetime.datetime.now())
            _row.update_redis_keys(self.redis)
            _row.async_update()
            _key = PCSocketDeviceData.__tablename__ + \
               ".pc_socket_uuid." + _row.uuid + \
               ".device_uuid.*"
            self._remove_device_data_by_pattern(_key)
            self.register["uuid"] = _row.uuid
            return

        # first time run
        _row = PCSocketInfo(uuid=str(uuid.uuid1()),
                            host=_ip,
                            port=_port,
                            latest_register_time=datetime.datetime.now())
        _row.async_add()
        _row.create_redis_keys(self.redis)
        self.register["uuid"] = _row.uuid
        return

    def map_device(self, _device_uuid):
        if _device_uuid == None:
            return
        
        _table = PCSocketDeviceData.__tablename__
        
        _key_0 = _table + ".pc_socket_uuid." + self.register["uuid"] + \
               ".device_uuid." + _device_uuid
        _key_1 = _table + ".device_uuid." + _device_uuid
        
        # the same host
        if self.redis.exists(_key_0):
            return

        # not the same host
        _host = self.redis.get(_key_1)
        # still the same, but no key????
        if _host != None and _host == self.register["uuid"]:
            logging.error("should not be here, two keys not consistent")
            return

        # remove the previous
        if _host != None and _host != self.register["uuid"]:
            _key_2 = _table + ".pc_socket_uuid." + _host + ".device_uuid." + _device_uuid
            _data = self.redis.get(_key_2)
            self._remove_device_data_by_uuid(_data)

        # create it
        _row = PCSocketDeviceData(uuid=str(uuid.uuid1()),
                                  pc_socket_uuid=self.register["uuid"],
                                  device_uuid=_device_uuid)
        _row.create_redis_keys(self.redis)
        _row.async_add()
        return

    def unmap_device(self, _device_uuid):
        if _device_uuid == None:
            return
        _key = PCSocketDeviceData.__tablename__ + \
               ".pc_socket_uuid." + self.register["uuid"] + \
               ".device_uuid." + _device_uuid
        _data = self.redis.get(_key)
        self._remove_device_data_by_uuid(_data)
        return
    
    def user_typing(self, _user_uuid, _conversation_uuid):
        _key = REDIS_TYPING_KEY + ".user_uuid." + _user_uuid
        _listens = self.redis.smembers(_key)
        for _listen in _listens:
            _listen = json.loads(_listen)
            _d = {
                "typing_user": _user_uuid,
                "typing_conversation": _conversation_uuid,
                "listen_device": _listen["device_uuid"]
            }
            async_signal(_listen["host"], _listen["port"], PCSOCKET_SRV.TYPING, _d)
        return

    def user_online(self, _user_uuid, _body):
        pcsocket_user_online(self.redis, _user_uuid, _body)
        return

    def _get_service_care_users(self, _app_uuid, _user_uuid):
        _key = AppInfo.__tablename__ + ".uuid." + _app_uuid
        _name = self.redis.hget(_key, "app_policy_name")
        _cls = AbstractPolicy.get_policy_cls_by_name(_name)
        return _cls.get_service_care_users(_app_uuid, _user_uuid, self.redis)

    def _get_portal_care_users(self, _app_uuid, _user_uuid):
        _key = AppInfo.__tablename__ + ".uuid." + _app_uuid
        _name = self.redis.hget(_key, "app_policy_name")
        _cls = AbstractPolicy.get_policy_cls_by_name(_name)
        return _cls.get_portal_care_users(_app_uuid, _user_uuid, self.redis)
    
    def start_watching_online(self, _ws):
        _user_uuid = _ws.user_uuid
        _app_uuid = _ws.app_uuid
        _device_uuid = _ws.device_uuid
        _is_service_user = _ws.is_service_user
        
        if _user_uuid == None or _app_uuid == None or _device_uuid == None:
            logging.error("app uuid or user uuid is None for start watching")
            return

        _users = None
        if _is_service_user == True:
            _users = self._get_service_care_users(_app_uuid, _user_uuid)
        else:
            _users = self._get_portal_care_users(_app_uuid, _user_uuid)

        if _users == None:
            return

        _d = {
            "host": self.register["host"],
            "port": self.register["port"],
            "device_uuid": _device_uuid
        }
        _s = json.dumps(_d)
        for _user_uuid in _users:
            _key = REDIS_ONLINE_KEY + ".user_uuid." + _user_uuid
            self.redis.sadd(_key, _s)

        _ws._watch_online["users"] = _users
        return

    def stop_watching_online(self, _ws):
        _users = _ws._watch_online.get("users")
        if _users == None:
            return
        _device_uuid = _ws.device_uuid
        _d = {
            "host": self.register["host"],
            "port": self.register["port"],
            "device_uuid": _device_uuid
        }
        _s = json.dumps(_d)
        for _user_uuid in _users:
            _key = REDIS_ONLINE_KEY + ".user_uuid." + _user_uuid
            self.redis.srem(_key, _s)
        _ws._watch_online["users"] = None
        return

    def start_watching_typing(self, _ws, _body):
        _conversation_uuid = _body.get("conversation_uuid")
        if _conversation_uuid == None:
            logging.error("conversation not in: %s" % str(_body))
            _ws.send_ack({"code": DIS_ERR.PARAM, "what": DIS_WHAT.TYPING_WATCH})
            return
        _key = ConversationUserData.__tablename__ + \
               ".conversation_uuid." + _conversation_uuid
        _d = {
            "host": self.register["host"],
            "port": self.register["port"],
            "device_uuid": _ws.device_uuid
        }
        _v = json.dumps(_d)
        _users = self.redis.smembers(_key)
        for _user_uuid in _users:
            if _user_uuid == _ws.user_uuid:
		continue
            _users.add(_user_uuid)
            _listen_key = REDIS_TYPING_KEY + ".user_uuid." + _user_uuid
            self.redis.sadd(_listen_key, _v)
        _ws._watch_typing["users"] = _users
        _ws._watch_typing["conversation"] = _conversation_uuid
        return

    def stop_watching_typing(self, _ws):
        _users = _ws._watch_typing.get("users")
        if _users == None:
            return
        _d = {
            "host": self.register["host"],
            "port": self.register["port"],
            "device_uuid": _ws.device_uuid
        }
        _v = json.dumps(_d)
        for _user_uuid in _users:
            _listen_key = REDIS_TYPING_KEY + ".user_uuid." + _user_uuid
            self.redis.srem(_listen_key, _v)
        _ws._watch_typing["users"] = None
        _ws._watch_typing["conversation"] = None
        return

    def _send_loop(self):
        if self.send_queue.empty() == True:
            return
        _body = self.send_queue.get(False)
        if _body == None:
            return
        self.send_queue.task_done()
        async_signal_send_send(_body)
        return
    
    def send_send(self, _device_uuid, _body):
        _body["pcsocket"] = {
            "host": self.register["host"],
            "port": self.register["port"],
            "device_uuid": _device_uuid
        }        
        self.send_queue.put(_body)
        IOLoop.instance().add_callback(self._send_loop)
        return
    
    def save_extra(self, _app_uuid, _device_uuid, _extra_data):
        if isinstance(_extra_data, dict):
            _extra_data = json.dumps(_extra_data)
            
        _row = DeviceNavigationData(uuid=str(uuid.uuid1()), app_uuid=_app_uuid,
                                    device_uuid=_device_uuid, navigation_data=_extra_data)
        _row.async_add()
        _row.create_redis_keys(self.redis)
        return
