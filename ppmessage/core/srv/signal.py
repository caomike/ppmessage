# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
# dispatcher/signal.py
#
# signal the srv let it action as the input dbhost name and task type
#
from ppmessage.core.constant import IOSPUSH_SRV
from ppmessage.core.constant import IOSPUSH_HOST
from ppmessage.core.constant import IOSPUSH_PORT

from ppmessage.core.constant import MQTTPUSH_SRV
from ppmessage.core.constant import MQTTPUSH_HOST
from ppmessage.core.constant import MQTTPUSH_PORT

from ppmessage.core.constant import GCMPUSH_SRV
from ppmessage.core.constant import GCMPUSH_HOST
from ppmessage.core.constant import GCMPUSH_PORT

from ppmessage.core.constant import PCSOCKET_SRV
from ppmessage.core.constant import PCSOCKET_HOST
from ppmessage.core.constant import PCSOCKET_PORT

from ppmessage.core.constant import DIS_SRV
from ppmessage.core.constant import DIS_HOST
from ppmessage.core.constant import DIS_PORT

from ppmessage.core.constant import CACHE_HOST
from ppmessage.core.constant import CACHE_PORT
from ppmessage.core.constant import CACHE_SRV

from ppmessage.core.constant import FUNC_HOST
from ppmessage.core.constant import FUNC_PORT
from ppmessage.core.constant import FUNC_SRV

from ppmessage.core.constant import SEND_HOST
from ppmessage.core.constant import SEND_PORT
from ppmessage.core.constant import SEND_SRV

from ppmessage.core.constant import DEV_MODE

from ppmessage.help.datetimeencoder import DateTimeEncoder

from tornado.httpclient import AsyncHTTPClient
from tornado.httpclient import HTTPClient
from tornado.httpclient import HTTPRequest
from tornado.httpclient import HTTPResponse

import json
import logging
import traceback
import tornado.ioloop

def _request(host, port, task_type, post_data, **args):
    _http = "http://"

    if port == PCSOCKET_PORT and DEV_MODE == False and task_type == PCSOCKET_SRV.PUSH:
        _http = "https://"

    url = _http + host + ":" + \
          str(port) + "/" + task_type

    http_headers = {}
    http_headers["Content-Type"] = "application/json"
    http_body = {}
    http_body["task_type"] = task_type
    for _k in post_data:
        http_body[_k] = post_data[_k]

    http_request = HTTPRequest(
        url,
        method='POST',
        headers=http_headers,
        validate_cert=False,
        body=json.dumps(http_body, cls=DateTimeEncoder),
        **args
    )
    
    return http_request

def async_signal(host, port, task_type, post_data):

    def _loop_request(host, port, task_type, post_data):
        def __handle_request(response):
            if response.error:
                _log = "Async HTTP Error: %s" % (response.error)
                logging.error(_log)
            return
        http_client = AsyncHTTPClient()
        http_client.fetch(_request(host, port, task_type, post_data), __handle_request)
        return
    
    tornado.ioloop.IOLoop.instance().add_callback(_loop_request, host, port, task_type, post_data)

    return

def signal(host, port, task_type, post_data):
    """
    sync version of signal, which should used in thread
    """

    #logging.info("SIGNAL with - type:%s, data:%s." % (task_type, str(post_data)))
    http_client = HTTPClient()
    _r = None
    try:
        _r = http_client.fetch(
            _request(
                host,
                port,
                task_type,
                post_data,
                request_timeout=1
            ))
    except:
        traceback.print_exc()
        return None
    
    return _r

def signal_cache_add_no_db(_data):
    return signal(CACHE_HOST,
                  CACHE_PORT,
                  CACHE_SRV.ADD_NO_DB,
                  _data)

def signal_cache_add(_data):
    return signal(CACHE_HOST,
                  CACHE_PORT,
                  CACHE_SRV.ADD,
                  _data)

def async_signal_cache_add(_data):
    return async_signal(CACHE_HOST,
                        CACHE_PORT,
                        CACHE_SRV.ADD,
                        _data)

def signal_cache_update(_data):
    return signal(CACHE_HOST,
                  CACHE_PORT,
                  CACHE_SRV.UPDATE,
                  _data)

def async_signal_cache_update(_data):
    return async_signal(CACHE_HOST,
                        CACHE_PORT,
                        CACHE_SRV.UPDATE,
                        _data)

def signal_cache_delete_no_db(_data):
    return signal(CACHE_HOST,
                  CACHE_PORT,
                  CACHE_SRV.DELETE_NO_DB,
                  _data)

def signal_cache_delete(_data):
    return signal(CACHE_HOST,
                  CACHE_PORT,
                  CACHE_SRV.DELETE,
                  _data)

def async_signal_cache_delete(_data):
    return async_signal(CACHE_HOST,
                        CACHE_PORT,
                        CACHE_SRV.DELETE,
                        _data)

def signal_cache_ping(_data):
    return signal(CACHE_HOST,
                  CACHE_PORT,
                  CACHE_SRV.PING,
                  _data)

def signal_dis_message(_data):
    return signal(DIS_HOST,
                  DIS_PORT,
                  DIS_SRV.MESSAGE_DIS,
                  _data)

def async_signal_dis_message(_data):
    return async_signal(DIS_HOST,
                        DIS_PORT,
                        DIS_SRV.MESSAGE_DIS,
                        _data)

def signal_func_function(_data):
    return signal(FUNC_HOST,
                  FUNC_PORT,
                  FUNC_SRV.FUNCTION,
                  _data)

def async_signal_func_function(_data):
    return async_signal(FUNC_HOST,
                        FUNC_PORT,
                        FUNC_SRV.FUNCTION,
                        _data)

def signal_pcsocket_kick(_data):
    return signal(PCSOCKET_HOST,
                  PCSOCKET_PORT,
                  PCSOCKET_SRV.KICK,
                  _data)

def async_signal_pcsocket_kick(_data):
    return async_signal(PCSOCKET_HOST,
                        PCSOCKET_PORT,
                        PCSOCKET_SRV.KICK,
                        _data)

def async_signal_pcsocket_push(_data):
    _pcsocket = _data.get("pcsocket")
    async_signal(_pcsocket.get("host"),
                 _pcsocket.get("port"),
                 PCSOCKET_SRV.PUSH,
                 _data)
    return

def signal_iospush_push(_data):
    return signal(IOSPUSH_HOST,
                  IOSPUSH_PORT,
                  IOSPUSH_SRV.PUSH,
                  _data)

def async_signal_iospush_push(_data):
    return async_signal(IOSPUSH_HOST,
                        IOSPUSH_PORT,
                        IOSPUSH_SRV.PUSH,
                        _data)

def async_signal_mqttpush_push(_data):
    return async_signal(MQTTPUSH_HOST,
                        MQTTPUSH_PORT,
                        MQTTPUSH_SRV.PUSH,
                        _data)

def async_signal_gcmpush_push(_data):
    return async_signal(GCMPUSH_HOST,
                        GCMPUSH_PORT,
                        GCMPUSH_SRV.PUSH,
                        _data)

def async_signal_send_send(_data):
    return async_signal(SEND_HOST,
                        SEND_PORT,
                        SEND_SRV.SEND,
                        _data)
