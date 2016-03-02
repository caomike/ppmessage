# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage YVertical.
# Guijin Ding, dingguijin@gmail.com
#
#

from ppmessage.db.models import FileInfo
from ppmessage.core.redis import redis_hash_to_dict
from ppmessage.bootstrap.data import BOOTSTRAP_DATA

import os
import uuid
import redis
import hashlib

def read_file(_redis, _uuid):
    if _uuid is None or len(_uuid) == 0:
        return None

    if _redis is None:
        return None

    _f = redis_hash_to_dict(_redis, FileInfo, _uuid)
    if _f is None:
        return None

    _r = None
    with open(_f.get("file_path")) as _file:
        _r = _file.read()
    return _r

def create_file_with_data(_redis, _data, _mime, _user_uuid, _file_name=None, _material_type=None):
    if _data == None or len(_data) == 0:
        return None
    
    _hash = hashlib.sha1(_data).hexdigest()
    _key = FileInfo.__tablename__ + ".file_hash." + _hash
    _uuid = _redis.get(_key)
    if _uuid != None:
        return _uuid
  
    _name = str(uuid.uuid1())
    if _file_name == None:
        _file_name = _name

    _store_dir = BOOTSTRAP_DATA.get("server").get("generic_store")
    _path = _store_dir + os.path.sep + _name
    _f = open(_path, "wb")
    _f.write(_data)
    _f.close()
    _row = FileInfo(**{
        "uuid": _name,
        "user_uuid": _user_uuid,
        "file_name": _file_name,
        "file_size": len(_data),
        "file_path": _path,
        "file_hash": _hash,
        "file_mime": _mime,
        "material_type": _material_type,
    })
    _row.async_add()
    _row.create_redis_keys(_redis)
    return _name

