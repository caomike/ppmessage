
# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
# All rights reserved
#

from tornado.web import StaticFileHandler

import mimetypes
import logging

class MaterialFileHandler(StaticFileHandler):

    def get_content_type(self):
        logging.info(self.path)
        logging.info(self.get_argument("file_name"))
        _file_name = self.get_argument("file_name")
        mime_type, encoding = mimetypes.guess_type(_file_name)
        return mime_type

    def set_extra_headers(self, path):
        _file_name = self.get_argument("file_name")
        self.set_header("Content-Disposition", "attachment; filename=\"" + _file_name + "\"")
        self.set_header("Content-Transfer-Encoding", "binary")
        self.set_header("Content-Type", "application/octet-stream")


        

