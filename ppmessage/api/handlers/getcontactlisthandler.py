# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# 
#

from .basehandler import BaseHandler

from mdm.api.error import API_ERR
from mdm.core.constant import YVOBJECT

from mdm.db.common.dbinstance import getDBSessionClass
from mdm.db.models import UserContactData

import json
import logging
import traceback

class GetContactListHandler(BaseHandler):
    """
    requst:
    response:
    {
    error_code: 
    error_string:
    count:
    list: [
    user_id_1,
    user_id_2,
    ]
    }

    """

    def _Task(self):
        super(GetContactListHandler, self)._Task()
        _from_uuid = json.loads(self.request.body).get("from_uuid")
        if _from_uuid == None:
            logging.error("send message failed for input.")
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _s = set()
        _class = getDBSessionClass()
        _session = _class()
        try:
            _all = _session.query(UserContactData.contact_uuid).filter(UserContactData.user_uuid==_from_uuid).all()
            for _i in _all:
                _s.add(_i.contact_uuid)
        except:
            traceback.print_exc()
        finally:
            _class.remove()
            
        _rdata = self.getReturnData()
        _rdata["count"] = len(_s)
        _rdata["list"] = list(_s)

        #logging.info("GETCONTACTLIST return %d.", len(_s))
        return

        
        
