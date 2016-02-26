# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
# All rights reserved
#

from ppmessage.core.constant import IDENTICON_FILE_STORAGE_DIR
from tornado.web import StaticFileHandler
from tornado.web import HTTPError

import logging
import os

class IdenticonHandler(StaticFileHandler):

    def _add_filename_header(self):
        '''
        add filename header if `file_name` argument has provided
        '''
        file_name = self.get_argument("file_name", None)
        if file_name is not None:
            self.add_header("Content-Disposition", "attachment; filename=\"" + file_name + "\"")

    def set_headers(self):
        self.add_header("Access-Control-Allow-Origin", "*")
        self._add_filename_header()
        super(IdenticonHandler, self).set_headers()
            
    @classmethod
    def get_absolute_path(cls, root, path):
        _p = IDENTICON_FILE_STORAGE_DIR + "/" + path
        return _p

    def validate_absolute_path(self, root, absolute_path):
        # os.path.abspath strips a trailing /.
        # We must add it back to `root` so that we only match files
        # in a directory named `root` instead of files starting with
        # that prefix.
        root = os.path.abspath(root)
        # The trailing slash also needs to be temporarily added back
        # the requested path so a request to root/ will match.
        
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
