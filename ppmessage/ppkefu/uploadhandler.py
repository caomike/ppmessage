# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage YVertical.
# Guijin Ding, dingguijin@gmail.com
#
# All rights reserved
#

from ppmessage.db.models import FileInfo
from ppmessage.core.constant import GENERIC_FILE_STORAGE_DIR
from ppmessage.core.srv.signal import signal_cache_add

from tornado.web import RequestHandler
from hashlib import sha1

import os
import stat
import uuid
import logging
import json
import base64

class UploadHandler(RequestHandler):

    def post(self, id=None):

        _upload_type = self.get_argument("upload_type", default=None)
        if _upload_type is None:
            logging.error("No upload_type set.")
            return
        
        if _upload_type == "file":
            _list = self.request.files.get("file")
            if _list is None or len(_list) == 0:
                logging.error("No files with upload_file input name")
                return

            _file_name = _list[0]["filename"]
            _file_body = _list[0]["body"]
            _file_mime = _list[0]["content_type"]


        elif _upload_type == "content_txt":
            _file_body = self.get_argument("content_txt")
            if isinstance(_file_body, unicode):
                _file_body = _file_body.encode("utf-8")
            _file_mime = "text/plain"
            _file_name = "txt"

        elif _upload_type == "content_icon":
            _file_body = self.get_argument("content_icon")
            if isinstance(_file_body, unicode):
                _file_body = _file_body.encode("utf-8")
            _file_body = _file_body.split("data:image/png;base64,", 1)[1]
            _file_body = base64.decodestring(_file_body)
            _file_mime = "image/png"
            _file_name = "icon"

        elif _upload_type == "content_html":
            _file_body = self.get_argument("content_html")
            _file_mime = "text/html"
            _file_name = "html"

        else:
            logging.error("Error can not handle %s." % (_upload_type))
            return

        _file_sha1 = sha1(_file_body).hexdigest()
        _new_name = str(uuid.uuid1())
        _new_path = GENERIC_FILE_STORAGE_DIR + "/" + _new_name
        with open(_new_path, "wb") as _new_file:
            _new_file.write(_file_body)

        _stat_result = os.stat(_new_path)
        _file_size = _stat_result[stat.ST_SIZE]

        # FIXME: md5 as key to determine, is there duplicated content
        _values = {
            "uuid": _new_name,
            "file_mime": _file_mime,
            "file_name": _file_name,
            "file_size": _file_size,
            "file_hash": _file_sha1,
            "file_path": _new_path
        }
        
        _row = FileInfo(**_values)
        _row.create_redis_keys(self.application.redis)
        _row.async_add()
                
        _r = {}
        _r["fid"] = _new_name
        _r["mime"] = _file_mime
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Content-Type", "application/json")
        self.write(json.dumps(_r))
        return


