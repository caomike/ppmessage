# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# Guijin Ding, dingguijin@gmail.com
#
#

from ppmessage.db.common.dbinstance import getDBSessionClass
from ppmessage.db.common.sqlmysql import BaseModel
from ppmessage.db.models import DeviceUser

from sqlalchemy import String
from sqlalchemy import DateTime
from sqlalchemy import Boolean

from time import strptime
import logging
import datetime
import traceback

def _get_class_by_tablename(tablename):
    """Return class reference mapped to table.

    :param tablename: String with name of table.
    :return: Class reference or None.
    """
    for c in BaseModel._decl_class_registry.values():
        if hasattr(c, '__tablename__') and c.__tablename__ == tablename:
            return c
    return None

class UpdateHandler():
  
    def __init__(self, _app):
        self.app = _app

    def task(self, _data):
        if "table" not in _data or \
           "values" not in _data or \
           "key" not in _data:
            logging.error("update not enough parameters: %s" % str(_data))
            return

        #logging.info("update with %s" % str(_data))

        _cls = _get_class_by_tablename(_data["table"])
        if _cls == None:
            logging.error("no db class for %s.", _data["table"])
            return
        
        _kd = {}
        _key = _data["key"].split(".")
        _kd[_key[0]] = _key[1]
        
        _rowdata = _data["values"]
        if "createtime" in _rowdata:
            del _rowdata["createtime"]
        if "updatetime" in _rowdata:
            del _rowdata["updatetime"]
            
        for i in _cls.__table__.columns:
            if i.name not in _rowdata:
                continue

            if isinstance(i.type, String):
                continue

            if isinstance(i.type, Boolean):
                continue
            
            if isinstance(i.type, DateTime):
                _v = _rowdata.get(i.name)
                if len(_v) > 19:
                    _v = datetime.datetime.strptime(_v, "%Y-%m-%d %H:%M:%S %f")
                else:
                    _v = datetime.datetime.strptime(_v, "%Y-%m-%d %H:%M:%S")
                _rowdata[i.name] = _v
                continue
              
            if not isinstance(_rowdata[i.name], str):
                continue

            _rowdata[i.name] = eval(_rowdata[i.name])
            
        _sessionclass = getDBSessionClass()
        _session = _sessionclass()
        try:
            _i = _session.query(_cls).filter_by(**_kd).scalar()
            if not _i:
                logging.error("update %s to:%s with:%s" % (_data["table"], str(_rowdata), str(_kd)))
                return
            
            for _k in _rowdata:
                setattr(_i, _k, _rowdata[_k])
            _i.updatetime = datetime.datetime.now()
            _session.commit()
        except:
            _session.rollback()
            traceback.print_exc()
        finally:
            _sessionclass.remove()

        return

