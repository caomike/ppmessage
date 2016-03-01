# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

"""
bootstrap is the first command to run. It create
the first user and team of the system, all api keys
for the first team. Save the data to db and generate
a python file which includes the db data. To run 
PPMessage system, definitely it is the first step.

Edit the config.py to choose your user name, user email, password and etc.

Bootstrap!

"""

try:
    from ppmessage.core.constant import API_LEVEL
except:
    print('\033[1;31;40m')
    print("PPMessage requirements not ready. Please run `scripts/require.py`")
    print('\033[0m')
    import sys
    sys.exit()

from config import BOOTSTRAP_CONFIG

from ppmessage.db.models import AppInfo
from ppmessage.db.models import ApiInfo
from ppmessage.db.models import AdminUser
from ppmessage.db.models import DeviceUser
from ppmessage.db.models import AppUserData    
from ppmessage.db.models import APNSSetting

from ppmessage.db.dbinstance import getDBSessionClass
from ppmessage.core.constant import API_LEVEL

import os
import sys
import json
import uuid
import copy
import base64
import hashlib
import datetime
import traceback

def _encode(_key):
    _key = hashlib.sha1(_key).hexdigest()
    _key = base64.b64encode(_key)
    return _key

def _check_bootstrap_config():
    _fields = ["team", "user", "db", "redis", "nginx", "ios"]
    for _field in _fields:
        if _field not in BOOTSTRAP_CONFIG:
            print("%s not provided in BOOTSTAP_CONFIG" % _field)
            return None
    _config = copy.deepcopy(BOOTSTRAP_CONFIG)
    return _config

def _create_bootstrap_admin_user(_session, _config):
    _config = _config.get("user")
    _admin = AdminUser(
        createtime=datetime.datetime.now(),
        updatetime=datetime.datetime.now(),
        uuid=str(uuid.uuid1()),
        user_email=_config.get("user_email"),
        user_password=hashlib.sha1(_config.get("user_password")).hexdigest(),
        user_fullname=_config.get("user_fullname"),
        user_firstname=_config.get("user_firstname"),
        user_lastname=_config.get("user_lastname"),
        user_language=_config.get("user_language")
    )
    _session.add(_admin)
    _session.commit()
    _config["admin_uuid"] = _admin.uuid
    return _config

def _create_bootstrap_first_user(_session, _config):
    _config = _config.get("user")
    _user = DeviceUser(
        createtime=datetime.datetime.now(),
        updatetime=datetime.datetime.now(),
        uuid=str(uuid.uuid1()),
        user_email=_config.get("user_email"),
        user_password=hashlib.sha1(_config.get("user_password")).hexdigest(),
        user_fullname=_config.get("user_fullname"),
        user_firstname=_config.get("user_firstname"),
        user_lastname=_config.get("user_lastname"),
        user_language=_config.get("user_language"),
        user_status=USER_STATUS.OWNER_2,
        is_anonymous_user=False,
    )
    _session.add(_user)
    _session.commit()
    _config["user_uuid"] = _user.uuid
    return _config

def _create_bootstrap_first_team(_session, _config):
    _user_config = _config.get("user")
    _team_config = _config.get("team")
    _app = AppInfo(
        createtime=datetime.datetime.now(),
        updatetime=datetime.datetime.now(),
        uuid=str(uuid.uuid1()),
        app_key=_encode(str(uuid.uuid1())),
        app_secret=_encode(str(uuid.uuid1())),
        user_uuid=_user_config.get("user_uuid"),
        app_name=_team_config.get("app_name"),
        company_name=_team_config.get("company_name")
    )
    _session.add(_app)
    _session.commit()
    _team_config["app_uuid"] = _app.uuid
    return _config

def _create_bootstrap_team_data(_session, _config):
    _user_config = _config.get("user")
    _team_config = _config.get("team")
    _data = AppUserData(
        uuid=str(uuid.uuid1()),
        user_uuid=_user_config.get("user_uuid"),
        app_uuid=_team_config.get("app_uuid"),
        is_service_user=True,
        is_owner_user=True,
        is_distributor_user=True,
        is_portal_user=False,
    )
    _session.add(_data)
    _session.commit()
    return _config

def _create_bootstrap_api(_type, _session, _config):
    _user_config = _config.get("user")
    _team_config = _config.get("team")
    _api = ApiInfo(
        createtime=datetime.datetime.now(),
        updatetime=datetime.datetime.now(),
        uuid=str(uuid.uuid1()),
        user_uuid=_user_config.get("user_uuid"),
        app_uuid=_team_config.get("app_uuid"),
        api_level=_type,
        api_key=_encode(str(uuid.uuid1())),
        api_secret=_encode(str(uuid.uuid1())),
    )
    _session.add(_api)
    _session.commit()

    _config[_type] = {
        "api_uuid": _api.uuid,
        "api_key": _api.api_key,
        "api_secret": _api.api_secret,
    }
    return _config

def _update_api_uuid_with_ppconsole(_session, _config):
    _one = _session.query(AppInfo).filter(AppInfo.uuid == _config.get("app_uuid")).scalar()
    _one.api_uuid = _config.get("ppconsole").get("api_uuid")
    _session.commit()
    return _config

