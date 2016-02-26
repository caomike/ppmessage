# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#

from .basehandler import BaseHandler

from mdm.db.models import MessagePushTask

from mdm.api.error import API_ERR

from mdm.core.constant import YVOBJECT
from mdm.core.constant import MESSAGE_TYPE
from mdm.core.constant import MESSAGE_SUBTYPE

from mdm.core.srv.signal import signal_cache_add
from mdm.core.srv.signal import signal_dis_message

import json
import uuid
import datetime
import logging

class InviteDUAsContactHandler(BaseHandler):

    def _invite(self, _from_uuid, _user_uuid, _message):
        _uuid = str(uuid.uuid1())
        _add = {
            "table": MessagePushTask.__tablename__,
            "key": "uuid."+_uuid,
            "values": {
                "uuid": _uuid,
                "message_type": MESSAGE_TYPE.NOTI,
                "message_subtype": MESSAGE_SUBTYPE.INVITE_CONTACT,
                "from_type": YVOBJECT.DU,
                "from_uuid": _from_uuid,
                "to_type": YVOBJECT.DU,
                "to_uuid": _user_uuid,
                "body": _message,
                "createtime": datetime.datetime.now(),
                "updatetime": datetime.datetime.now(),
            }
        }
        signal_cache_add(_add)
        signal_dis_message({"task_uuid": _uuid})
        pass
    
    def _Task(self):
        super(InviteDUAsContactHandler, self)._Task()

        _input = json.loads(self.request.body)
        if "user_uuid" not in _input or "from_uuid" not in _input:
            logging.error("Error for no para.")
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _message = ""
        if "message" in _input:
            _message = _input["message"]
            
        _user_uuid = _input["user_uuid"]
        _from_uuid = _input["from_uuid"]
        self._invite(_from_uuid, _user_uuid, _message)
        
        #logging.info("INVITEDUASCONTACT return (%s)." % (str(_rdata)))
        return
        
        
