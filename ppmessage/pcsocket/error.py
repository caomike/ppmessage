# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

from ppmessage.core.constant import enum

DIS_ERR = enum(
    "NOERR",
    "NOUUIDS",
    "NOSERVICE",
    "NOEXTRA",
    "PARAM",
    "TYPE",
    "JSON",
    "MESSAGE",
)

def get_error_string(_code):
    _err = {
        DIS_ERR.NOERR: "success, nothing to say.",
        DIS_ERR.NOEXTRA: "no extra data for portal user.",
        DIS_ERR.NOUUIDS: "no app_uuid/user_uuid/device_uuid.",
        DIS_ERR.NOSERVICE: "no service/portal type.",
        DIS_ERR.PARAM: "parameters error.",
        DIS_ERR.TYPE: "no type provided or type is unknown.",
        DIS_ERR.JSON: "message data is not JSON.",
        DIS_ERR.MESSAGE: "message content is illegal.",
    }
    _str = _err.get(_code)
    if _str == None:
        _str = "unknown error, nothing to say."
    return _str