def _create_apns_settings(_session, _config):
    _dev_pem = None
    _pro_pem = None
    _dev_p12 = None
    _pro_p12 = None

    _apns = _config.get("apns")
    _dev_path = _apns.get("dev")
    _pro_path = _apns.get("pro")
    _name = _apns.get("name")
    _app_uuid = _config.get("team").get("app_uuid")

    if _apns == None or _dev_path == None or _pro_path == None or _name == None:
        return _config
    
    with open(_dev_path, "rb") as _file:
        _dev_p12 = _file.read()
        _dev_pem = convert2pem(_dev_p12)

    with open(_pro_path, "rb") as _file:
        _pro_p12 = _file.read()
        _pro_pem = convert2pem(_pro_p12)

    _dev_p12 = base64.b64encode(_dev_p12)
    _dev_pem = base64.b64encode(_dev_pem)
    _pro_p12 = base64.b64encode(_pro_p12)
    _pro_pem = base64.b64encode(_pro_pem)
    
    _apns = APNSSetting(
        uuid=str(uuid.uuid1()),
        app_uuid=_app_uuid,
        name = _name,
        production_p12=_pro_p12,
        development_p12=_dev_p12,
        production_pem=_pro_pem,
        development_pem=_dev_pem,
        is_development=False,
        is_production=True
    )
    _session.add(_apns)
    _session.commit()        
    return _config

def _create_nginx_conf(_session, _config):
FILE_STORAGE_DIR = "/usr/local/opt/mdm"
MESSAGE_FILE_STORAGE_DIR = "/usr/local/opt/mdm/message"
ICON_FILE_STORAGE_DIR = "/usr/local/opt/mdm/icon"
IDENTICON_FILE_STORAGE_DIR = "/usr/local/opt/mdm/identicon"
APP_FILE_STORAGE_DIR = "/usr/local/opt/mdm/app"
GENERIC_FILE_STORAGE_DIR = "/usr/local/opt/mdm/generic"
UPLOADS_FILE_STORAGE_DIR = "/usr/local/opt/mdm/uploads"

import platform
import os

if not os.path.exists(FILE_STORAGE_DIR):
    os.makedirs(FILE_STORAGE_DIR)
    os.chmod(FILE_STORAGE_DIR, 0777)

if not os.path.exists(MESSAGE_FILE_STORAGE_DIR):
    os.makedirs(MESSAGE_FILE_STORAGE_DIR)
    os.chmod(MESSAGE_FILE_STORAGE_DIR, 0777)

if not os.path.exists(ICON_FILE_STORAGE_DIR):
    os.makedirs(ICON_FILE_STORAGE_DIR)
    os.chmod(ICON_FILE_STORAGE_DIR, 0777)

if not os.path.exists(IDENTICON_FILE_STORAGE_DIR):
    os.makedirs(IDENTICON_FILE_STORAGE_DIR)
    os.chmod(IDENTICON_FILE_STORAGE_DIR, 0777)

if not os.path.exists(APP_FILE_STORAGE_DIR):
    os.makedirs(APP_FILE_STORAGE_DIR)
    os.chmod(APP_FILE_STORAGE_DIR, 0777)

if not os.path.exists(GENERIC_FILE_STORAGE_DIR):
    os.makedirs(GENERIC_FILE_STORAGE_DIR)
    os.chmod(GENERIC_FILE_STORAGE_DIR, 0777)

if not os.path.exists(UPLOADS_FILE_STORAGE_DIR):
    os.makedirs(UPLOADS_FILE_STORAGE_DIR)
    os.chmod(UPLOADS_FILE_STORAGE_DIR, 0777)

for i in xrange(10):
    _dir = chr(i+ord("0"))
    _dir = UPLOADS_FILE_STORAGE_DIR + "/" + _dir
    if not os.path.exists(_dir):
        os.makedirs(_dir)
        os.chmod(_dir, 0777)
        
for i in xrange(26):
    _dir = chr(i+ord("A"))
    _dir = UPLOADS_FILE_STORAGE_DIR + "/" + _dir
    if not os.path.exists(_dir):
        os.makedirs(_dir)
        os.chmod(_dir, 0777)

for i in xrange(26):
    _dir = chr(i+ord("a"))
    _dir = UPLOADS_FILE_STORAGE_DIR + "/" + _dir
    if not os.path.exists(_dir):
        os.makedirs(_dir)
        os.chmod(_dir, 0777)

    
    return _config

def _print_bootstrap_result(_config):
    _header = """
# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
# 
# AUTO GENERATE BY BOOTSTRAP
# NEVER EDIT THIS FILE MANUALLY
#
    """
    _password = _config.get("user_password")
    _config["user_password_hash"] = hashlib.sha1(_password).hexdigest()
    
    _password = "*" * len(_password)
    _config["user_password"] = _password

    _this_file_dir = os.path.dirname(os.path.abspath(__file__))
    _data_file_path = _this_file_dir + os.path.sep + "data.py"
    _f = open(_data_file_path, "w")
    _str = _header + "\n" + "BOOTSTRAP_DATA = " + json.dumps(_config, indent=True)
    _f.write(_str)
    _f.close()
    print(_str)
    return

def _bootstrap():

    _levels = [API_LEVEL.PPCOM, API_LEVEL.PPKEFU, API_LEVEL.PPCONSOLE,
               API_LEVEL.THIRD_PARTY_KEFU, API_LEVEL.THIRD_PARTY_CONSOLE]
    _config = _check_bootstrap_config()
    if _config == None:
        return
    _session_class = getDBSessionClass()
    _session = _session_class()
    try:
        _config = _create_bootstrap_admin_user(_session, _config)
        _config = _create_bootstrap_first_user(_session, _config)
        _config = _create_bootstrap_first_team(_session, _config)
        _config = _create_bootstrap_team_data(_session, _config)
        for _level in _levels:
            _config = _create_bootstrap_api(_level, _session, _config)
        _config = _update_api_uuid_with_ppconsole(_session, _config)
        _config = _create_apns_settings(_session, _config)
    except:
        traceback.print_exc()
    finally:
        _session_class.remove()

    _print_bootstrap_result(_config)
    return

if __name__ == "__main__":
    _bootstrap()
    
