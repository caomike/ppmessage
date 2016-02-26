# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
# All rights reserved
#

from ppmessage.db.models import FileInfo
from ppmessage.core.redis import hash_row

from tornado.web import StaticFileHandler

import logging

class UserIconDownloadHandler(StaticFileHandler):

    _redis = None
    
    @classmethod
    def set_cls_redis(cls, _r):
        cls._redis = _r
        
    @classmethod
    def get_absolute_path(cls, root, path):
        if cls._redis is None:
            logging.error("Error for no redis set.")
            return None

        path = path[len("user_icon/"):]
        _file = hash_row(
            cls._redis,
            FileInfo,
            "uuid." + path
        )

        if _file is None:
            logging.error("Error no file:%s." % (path))
            return None

        return _file.file_path


    def get_content_type(self):
        _file = hash_row(
            self.application.redis,
            FileInfo,
            "uuid." + self.path
        )
        
        if _file is None:
            logging.error("Error no file:%s." % (self.path))
            return None
            
        return _file.file_mime

