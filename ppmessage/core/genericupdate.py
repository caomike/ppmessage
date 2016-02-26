# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
# All rights are reserved
#
# generic_update.py
# update db with a generic method
#

def generic_update(_redis, _cls, _uuid, _data):
    _key = _cls.__tablename__ + ".uuid." + _uuid
    if not _redis.exists(_key):
        return False

    _name_list = []
    for _column in _cls.__table__.columns:
        _name_list.append(_column.name)

    _values = {"uuid": _uuid}
    for _i in _data:
        if _i not in _name_list:
            continue
        _values[_i] = _data.get(_i)

    if len(_values) == 1:
        return False
    
    _row = _cls(**_values)
    _row.async_update()
    _row.update_redis_keys(_redis)
    return True

