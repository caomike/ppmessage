# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
# All rights reserved
#

from ppmessage.db.models import FileInfo
from ppmessage.core.redis import redis_hash_to_dict
from tornado.web import StaticFileHandler
from tornado.web import HTTPError

import logging
import os

class DownloadHandler(StaticFileHandler):

    _redis = None
    
    def set_headers(self):
        self.add_header("Access-Control-Allow-Origin", "*")
        self._add_filename_header()
        super(DownloadHandler, self).set_headers()

    def _add_filename_header(self):
        '''
        add filename header if `file_name` argument has provided
        '''
        file_name = self.get_argument("file_name", None)
        if file_name is not None:
            self.add_header("Content-Disposition", "attachment; filename=\"" + file_name + "\"")
    
    @classmethod
    def set_cls_redis(cls, _r):
        cls._redis = _r
        
    @classmethod
    def get_absolute_path(cls, root, path):
        if cls._redis is None:
            logging.error("Error for no redis set.")
            return None

        _file = redis_hash_to_dict(cls._redis, FileInfo, path)
        if _file == None:
            logging.error("Error no file:%s." % (path))
            return None

        return _file.get("file_path")

    def validate_absolute_path(self, root, absolute_path):
        # os.path.abspath strips a trailing /.
        # We must add it back to `root` so that we only match files
        # in a directory named `root` instead of files starting with
        # that prefix.
        root = os.path.abspath(root)
        # The trailing slash also needs to be temporarily added back
        # the requested path so a request to root/ will match.

        # fix NoneType bug
        absolute_path = absolute_path or ''
        
        if not (absolute_path + os.path.sep).startswith(root):
            raise HTTPError(403, "%s is not in root static directory",
                            self.path)
        if (os.path.isdir(absolute_path) and
            self.default_filename is not None):
            # need to look at the request.path here for when path is empty
            # but there is some prefix to the path that was already
            # trimmed by the routing
            if not self.request.path.endswith("/"):
                self.redirect(self.request.path + "/", permanent=True)
                return
            absolute_path = os.path.join(absolute_path, self.default_filename)
        if not os.path.exists(absolute_path):
            raise HTTPError(404)
        if not os.path.isfile(absolute_path):
            raise HTTPError(403, "%s is not a file", self.path)
        return absolute_path

    def get_content_type(self):
        _file = redis_hash_to_dict(self.application.redis, FileInfo, self.path)
        if _file is None:
            logging.error("Error no file:%s." % (self.path))
            return None
        return _file.get("file_mime")

