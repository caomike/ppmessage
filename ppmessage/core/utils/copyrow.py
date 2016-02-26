# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# 
#

from copy import deepcopy

class RowObject():
    def __init__(self, **args):
        self.__dict__.update(**args)

    def __repr__(self):
        return str(self.__dict__)

def copy_row_to_object(_row):
    if _row is None:
        return None
    
    _d = RowObject()
    for _f in _row.__table__.columns:
        setattr(_d, _f.name, deepcopy(getattr(_row, _f.name)))
    return _d

def copy_row_to_dict(_row):
    _d = {}
    for _f in _row.__table__.columns:
        _v = getattr(_row, _f.name)
        if _v == None:
            continue
        _d[_f.name] = deepcopy(_v)
    return _d

def copy_kp_to_object(_kp):
    if _kp is None:
        return None
    
    _d = RowObject()
    _k = _kp.keys()
    _len = len(_k)
    for _i in range(_len):
        setattr(_d, _k[_i], deepcopy(getattr(_kp, _k[_i])))
    return _d

def copy_dict_to_object(_dict):
    if not _dict:
        return None

    _d = RowObject()
    for _i in _dict:
        setattr(_d, _i, deepcopy(_dict[_i]))

    return _d
