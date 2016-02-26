# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from .basehandler import BaseHandler

from mdm.db.models import AppUserGroupData

from mdm.core.srv.signal import signal_cache_delete

from mdm.api.error import API_ERR

import json
import logging

class UnSubscribeAppGroupHandler(BaseHandler):
    """
    requst:
    header
    app_id

    response:
    application pacakge data or json with error_code

    """
    def _un(self, _from_uuid):
        _json = json.loads(self.request.body)
        if "group_uuid" not in _json:
            logging.error("Error no para.")
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _redis = self.application.redis
        _group_uuid = _json["group_uuid"]
        _user_uuid = _from_uuid

        # accleration
        _key = AppUserGroupData.__tablename__+ \
               ".group_uuid." + _group_uuid + \
               ".user_uuid." + _user_uuid

        if not _redis.exists(_key):
            logging.info("UNSUBSCRIBE not subed app group. Ignored")
            return
        
        _uuid = _redis.get(_key)
        _redis.delete(_key)

        # database
        _delete = {
            "table": AppUserGroupData.__tablename__,
            "key": "uuid." + _uuid,
            "values": {
                "uuid": _uuid,
            },
        }
        signal_cache_delete(_delete)

    def _Task(self):
        super(UnSubscribeAppGroupHandler, self)._Task()
        _from_uuid = json.loads(self.request.body).get("from_uuid")
        if _from_uuid == None:
            logging.error("send message failed for input.")
            self.setErrorCode(API_ERR.NO_PARA)
            return
        self._un(_from_uuid)
        return

