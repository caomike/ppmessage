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

from config import BOOTSTRAP_CONFIG

from ppmessage.db.models import AppInfo
from ppmessage.db.models import ApiInfo
from ppmessage.db.models import AdminUser
from ppmessage.db.models import DeviceUser
from ppmessage.db.models import AppUserData

from ppmessage.db.common.dbinstance import getDBSessionClass

from ppmessage.core.constant import API_LEVEL

import os
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
    _fields = ["user_email", "user_password", "user_fullname", "user_firstname", "user_lastname", "user_language", "company_name"]
    for _field in _fields:
        if _field not in BOOTSTRAP_CONFIG:
            print("%s not provided in BOOTSTAP_CONFIG" % _field)
            return None
    _config = copy.deepcopy(BOOTSTRAP_CONFIG)
    _config["user_language"] = _config.get("user_language").lower()
    return _config

def _create_bootstrap_admin_user(_session, _config):
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
        user_status=_config.get("user_status"),
        is_anonymous_user=False,
    )
    _session.add(_user)
    _session.commit()
    _config["user_uuid"] = _user.uuid
    return _config

def _create_bootstrap_first_team(_session, _config):
    _app = AppInfo(
        createtime=datetime.datetime.now(),
        updatetime=datetime.datetime.now(),
        uuid=str(uuid.uuid1()),
        app_key=_encode(str(uuid.uuid1())),
        app_secret=_encode(str(uuid.uuid1())),
        user_uuid=_config.get("user_uuid"),
        app_name=_config.get("app_name"),
        company_name=_config.get("company_name")
    )
    _session.add(_app)
    _session.commit()
    _config["app_uuid"] = _app.uuid
    return _config

def _create_bootstrap_team_data(_session, _config):
    _data = AppUserData(
        uuid=str(uuid.uuid1()),
        user_uuid=_config.get("user_uuid"),
        app_uuid=_config.get("app_uuid"),
        is_service_user=True,
        is_owner_user=True,
        is_distributor_user=True,
        is_portal_user=False,
    )
    _session.add(_data)
    _session.commit()
    return _config

def _create_bootstrap_api_ppcom(_session, _config):
    _api = ApiInfo(
        createtime=datetime.datetime.now(),
        updatetime=datetime.datetime.now(),

        uuid=str(uuid.uuid1()),
        user_uuid=_config.get("user_uuid"),
        app_uuid=_config.get("app_uuid"),
        api_level=API_LEVEL.PPCOM,
        api_key=_encode(str(uuid.uuid1())),
        api_secret=_encode(str(uuid.uuid1())),
    )
    _session.add(_api)
    _session.commit()

    _config["ppcom"] = {
        "api_uuid": _api.uuid,
        "api_key": _api.api_key,
        "api_secret": _api.api_secret,
    }
    return _config

def _create_bootstrap_api_ppkefu(_session, _config):
    _api = ApiInfo(
        createtime=datetime.datetime.now(),
        updatetime=datetime.datetime.now(),

        uuid=str(uuid.uuid1()),
        user_uuid=_config.get("user_uuid"),
        app_uuid=_config.get("app_uuid"),
        api_level=API_LEVEL.PPKEFU,
        api_key=_encode(str(uuid.uuid1())),
        api_secret=_encode(str(uuid.uuid1())),
    )
    _session.add(_api)
    _session.commit()

    _config["ppkefu"] = {
        "api_uuid": _api.uuid,
        "api_key": _api.api_key,
        "api_secret": _api.api_secret,
    }
    return _config


def _create_bootstrap_api_ppconsole(_session, _config):
    _api = ApiInfo(
        createtime=datetime.datetime.now(),
        updatetime=datetime.datetime.now(),
        uuid=str(uuid.uuid1()),
        user_uuid=_config.get("user_uuid"),
        app_uuid=_config.get("app_uuid"),
        api_level=API_LEVEL.PPCONSOLE,
        api_key=_encode(str(uuid.uuid1())),
        api_secret=_encode(str(uuid.uuid1())),
    )
    _session.add(_api)
    _session.commit()

    _config["ppconsole"] = {
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
        _config = _create_bootstrap_api_ppcom(_session, _config)
        _config = _create_bootstrap_api_ppkefu(_session, _config)
        _config = _create_bootstrap_api_ppconsole(_session, _config)
        _config = _update_api_uuid_with_ppconsole(_session, _config)
    except:
        traceback.print_exc()
    finally:
        _session_class.remove()

    _print_bootstrap_result(_config)
    return

if __name__ == "__main__":
    _bootstrap()
    
