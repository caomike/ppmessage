# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#

from .basehandler import BaseHandler

from mdm.db.common.dbinstance import getDBSessionClass

from mdm.db.models import MessagePushTask
from mdm.db.models import UserContactData

from mdm.api.error import API_ERR

from mdm.core.constant import MESSAGE_TYPE
from mdm.core.constant import MESSAGE_SUBTYPE
from mdm.core.constant import YVOBJECT

from mdm.core.srv.signal import signal_cache_add
from mdm.core.srv.signal import signal_dis_message
from mdm.core.srv.signal import signal_cache_delete

from sqlalchemy import and_

import json
import uuid
import logging
import datetime
import traceback

class RemoveContactHandler(BaseHandler):

    def _remove(self, _from_uuid, _user_uuid):
        _redis = self.application.redis
        _uuid = str(uuid.uuid1())
        _add = {
            "table": MessagePushTask.__tablename__,
            "key": "uuid."+_uuid,
            "values": {
                "uuid": _uuid,
                "message_type": MESSAGE_TYPE.NOTI,
                "message_subtype": MESSAGE_SUBTYPE.REMOVE_CONTACT,
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
        signal_dis_message({"task_uuid": _uuid})

        _class = getDBSessionClass()
        _session = _class()
        try:
            _session.query(UserContactData).filter(and_(UserContactData.user_uuid==_user_uuid, UserContactData.contact_uuid==_from_uuid)).delete()
            _session.query(UserContactData).filter(and_(UserContactData.user_uuid==_from_uuid, UserContactData.contact_uuid==_user_uuid)).delete()
            _session.commit()
        except:
            traceback.print_exc()
        finally:
            _class.remove()
               
    
    def _Task(self):
        super(RemoveContactHandler, self)._Task()

        _input = json.loads(self.request.body)
        if "user_uuid" not in _input or \
           "from_uuid" not in _input or \
           "device_uuid" not in _input:
            logging.error("Error for no para.")
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _user_uuid = _input["user_uuid"]
        _from_uuid = _input["from_uuid"]

        self.device_uuid = _input["device_uuid"]
        
        self._remove(_from_uuid, _user_uuid)
        #logging.info("REMOVECONTACT return (%s)." % (str(_rdata)))
        return
        
        
