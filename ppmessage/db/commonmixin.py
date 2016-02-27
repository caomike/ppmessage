# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights are reserved
#

from ppmessage.core.srv.signal import async_signal_cache_add
from ppmessage.core.srv.signal import async_signal_cache_delete
from ppmessage.core.srv.signal import async_signal_cache_update

from ppmessage.core.redis import invalid_sql_result
from ppmessage.core.utils.copyrow import copy_row_to_dict

from sqlalchemy import Column
from sqlalchemy import String
from sqlalchemy import DateTime

import uuid
import logging
import datetime

def _async_add(_obj):
    _values = copy_row_to_dict(_obj)
    _add = {
        "table": _obj.__tablename__,
        "key": "uuid." + _obj.uuid,
        "values": _values
    }
    async_signal_cache_add(_add)
    return

def _async_update(_obj):
    _values = copy_row_to_dict(_obj)

    if "uuid" not in _values:
        logging.error("error to update for no uuid %s" % str(_values))
        return
    del _values["uuid"]

    _update = {
        "table": _obj.__tablename__,
        "key": "uuid." + _obj.uuid,
        "values": _values
    }
    async_signal_cache_update(_update)
    return

def _async_delete(_obj):
    _del = {
        "table": _obj.__tablename__,
        "values": {"uuid": _obj.uuid}
    }
    async_signal_cache_delete(_del)
    return
    
def _create_redis_hash(_obj, _redis, _is_update=False, _is_load=False):
    _key = _obj.__tablename__ + \
           ".uuid." + _obj.uuid

    _now = datetime.datetime.now()

    if _is_load == True:
        pass
    elif _is_update == True:
        _obj.updatetime = _now
    else:
        _obj.createtime = _now
        _obj.updatetime = _now

    _d = {}
    for _f in _obj.__table__.columns:
        _v = getattr(_obj, _f.name)
        
        if _v is None:
            continue

        if isinstance(_f.type, DateTime):
            _d[_f.name] = _v.strftime("%Y-%m-%d %H:%M:%S %f")
            continue

        if isinstance(_f.type, String):
            _d[_f.name] = _v
            continue

        # if not string, then string
        _d[_f.name] = str(_v)

    _redis.hmset(_key, _d)
    return
    
def _delete_redis_hash(_obj, _redis):
    _key = _obj.__tablename__ + \
           ".uuid." + _obj.uuid
    _redis.delete(_key)
    return

class CommonMixin(object):
    uuid = Column('uuid', String(64), primary_key=True)
    updatetime = Column("updatetime", DateTime)
    createtime = Column("createtime", DateTime)

    def before_create(self, _handler):
        self.uuid = str(uuid.uuid1())
        return
    
    def after_create(self, _handler):
        self.create_redis_keys(_handler.application.redis)
        return
        
    def before_delete(self, _handler):
        self.delete_redis_keys(_handler.application.redis)
        return

    def create_redis_keys(self, _redis, *args, **kwargs):
        _create_redis_hash(self, _redis, *args, **kwargs)
        self.invalid_redis_sql(_redis)
        return

    def update_redis_keys(self, _redis):
        _create_redis_hash(self, _redis, _is_update=True)
        return
    
    def delete_redis_keys(self, _redis):
        _delete_redis_hash(self, _redis)
        self.invalid_redis_sql(_redis)
        return
    
    def async_add(self):
        _async_add(self)
        return

    def async_update(self):
        _async_update(self)
        return

    def async_delete(self):
        _async_delete(self)
        return
    
    def invalid_redis_sql(self, _redis):
        invalid_sql_result(_redis, self.__tablename__)
        return
