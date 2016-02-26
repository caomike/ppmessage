# -*- coding: utf-8 -*-
# Copyright (C) 2010-2016 PPMessage.
#
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# core/redis.py
#

from mdm.db.common.copyrow import RowObject

from mdm.core.constant import REDIS_SQL_KEY
from mdm.core.constant import DATETIME_FORMAT

from sqlalchemy import DateTime
from sqlalchemy import String
from sqlalchemy import Boolean

import json
import logging
import datetime
import traceback

def redis_hash_to_dict(_redis, _cls, _uuid):
    if _uuid == None:
        logging.error("No hash with uuid None")
        return None
    
    _key = _cls.__tablename__ + ".uuid." + _uuid
    if _redis.exists(_key) == False:
        logging.error("No such key:%s." % (_key))
        return None

    _values = _redis.hgetall(_key)
    _d = {}
    for _i in _cls.__table__.columns:
        _v = _values.get(_i.name)
        
        if _v == None or _v == "None":
            _d[_i.name] = None
            continue
        _d[_i.name] = _v
        
        if isinstance(_i.type, DateTime):
            if len(_v) > 19:
                _v = datetime.datetime.strptime(_v, DATETIME_FORMAT["extra"])
            else:
                _v = datetime.datetime.strptime(_v, DATETIME_FORMAT["basic"])
            _d[_i.name] = _v
            continue
        
        if not isinstance(_i.type, String):
            _d[_i.name] = eval(_v)

    return _d

def row_to_redis_hash(_redis, _row):
    _d = {}

    for _f in _row.__table__.columns:
        _v = getattr(_row, _f.name)
        if _v is None:
            continue

        if isinstance(_f.type, DateTime):
            _d[_f.name] = _v.strftime(DATETIME_FORMAT["extra"])
        elif isinstance(_f.type, String):
            _d[_f.name] = _v
        else:
            _d[_f.name] = str(_v)

    _key = _row.__tablename__ + ".uuid." + _row.uuid
    _redis.hmset(_key, _d)
    return

def invalid_sql_result(_redis, _table):
    _names = _redis.smembers(REDIS_SQL_KEY + "." + _table)
    if _names == None or len(_names) == 0:
        return
    _redis.hdel(REDIS_SQL_KEY, *_names)
    return

def register_redis_sql(_redis, _table, _name):
    _key = REDIS_SQL_KEY + "." + _table
    if not _redis.sismember(_key, _name):
        _redis.sadd(_key, _name)
    return

def set_redis_sql(_redis, _name, _value):
    _redis.hset(REDIS_SQL_KEY, _name, _value)
    return

def get_redis_sql(_redis, _name):
    if not _redis.exists(REDIS_SQL_KEY):
        return None
    if not _redis.hexists(REDIS_SQL_KEY, _name):
        return None
    return _redis.hget(REDIS_SQL_KEY, _name)
