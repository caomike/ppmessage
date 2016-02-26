# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#

from .basehandler import BaseHandler

from ppmessage.db.models import MessagePushTask
from ppmessage.db.models import UserContactData

from ppmessage.core.constant import MESSAGE_TYPE
from ppmessage.core.constant import MESSAGE_SUBTYPE
from ppmessage.core.constant import YVOBJECT

from ppmessage.api.error import API_ERR
from ppmessage.core.srv.signal import signal_dis_message
from ppmessage.core.srv.signal import signal_cache_add

import uuid
import json
import logging
import datetime

class AcceptContactInvitationHandler(BaseHandler):

    def _accept(self, _from_uuid, _user_uuid):
        _msg_uuid = str(uuid.uuid1())
        _add = {
            "table": MessagePushTask.__tablename__,
            "key": "uuid." + _msg_uuid,
            "values": {
                "uuid": _msg_uuid,
                "message_type": MESSAGE_TYPE.NOTI,
                "message_subtype": MESSAGE_SUBTYPE.ACCEPT_CONTACT,
                "from_type": YVOBJECT.DU,
                "from_device_uuid": self.device_uuid,
                "from_uuid": _from_uuid,
                "to_type": YVOBJECT.DU,
                "to_uuid": _user_uuid,
                "createtime": datetime.datetime.now(),
                "updatetime": datetime.datetime.now(),
            }
        }
        signal_cache_add(_add)
        signal_dis_message({"task_uuid": _msg_uuid})

        # cache without key, not add cache but in DB
        _redis = self.application.redis
        _name = UserContactData.__tablename__

        _data_uuid = str(uuid.uuid1())
        _add = {
            "table": _name,
            "values": {
                "uuid": _data_uuid,
                "user_uuid": _from_uuid,
                "contact_uuid": _user_uuid,
                "createtime": datetime.datetime.now(),
                "updatetime": datetime.datetime.now(),
            }
        }
        signal_cache_add(_add)
        _n = _name + ".user_uuid." + _from_uuid + \
             ".contact_uuid." + _user_uuid
        _redis.set(_n, _data_uuid)

        _data_uuid = str(uuid.uuid1())
        _add = {
            "table": _name,
            "values": {
                "uuid": _data_uuid,
                "user_uuid": _user_uuid,
                "contact_uuid": _from_uuid,
                "createtime": datetime.datetime.now(),
                "updatetime": datetime.datetime.now(),
            }
        }
        signal_cache_add(_add)
        return

    def _has_contact(self, _from_uuid, _user_uuid):
        _redis = self.application.redis
        _key = UserContactData.__tablename__ + \
               ".user_uuid." + _user_uuid + \
               ".contact_uuid." + _from_uuid
        _result = _redis.get(_key)
        if _result:
            return True
        else:
            return False
    
    def _Task(self):
        super(AcceptContactInvitationHandler, self)._Task()

        _input = json.loads(self.request.body)
        if "from_uuid" not in _input or \
           "user_uuid" not in _input or \
           "device_uuid" not in _input:
            logging.error("Error for no para.")
            self.setErrorCode(API_ERR.NO_PARA)
            return

        self.device_uuid = _input["device_uuid"]
        _user_uuid = _input.get("user_uuid")
        _from_uuid = _input.get("from_uuid")

        self._accept(_from_uuid, _user_uuid)
        """
        if not self._has_contact(_from_uuid, _user_uuid):
            self._accept(_from_uuid, _user_uuid)
        else:
            logging.error("already has this contact")
            self.setErrorCode(API_ERR.EX_CONTACT)
            return
        """
        #logging.info("ACCEPTCONTACTINVITATION return (%s)." % (str(_rdata)))
        return
        
        
