# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 YVertical.
# Guijin Ding, dingguijin@gmail.com
#
#

from .identicon import Identicon
from .getipaddress import getIPAddress

from ppmessage.db.models import DeviceUser
from ppmessage.db.models import FileInfo
from ppmessage.bootstrap.data import BOOTSTRAP_DATA
from ppmessage.core.imageconverter import ImageConverter

import os
import hashlib

def _icon_url(_file_name):
    _post = "/identicon/" + _file_name
    _server_name = BOOTSTRAP_DATA.get("server").get("name")
    _ssl = BOOTSTRAP_DATA.get("nginix").get("ssl")
    _protocol = "http"
    if _ssl == "yes":
        _protocol = "https"
    _url = _protocol + "://" + _server_name + _post
    return _url

def create_user_icon(_uuid):
    _image = Identicon(_uuid, 64)
    _image = _image.draw_image()
    _file_name = _uuid + ".png"
    _identicon_store = BOOTSTRAP_DATA.get("nginx").get("identicon_store")
    _path = IDENTICON_FILE_STORAGE_DIR + os.path.sep + _file_name
    _image.save(_path)
    return _icon_url(_file_name)

def create_group_icon(_redis, _users):
    if len(_users) == 0:
        return None
    
    _icon_list = []
    for _uuid in _users:
        _user_key = DeviceUser.__tablename__ + ".uuid." + _uuid
        _user_icon = _redis.hget(_user_key, "user_icon")
        if _user_icon == None:
            _icon_list.append(_user_icon)
            continue
        _file_key = FileInfo.__tablename__ + ".uuid." + _user_icon
        _file_path = _redis.hget(_file_key, "file_path")
        _icon_list.append(_file_path)

    _data = ImageConverter.conversation_icon(_icon_list)
    if _data == None:
        logging.error("conversation icon data is None, will not create icon file")
        return None
    _file_name = hashlib.sha1("".join(_users)).hexdigest() + ".png"
    _identicon_store = BOOTSTRAP_DATA.get("nginx").get("identicon_store")
    _file_path = _identicon_store + os.path.sep + _file_name
    _file = open(_file_path, "wb")
    _file.write(_data)
    _file.close()
    return _icon_url(_file_name)
