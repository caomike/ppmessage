# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from ppmessage.core.srv.signal import signal_cache_add
from ppmessage.core.srv.signal import signal_cache_delete

from ppmessage.db.models import OrgUserGroupData

from ppmessage.api.error import API_ERR

import logging
import datetime
import traceback
import json
import uuid

class RemoveOGUserHandler(BaseHandler):

    def _input_data(self):
        self.input_data = json.loads(self.request.body)
        if "group_uuid" not in self.input_data \
           or "user_uuid" not in self.input_data:
            self.writeError(API_ERR.NO_PARA)
            return False
        return True

    def _remove(self):
        _redis = self.application.redis
        
        _group_uuid = self.input_data.get("group_uuid")
        _group_uuid = self.input_data.get("user_uuid")
        _key = OrgUserGroupData.__tablename__ + ".group_uuid." + _group_uuid + ".user_uuid." + _user_uuid

        _data_uuid = _redis.get(_key)
        _redis.delete(_key)
        
        _delete = {
            "table": OrgUserGroupData.__tablename__,
            "key": "uuid." + _data_uuid,
            "values": {
                "uuid": _data_uuid
            },
        }
        signal_cache_delete(_delete)
        
        return True

    def _remove(self):

        if self._input_data() is False:
            return

        if self._remove() is False:
            return
        
        return

    def _Task(self):
        super(RemoveOGUserHandler, self)._Task()

        logging.info("REQUESTJOINOGHANDLER with %s." % (self.request.body))
        self._remove()

        return
