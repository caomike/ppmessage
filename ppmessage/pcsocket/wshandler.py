# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

from ppmessage.core.constant import OS
from ppmessage.core.constant import DIS_WHAT
from ppmessage.core.constant import API_LEVEL
from ppmessage.core.constant import ONLINE_STATUS
from ppmessage.core.constant import MESSAGE_TYPE
from ppmessage.core.constant import MESSAGE_SUBTYPE
from ppmessage.core.constant import WEBSOCKET_STATUS
from ppmessage.core.constant import REDIS_TYPING_KEY

from ppmessage.db.models import DeviceInfo
from ppmessage.db.models import ApiTokenData

from .error import DIS_ERR
from .error import get_error_string

import tornado.websocket
import datetime
import logging
import uuid
import json

class WSHandler(tornado.websocket.WebSocketHandler):

    def __init__(self, *args, **kwargs):
        super(WSHandler, self).__init__(*args, **kwargs)

        # tracking this socket
        self.ws_uuid = str(uuid.uuid1())

        self.body = None
        
        self.device_uuid = None
        self.user_uuid = None
        self.app_uuid = None
        self.api_token = None
        
        self.extra_data = None
        self.is_service_user = False
        self.is_mobile_device = False

        self._watch_online = {"users": None}
        self._watch_typing = {"users": None, "conversation": None}

        return

    def _please_logout(self, _ws, _other):
        _key = DeviceInfo.__tablename__ + ".uuid." + _other
        _new_name = self.application.redis.hget(_key, "device_fullname")

        _key = DeviceInfo.__tablename__ + ".uuid." + _ws.device_uuid
        _old_name = self.application.redis.hget(_key, "device_fullname")
        
        logging.info("%s force %s logout" % (_new_name, _old_name))
        
        _please = {
            "mt": MESSAGE_TYPE.SYS,
            "ms": MESSAGE_SUBTYPE.LOGOUT,
            "bo": _ws.device_uuid,
        }

        # stop watching
        self.application.stop_watching_online(_ws)
        self.application.stop_watching_typing(_ws)
        
        _ws.send_msg(_please)
        
        self.application.ws_hash[_ws.device_uuid] = None
        del self.application.ws_hash[_ws.device_uuid]

        self.application.unmap_device(_ws.device_uuid)
        self.application.monitor_device(_ws.device_uuid, WEBSOCKET_STATUS.CLOSE)

        _ws.device_uuid = None
        #_ws.close()

        return

    def _check_ostype(self, _device_uuid):
        _is_mobile = False
        _key = DeviceInfo.__tablename__ + \
               ".uuid." + _device_uuid
        _ostype = self.application.redis.hget(_key, "device_ostype")
        if _ostype == OS.AND or _ostype == OS.IOS:
            _is_mobile = True
        return _is_mobile

    def _user_online(self, _status):
        # ignore the service user who logined with mobile device
        logging.info("online service:%s, mobile:%s" % (str(self.is_service_user), str(self.is_mobile_device)))
        if self.is_service_user == True and self.is_mobile_device == True:
            return

        _body = {
            "user_uuid": self.user_uuid,
            "extra_data": self.extra_data,
            "mobile": ONLINE_STATUS.UNCHANGED,
            "browser": ONLINE_STATUS.UNCHANGED
        }
        if self.is_mobile_device == True:
            _body["mobile"] = _status
        else:
            _body["browser"] = _status
        self.application.user_online(self.user_uuid, _body)
        return
    
    def _on_auth(self, _body):
        self.api_token = _body.get("api_token")
        self.app_uuid = _body.get("app_uuid")
        self.device_uuid = _body.get("device_uuid")
        self.user_uuid = _body.get("user_uuid")
        self.is_service_user = _body.get("is_service_user")
        self.extra_data = _body.get("extra_data")

        if self.api_token == None:
            self.send_ack({"code": DIS_ERR.NOTOKEN, "what": DIS_WHAT.AUTH})
            return

        _key = ApiTokenData.__tablename__ + ".api_token." + self.api_token
        _token = self.application.redis.get(_key)
        _token = json.loads(_token)
        if _token[1] != API_LEVEL.PPCOM and _token[1] != API_LEVEL.PPKEFU and _token[1] != API_LEVEL.THIRD_PARTY_KEFU:
            self.send_ack({"code": DIS_ERR.WRLEVEL, "what": DIS_WHAT.AUTH})
            return
        
        if self.app_uuid == None or self.user_uuid == None or self.device_uuid == None:
            self.send_ack({"code": DIS_ERR.NOUUIDS, "what": DIS_WHAT.AUTH})
            return
        
        if self.is_service_user == None:
            self.send_ack({"code": DIS_ERR.NOSERVICE, "what": DIS_WHAT.AUTH})
            return

        self.is_mobile_device = self._check_ostype(self.device_uuid)
        if self.is_service_user == False and self.extra_data == None:
            self.send_ack({"code": DIS_ERR.NOEXTRA, "what": DIS_WHAT.AUTH})
            return

        self.send_ack({"code": DIS_ERR.NOERR, "what": DIS_WHAT.AUTH})

        if self.device_uuid in self.application.ws_hash:
            _ws = self.application.ws_hash.get(self.device_uuid)
            if _ws.ws_uuid != self.ws_uuid:
                logging.info("same device:%s %s:%s" % (self.device_uuid, _ws.ws_uuid, self.ws_uuid))
                self._please_logout(_ws, self.device_uuid)

        self.application.save_extra(self.app_uuid, self.device_uuid, self.extra_data)
        self.application.map_device(self.device_uuid)
        self.application.ws_hash[self.device_uuid] = self
        self.application.monitor_device(self.device_uuid, WEBSOCKET_STATUS.OPEN)
        self.application.start_watching_online(self)
        self._user_online(ONLINE_STATUS.ONLINE)
        logging.info("AUTH DEVICE:%s USER:%s." % (self.device_uuid, self.user_uuid))
        return
    
    def _on_watch_typing(self, _body):
        self.application.start_watching_typing(self, _body)
        return

    def _on_unwatch_typing(self, _body):
        self.application.stop_watching_typing(self)
        return

    def _on_typing(self, _body):
        _conversation = self._watch_typing.get("conversation")
        if _conversation == None:
            logging.error("no watching conversation")
            return
        self.application.user_typing(self.user_uuid, _conversation)
        return

    def _on_send(self, _body):
        _send = _body.get("send")
        if _send == None:
            send_ack({"code": DIS_ERR.PARAM, "what": DIS_WHAT.SEND})
            return
        logging.info("sending ..... %s" % _send)
        self.application.send_send(self.device_uuid, _send)
        return

    def _which(self, _type):
        _map = {
            DIS_WHAT.AUTH: self._on_auth,
            DIS_WHAT.TYPING_WATCH: self._on_watch_typing,
            DIS_WHAT.TYPING_UNWATCH: self._on_unwatch_typing,
            DIS_WHAT.TYPING: self._on_typing,
            DIS_WHAT.SEND: self._on_send
        }
        return _map.get(_type)
        
    def open(self):
        logging.info("CLIENT OPEN.....")
        self.set_nodelay(True)
        return

    def on_message(self, message):
        """
        
        AUTH:
        from ppcom/ppkefu
        {
        "type": DIS_WHAT.AUTH,
        "device_uuid": string,
        "user_uuid": string,
        "extra_data": OBJECT,
        "is_service_user": True/False
        }
        
        ack back to ppcom/ppkefu
        {"type": DIS_WHAT.ACK, "what": DIS_WHAT_AUTH, "code": int, "reason": string}
        
        TYPING
        from ppcom/ppkefu
        TYPING_WATCH the client be interested in this conversation typing
        {
        "type": DIS_WHAT.TYPING_WATCH,
        "conversation_uuid": xxxx,
        }

        from ppcom/ppkefu
        TYPING_UNWATCH the client is no longer interested the conversation typing 
        {
        "type": DIS_WHAT.TYPING_UNWATCH
        "conversation_uuid": xxxx,
        }

        from ppcom/ppkefu
        TYPING means the client is typing (receive and send)
        {
        "type": DIS_WHAT.TYPING 
        }

        to ppcom/ppkefu
        ONLINE means the user is online or not, 
        if online then which device type is online(send only)
        {
        "type": DIS_WHAT.ONLINE,
        "mobile": ONLINE/OFFLINE/UNCHANGED
        "browser": ONLINE/OFFLINE/UNCHANGED
        "user_uuid": string,
        }

        from ppcom/ppkefu
        SEND message with websocket
        {
        "type": DIS_WHAT.SEND
        "send": string
        }
         
        to ppcom/ppkefu
        ACK
        {
        "type": DIS_WHAT.ACK
        "what": ack which DIS_WHAT 
        "code": DIS_ERR
        "reason": string
        }
        """
        logging.info("WS MESSAGE..... %s" % message)
        _body = None
        try:
            _body = json.loads(message)
        except:
            logging.error("failed parse %s" % message)
            self.send_ack({"code": DIS_ERR.JSON, "what": DIS_WHAT.WS})
            return
        
        if _body == None:
            return

        self.body = _body
        
        _type = _body.get("type")
        if _type == None:
            self.send_ack({"code": DIS_ERR.TYPE, "what": DIS_WHAT.WS})
            logging.error("can not handle message: %s" % message)
            return

        _type = _type.upper()
        _f = self._which(_type)
        if _f == None:
            logging.error("can not hanle message: %s" % message)
            self.send_ack({"code": DIS_ERR.TYPE, "what": DIS_WHAT.WS})
            return
        
        _f(_body)
        return
    
    def on_close(self):
        if self.device_uuid == None:
            logging.error("CLOSE websocket with device_uuid == None")
            return
        
        logging.info("CLOSE device_uuid:%s." % self.device_uuid)
        self.application.ws_hash[self.device_uuid] = None
        del self.application.ws_hash[self.device_uuid]
        self.application.unmap_device(self.device_uuid)
        self.application.monitor_device(self.device_uuid, WEBSOCKET_STATUS.CLOSE)
        self.application.stop_watching_online(self)
        self.application.stop_watching_typing(self)
        self._user_online(ONLINE_STATUS.OFFLINE)
        return
    
    def send_typing(self, _user_uuid, _conversation_uuid):
        if _conversation_uuid != self._watch_typing["conversation"]:
            return
        _m = {
            "type": DIS_WHAT.TYPING,
            "user_uuid": _user_uuid,
            "conversation_uuid": _conversation_uuid
        }
        self.write_message(_m)
        return

    def send_online(self, _online):
        _m = {"type": DIS_WHAT.ONLINE}
        _m.update(_online)
        if "task_type" in _m:
            del _m["task_type"]
        self.write_message(_m)
        return

    def send_ack(self, _body):
        _what = _body.get("what")
        _code = _body.get("code")
        _extra = _body.get("extra")

        if _what == None or _code == None:
            return
        
        _what = _what.upper()
        _str = get_error_string(_code)
        _d = {
            "type": DIS_WHAT.ACK,
            "what": _what,
            "code" : _code,
            "reason": _str,
            "extra": _extra
        }
        self.write_message(_d)
        logging.info("ack:%s" % (_d))
        
        if _what != DIS_WHAT.AUTH:
            return

        # especially handle for auth
        if _code == DIS_ERR.NOERR:
            logging.info("pcsocket SUCCESS body:%s" % (self.body))
            return
        
        self.device_uuid = None
        self.close()
        return

    def send_msg(self, _body):
        _d = {
            "type": DIS_WHAT.MSG,
            "msg": _body
        }
        logging.info("send msg: %s, device_uuid:%s" % (_body.get("bo"), self.device_uuid))
        self.write_message(_d)
        return

    def send_logout(self, _body):
        self._please_logout(self, _body.get("other_device"))
        return
    
    def check_origin(self, origin):
        return True
