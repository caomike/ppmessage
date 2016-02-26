# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
from mdm.db.common.dbinstance import getDBSessionClass
from mdm.db.common.dbinstance import getDatabaseEngine

from mdm.db.utils.filemanager import createAndroidAppFile
from mdm.db.utils.filemanager import createIOSAppFile
from mdm.db.utils.filemanager import createDesktopApp
from mdm.db.models import AppPackageInfo

from mdm.core.restart import restart
from mdm.core.apkinfo import ApkInfo
from mdm.core.ipainfo import IpaInfo
from mdm.core.constant import DEV_MODE
from mdm.core.constant import PORTAL_PORT
from mdm.core.constant import REDIS_HOST
from mdm.core.constant import REDIS_PORT

from mdm.help.getipaddress import getIPAddress

import traceback
import random
import redis
import json
import sys
import os

APP_NAME = "ppmessage"
if len(sys.argv) == 2:
    APP_NAME = sys.argv[1]

IOS_IPA_FILE = APP_NAME + ".ipa"
ANDROID_APK_FILE = APP_NAME + ".apk"

WIN32_EXE_FILE = APP_NAME + "-win32-setup.exe"
WIN64_EXE_FILE = APP_NAME + "-win64-setup.exe"
MAC_DMG_FILE = APP_NAME + ".dmg"

APP_DIR_PRE = "../web/assets/static/yvertical/portal/resources/app"
IOS_IPA_PATH = APP_DIR_PRE + "/" + IOS_IPA_FILE
ANDROID_APK_PATH = APP_DIR_PRE + "/" + ANDROID_APK_FILE
WIN32_EXE_PATH = APP_DIR_PRE + "/" + WIN32_EXE_FILE
WIN64_EXE_PATH = APP_DIR_PRE + "/" + WIN64_EXE_FILE
MAC_DMG_PATH = APP_DIR_PRE + "/" + MAC_DMG_FILE

DESKTOP_PACKAGE_JSON = "../pcapp/ppmessage-pc/package.json"

def _desktop_app_download_url(_file_name):
    _add = "/portal/static/yvertical/portal/resources/app/" + _file_name
    _url = "https://ppmessage.cn" + _add
    if DEV_MODE:
        _url = "http://" + getIPAddress() + ":" + str(PORTAL_PORT) + _add
    return _url
        
def _importAndroidApp(_dbsession):
    """
    _data,
    _icon_data,
    _file_name,
    _distinct_name,
    _friendly_name,
    _version_code,
    _version_name,
    _type,
    _download_url,
    _uid,
    _dbsession
    """

    _file_name = ANDROID_APK_FILE
    _apk_file_path = ANDROID_APK_PATH
    _apk = ApkInfo()
    _apk.init(_apk_file_path, _file_name)
    
    print("name: %s, version: %s, code: %s" % (_apk.getDistinctName(), _apk.getVersionName(), _apk.getVersionCode()))
    _fuuid = createAndroidAppFile(_apk.getData(),
                                  _file_name,
                                  _apk.getDistinctName(),
                                  _apk.getFriendlyName(),
                                  _apk.getVersionCode(),
                                  _apk.getVersionName(),
                                  _apk.getDownloadUrl(),
                                  _dbsession)
    return _fuuid

def _importIOSApp(_dbsession):

    _file_name = IOS_IPA_FILE
    _file_path = IOS_IPA_PATH
    _ipa = IpaInfo()
    _ipa.init(_file_path, _file_name)

    print(_ipa.getDistinctName())
    print(_ipa.getFriendlyName())
    print(_ipa.getVersionName())

    _plist_url = _ipa.getPListUrl("ppmessage.cn")
    _download_url = _ipa.getDownloadUrl()
    print(_plist_url)
    print(_download_url)

    createIOSAppFile(_ipa.getData(),
                     _file_name,
                     _ipa.getDistinctName(),
                     _ipa.getFriendlyName(),
                     _ipa.getVersionName(),
                     _plist_url,
                     _download_url,
                     _dbsession)
    return _plist_url

def _importDesktopApp(_dbsession):
    _package = json.load(file(DESKTOP_PACKAGE_JSON))
    _version = _package["version"]
    _package_name = _package["name"]
    _file_list = {
        "WIN32": WIN32_EXE_FILE,
        "WIN64": WIN64_EXE_FILE,
        "MAC": MAC_DMG_FILE
    }
    for _platform in _file_list:
        _file_name = _file_list[_platform]
        _download_url = _desktop_app_download_url(_file_name)
        createDesktopApp(_file_name, _package_name, _download_url, _version, _platform, _dbsession)
    return

def _refreshRedis(_dbsession):
    _redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
    _all = _dbsession.query(AppPackageInfo).all()
    for _row in _all:
        _row.create_redis_keys(_redis)
    return

def _import(_dbsession):
    _importDesktopApp(_dbsession)
    _importAndroidApp(_dbsession)
    _importIOSApp(_dbsession)
    _refreshRedis(_dbsession)
    return

def _clean(dbsession):
    """
    which will clean all the App data
    """
    dbsession.query(AppPackageInfo).delete()
    dbsession.commit()
    return

if __name__ == "__main__":
    import sys
    reload(sys)
    sys.setdefaultencoding('utf8')
    import codecs
    codecs.register(lambda name: codecs.lookup('utf8') if name == 'utf8mb4' else None)

    dbsession_class = getDBSessionClass()
    dbsession = dbsession_class()
    try:
        _clean(dbsession)
        _import(dbsession)
    except:
        traceback.print_exc()
    finally:
        dbsession_class.remove()
    
