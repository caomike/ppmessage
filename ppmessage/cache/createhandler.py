# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from ppmessage.db.common.dbinstance import getDBSessionClass
from ppmessage.db.models import DeviceUser
from ppmessage.db.common.sqlmysql import BaseModel

from sqlalchemy import Boolean
from sqlalchemy import String
from sqlalchemy import DateTime

from time import strptime

import datetime
import logging
import traceback

def _class(tablename):
    for c in BaseModel._decl_class_registry.values():
        if hasattr(c, '__tablename__') and c.__tablename__ == tablename:
            return c
    return None
  
class CreateHandler():
    def __init__(self, _app):
        self.app = _app

    def task(self, _data):
        if "table" not in _data or "values" not in _data:
            logging.error("Error add request %s.", str(_data))
            return

        _cls = _class(_data["table"])
        if _cls == None:
            logging.error("Error for not db class for %s.", _data["table"])
            return
            
        _rowdata = _data["values"]

        if "createtime" in _rowdata:
            del(_rowdata["createtime"])
        if "updatetime" in _rowdata:
            del(_rowdata["updatetime"])

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

        #logging.info("Adding db: %s. " % _data)
        
        _rowdata["createtime"] = datetime.datetime.now()
        _rowdata["updatetime"] = _rowdata["createtime"]
        _o = _cls(**_rowdata)
        
        _sessionclass = getDBSessionClass()
        _session = _sessionclass()
        _session.add(_o)
        
        try:
            _session.commit()
        except:
            _session.rollback()
            traceback.print_exc()
        finally:
            _sessionclass.remove()

        return


