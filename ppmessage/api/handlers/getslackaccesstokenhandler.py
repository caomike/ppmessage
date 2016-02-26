# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#

from .basehandler import BaseHandler
from ppmessage.db.common.dbinstance import getDBSessionClass
from ppmessage.db.models import OAuthInfo

import json
import logging

class GetSlackAccessTokenHandler(BaseHandler):
    
    def _token(self, _from_uuid):
        _session_class = getDBSessionClass()
        _session = _session_class()

        try:
            _one =  _session.query(OAuthInfo).filter(OAuthInfo.user_uuid==_from_uuid).\
                    filter(OAuthInfo.app_name=='SLACK').scalar()
            return _one.access_token
        except:
            pass
        finally:
            _session_class.remove()

        return ''
    
    def _Task(self):
        super(GetSlackAccessTokenHandler, self)._Task()
        
        _request = json.loads(self.request.body)
        if "from_uuid" not in _request:
            self.setErrorCode(API_ERR.NO_PARA)
            return
        _from_uuid = _request.get("from_uuid")
        
        _rdata = self.getReturnData()
        _rdata["slack_token"] = self._token(_from_uuid)

        logging.info("GETSLACKACCESSTOKEN return (%s)." % (str(_rdata)))
        return
        
        
