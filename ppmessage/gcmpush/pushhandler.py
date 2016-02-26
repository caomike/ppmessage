# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from ppmessage.core.constant import GCM_API_KEY
from ppmessage.core.constant import APNS_TITLE
from ppmessage.core.constant import MESSAGE_TYPE
from ppmessage.core.constant import MESSAGE_SUBTYPE
from ppmessage.iospush.pushtitle import push_title

from gcm import GCM
import logging
import json

class PushHandler():

    def __init__(self, _app):
        self.application = _app
        self.gcm = GCM(GCM_API_KEY)
        return
    
    def _one(self, _token, _msg):
        if self.gcm == None:
            logging.error("no fucking gcm")
            return
        self.gcm.plaintext_request(registration_id=_token, collapse_key='ppmessage', data=_msg)
        return
    
    def _push(self, _app_uuid, _body, _config):
        _type = _body.get("mt")
        _subtype = _body.get("ms")
        _count = _config.get("unacked_notification_count")
        _title = push_title(_type, _subtype, _body.get("bo"), _config.get("user_language"))
        _token = _config.get("mqtt_android_token")
        _sound = None
        if not _config.get("user_silence_notification"):
            _sound = "beep.wav"
        _msg = {"title": _title, "sound": _sound, "count": _count}
        self._one(_token, _msg)
        return

    def task(self, _data):
        _config = _data.get("config")
        _body = _data.get("body")
        _app_uuid = _data.get("app_uuid")
        if _config == None or \
           _body == None or \
           _app_uuid == None:
            logging.error("Illegal request: %s." % str(_data))
            return
        self._push(_app_uuid, _body, _config)
        return

