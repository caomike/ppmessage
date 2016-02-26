# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#

from ppmessage.db.common.dbinstance import getDBSessionClass
from ppmessage.db.common.sqlmysql import BaseModel

# fake load db models
from ppmessage.db.models import DeviceUser
import traceback
import logging

def _get_class_by_tablename(tablename):
  """Return class reference mapped to table.

  :param tablename: String with name of table.
  :return: Class reference or None.
  """
  for c in BaseModel._decl_class_registry.values():
    if hasattr(c, '__tablename__') and c.__tablename__ == tablename:
      return c
  return None

class DeleteHandler():
    def __init__(self, _app):
        self.app = _app
    
    def task(self, _data):
        if "table" not in _data or\
           "values" not in _data:
            logging.error("Error add request %s.", str(_data))
            return

        _cls = _get_class_by_tablename(_data["table"])
        if _cls == None:
            logging.error("Error for not db class for %s.", _data["table"])
            return
        
        _rowdata = _data["values"]        
        _sessionclass = getDBSessionClass()
        _session = _sessionclass()
        try:
            _session.query(_cls).filter_by(**_rowdata).delete()
            _session.commit()
        except:
            _session.rollback()
            traceback.print_exc()
        finally:
            _sessionclass.remove()

        return

