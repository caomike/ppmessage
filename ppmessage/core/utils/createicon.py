# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 YVertical.
# Guijin Ding, dingguijin@gmail.com
#
#

from mdm.help.identicon import Identicon
from mdm.help.getipaddress import getIPAddress

from mdm.core.imageconverter import ImageConverter

from mdm.db.models import DeviceUser
from mdm.db.models import FileInfo

from mdm.core.constant import DEV_MODE
from mdm.core.constant import PORTAL_PORT
from mdm.core.constant import PRODUCTION_HOST
from mdm.core.constant import IDENTICON_FILE_STORAGE_DIR

import hashlib

def _icon_url(_file_name):
    _post = "/identicon/" + _file_name
    _url = "https://" + PRODUCTION_HOST + _post
    if DEV_MODE == True:
        _url = "http://" + getIPAddress() + ":" + str(PORTAL_PORT) + _post
    return _url

def create_user_icon(_uuid):
    _image = Identicon(_uuid, 64)
    _image = _image.draw_image()
    _file_name = _uuid + ".png"
    _path = IDENTICON_FILE_STORAGE_DIR + "/" + _file_name
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
    _file_path = IDENTICON_FILE_STORAGE_DIR + "/" + _file_name
    _file = open(_file_path, "wb")
    _file.write(_data)
    _file.close()
    return _icon_url(_file_name)
