# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# Guijin Ding, dingguijin@gmail.com
#
#

from ppmessage.core.constant import MESSAGE_SUBTYPE
from ppmessage.core.constant import MESSAGE_TYPE
from ppmessage.core.constant import APNS_TITLE

import logging

def push_title(_type, _subtype, _body, _lang):
    if _type != MESSAGE_TYPE.NOTI:
        return ""

    _title = APNS_TITLE.get(_lang.upper())
    if _title == None:
        logging.error("No APNS_TITLE for language: %s, using en_us." % (_lang))
        _title = APNS_TITLE.get("EN_US")
            
    _alert = ""
    if _subtype == MESSAGE_SUBTYPE.TEXT:
        _alert += _body
    elif _subtype == MESSAGE_SUBTYPE.TXT:
        _alert += _title.get("TXT")
    elif _subtype == MESSAGE_SUBTYPE.GPS_LOCATION:
        _alert += _title.get("GPS")
    elif _subtype == MESSAGE_SUBTYPE.AUDIO:
        _alert += _title.get("AUDIO")
    elif _subtype == MESSAGE_SUBTYPE.IMAGE:
        _alert += _title.get("IMAGE")
    elif _subtype == MESSAGE_SUBTYPE.SINGLE_CARD:
        _alert += _title.get("SINGLE_CARD")
    elif _subtype == MESSAGE_SUBTYPE.MULTIPLE_CARD:
        _alert += _title.get("MULTIPLE_CARD")
    elif _subtype == MESSAGE_SUBTYPE.FILE:
        _alert += _title.get("FILE")
    elif _subtype == MESSAGE_SUBTYPE.INVITE_CONTACT:
        _alert += _title.get("INVITE")
    elif _subtype == MESSAGE_SUBTYPE.ACCEPT_CONTACT:
        _alert += _title.get("ACCEPT")
    elif _subtype == MESSAGE_SUBTYPE.DG_INVITED:
        _alert += _title.get("DG_INVITED")
    else:
        logging.error("not supported message %s" % _subtype)
        _alert += _title.get("UNKNOWN")
            
    return _alert
