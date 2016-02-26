# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
# All rights reserved
#

from mdm.core.constant import GENERIC_FILE_STORAGE_DIR

from tornado.web import StaticFileHandler

import logging

class AppDownloadHandler(StaticFileHandler):

    @classmethod
    def get_absolute_path(cls, root, path):
        _p = GENERIC_FILE_STORAGE_DIR + "/" + path
        return _p

    def get_content_type(self):
        logging.info(self.path)
        if self.path[-3:] == "ipa":
            return "application/octet-stream"
        if self.path[-3:] == "apk":
            return "application/vnd.android.package-archive"
        return "application/octet-stream"


