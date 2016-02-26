# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Li Ning, ning.li@yvertical.com
#

from .basehandler import BaseHandler

from ppmessage.api.error import API_ERR

from ppmessage.db.common.dbinstance import getDBSessionClass
from ppmessage.db.models import OAuthInfo

import json
import logging

class UnsetIntergrationTokenHandler(BaseHandler):
    """
    requst:
    headers with X-x

    response:
    {
    error_code: 
    error_string:
    }

    """

    def _unset(self, _request):
        logging.info(_request)

        if 'app_name' not in _request or 'from_uuid' not in _request:
            return self.setErrorCode(API_ERR.NO_PARA)

        app_name = _request['app_name']
        from_uuid = _request['from_uuid']

        _session_class = getDBSessionClass()
        _session = _session_class()

        try:
            _session.query(OAuthInfo).filter(OAuthInfo.user_uuid==from_uuid).filter(OAuthInfo.app_name==app_name).delete()
            _session.commit()
        except:
            return self.setErrorCode(API_ERR.SYS_ERR)
        finally:
            _session_class.remove()

    def _Task(self):
        super(UnsetIntergrationTokenHandler, self)._Task()
        self._unset(json.loads(self.request.body))
        
        
