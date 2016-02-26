# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Li Ning, ning.li@yvertical.com
#

from .basehandler import BaseHandler

from ppmessage.db.common.dbinstance import getDBSessionClass
from ppmessage.db.models import OAuthInfo

import json
import logging

class GetIntergrationTokenListHandler(BaseHandler):
    """
    requst:
    headers with X-x

    response:
    {
    error_code: 
    error_string:
    count:
    list: [
        {
            app_name: '',
            access_token: ''
        } 
    ]
    }

    """

    def _tokens(self):
        _list = []

        _session_class = getDBSessionClass()
        _session = _session_class()

        try:
            _all =  _session.query(OAuthInfo).filter(OAuthInfo.user_uuid==self.from_uuid).all()
            for _one in _all:
                _list.append({ 'app_name': _one.app_name, 'access_token': _one.access_token })
        except:
            pass
        finally:
            _session_class.remove()

        return _list

    def _post(self):
    
        _rdata = self.getReturnData()
        _rdata["count"] = 0
        _rdata["list"] = []

        _list = self._tokens()
        if _list is not None:
            _rdata["count"] = len(_list)
            _rdata["list"] = _list

        logging.info("GETINTERGRATIONTOKENLIST return (%s)." % (str(_rdata)))
        return

    def _Task(self):
        super(GetIntergrationTokenListHandler, self)._Task()
        _from_uuid = json.loads(self.request.body).get("from_uuid")
        if _from_uuid == None:
            logging.error("send message failed for input.")
            self.setErrorCode(API_ERR.NO_PARA)
            return
        self.from_uuid = _from_uuid
        self._post()
        
        
