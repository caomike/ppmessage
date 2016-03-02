# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

from ppmessage.db.models import FileInfo
from ppmessage.core.redis import redis_hash_to_dict
from ppmessage.bootstrap.data import BOOTSTRAP_DATA

from tornado.web import RequestHandler
from shutil import move
from hashlib import sha1

import json
import uuid
import logging

import redis

class UploadFileHandler(RequestHandler):

    def get(self):
        self.write('Hello Upload')

    def post(self):

        logging.info(self.request.body)
        _field_name = "file"
        _field_file_name = _field_name + ".name"
        _field_file_path = _field_name + ".path"
        _field_file_type = _field_name + ".content_type"
        _field_file_size = _field_name + ".size"
        
        _file_name = self.get_argument(_field_file_name, default=None)
        _file_path = self.get_argument(_field_file_path, default=None)
        _file_type = self.get_argument(_field_file_type, default=None)
        _file_size = self.get_argument(_field_file_size, default=None)

        _material_type = self.get_argument("material_type", default=None)
        _user_uuid = self.get_argument("user_uuid", default=None)

        self.set_header("Access-Control-Allow-Origin", "*")
        if _file_name is None \
           or _file_path is None \
           or _file_type is None \
           or _file_size is None:
            logging.error("Error for input params")
            self.send_error()
            return

        _file_sha1 = None
        with open(_file_path, "r") as _r:
            _d = _r.read()
            _file_sha1 = sha1(_d).hexdigest()

        if _file_sha1 == None:
            logging.error("sha1 meets error")
            self.send_error()
            return

        _r = {}
        _redis = self.application.redis
        _key = FileInfo.__tablename__ + ".file_hash." + _file_sha1
        _uuid = _redis.get(_key)
        if _uuid != None:
            logging.info("get the same file: %s, %s" % (_uuid, _file_name)) 
            # FIXME: check user name and file name
            # messageboy hold the file name
            #if _user_uuid == _old["user_uuid"]:
            _r["fuuid"] = _uuid
            self.write(json.dumps(_r))
            logging.info(_r)
            return 

        _fuuid = str(uuid.uuid1())
        _server_config = BOOTSTRAP_DATA.get("server")
        _generic_store = _server_config.get("generic_store")
        _new_path = _generic_store + os.path.sep + _fuuid
        move(_file_path, _new_path)

        _add = {
            "uuid": _fuuid,
            "file_name": _file_name,
            "file_size": _file_size,
            "file_hash": _file_sha1,
            "file_path": _new_path,
            "file_mime": _file_type,
            "material_type": _material_type,
            "user_uuid": _user_uuid,
        }
        _row = FileInfo(**_add)
        _row.create_redis_keys(_redis)
        _row.async_add()

        _r = {}
        _r["fuuid"] = _fuuid
        #self.set_header("Content-Type", "application/json")
        self.set_header("Access-Control-Allow-Origin", "*")
        self.write(json.dumps(_r))
        logging.info(str(_r))
        return
