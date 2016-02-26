# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#

from .basehandler import BaseHandler

from ppmessage.db.models import FileInfo

import uuid
import json
import logging
import datetime

"""
check file is already exist in server by file sha-1

request: { "digest" : "xxxxxxxxxxxxxxxxx" }
return: { "existed" : true, "fid":"xxxxxxx-xxxxxxx-xxxxxxx-xxxx" }

"""
class FileIsExistedHandler(BaseHandler):

    """
    Query fileId by fileHash
    """
    def _getFileId(self, _digest):
        _redis = self.application.redis
        _key = FileInfo.__tablename__ + ".file_hash." + _digest
        return _redis.get(_key)
    
    def _Task(self):
        super(FileIsExistedHandler, self)._Task()

        _input = json.loads(self.request.body)
        _digest = _input.get("digest")
        if _digest == None:
            logging.error("Error for no para.")
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _fileId = self._getFileId(_digest)
        _r = self.getReturnData()
        
        _r["existed"] = _fileId != None
        _r["fid"] = _fileId
        return
