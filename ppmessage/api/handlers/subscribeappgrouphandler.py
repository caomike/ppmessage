# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
# It is free for education and evaluation.
# If commercial and bussiness purpose or redistribution
# as free or non-free software please contact with the author.
# Other rights not metioned are all reserved.
#

from .basehandler import BaseHandler

from mdm.db.models import AppUserGroupData

from mdm.api.error import API_ERR

from mdm.core.srv.signal import signal_cache_add

import json
import uuid
import logging

class SubscribeAppGroupHandler(BaseHandler):
    """
    requst:
    header
    group_uuid

    response:
    application pacakge data or json with error_code

    """

    def _follow(self, _from_uuid):
        _group_uuid = json.loads(self.request.body).get("group_uuid")
        if _group_uuid is None:
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _redis = self.application.redis
        _key = AppUserGroupData.__tablename__ + ".group_uuid." \
               + _group_uuid + ".user_uuid." + _from_uuid
        if _redis.exists(_key):
            logging.info("SUBSCRIBE the app group which has been subscribed. Ignored.")
            return
        
        _uuid = str(uuid.uuid1())
        # create an appusergroupdata without hash key
        _add = {
            "table": AppUserGroupData.__tablename__,
            "values": {
                "uuid": _uuid,
                "group_uuid": _group_uuid,
                "user_uuid": _from_uuid
            }
        }
        signal_cache_add(_add)
        _redis.set(_key, _uuid)

        return

    def _Task(self):
        super(SubscribeAppGroupHandler, self)._Task()
        _from_uuid = json.loads(self.request.body).get("from_uuid")
        if _from_uuid == None:
            logging.error("send message failed for input.")
            self.setErrorCode(API_ERR.NO_PARA)
            return

        self._follow(_from_uuid)


