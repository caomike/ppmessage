# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#

from .basehandler import BaseHandler

from ppmessage.db.models import FileInfo
from ppmessage.core.redis import redis_hash_to_dict

import uuid
import json
import logging
import datetime

class CreateFilerefHandler(BaseHandler):
    
    def _create(self, _from_uuid, _uuid):
        _redis = self.application.redis
        _info = redis_hash_to_dict(_redis, FileInfo, _uuid)
        if _info == None:
            return None

        if _info.get("user_uuid") == _from_uuid:
            return _uuid

        _new_uuid = str(uuid.uuid1())
        _values = {
            "uuid": _new_uuid,
            "file_ref": _uuid,
            "material_type": _info.get("material_type"),
            "file_hash": _info.get("file_hash"),
            "file_mime": _info.get("file_mime"),
            "file_name": _info.get("file_name"),
            "file_size": _info.get("file_size"),
            "file_path": _info.get("file_path"),
            "thumbnail_uuid": _info.get("thumbnail_uuid"),
        }
        _row = FileInfo(**_values)
        _row.async_add()
        _row.create_redis_keys(self.application.redis)
        return _new_uuid
    
    def _Task(self):
        super(CreateFilerefHandler, self)._Task()

        _input = json.loads(self.request.body)
        _uuid = _input.get("uuid")
        _from_uuid = _input.get("from_uuid")
        if _uuid == None or _from_uuid == None:
            logging.error("Error for no para.")
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _file = self._create(_from_uuid, _uuid)
        _r = self.getReturnData()
        
        _r["existed"] = False
        _r["fid"] = _file
        if _file != None:
            _r["existed"] = True
        return
        
        
