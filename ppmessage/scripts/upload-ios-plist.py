# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

from ppmessage.core.apkinfo import ApkInfo
from ppmessage.core.ipainfo import IpaInfo

import traceback
import random
import sys
import os

APP_NAME = "ppmessage"
if len(sys.argv) == 2:
    APP_NAME = sys.argv[1]

IOS_IPA_FILE = APP_NAME + ".ipa"
IOS_IPA_PATH = "../web/assets/static/yvertical/portal/resources/app/" + IOS_IPA_FILE
DOWNLOAD_APP_HTML = "../web/assets/static/yvertical/portal/download-app/download-app.html"
DOWNLOAD_APP_HTML_TEMPLATE = "../web/assets/static/yvertical/portal/download-app/download-app.html.template"

def _importIOSApp():

    _file_name = IOS_IPA_FILE
    _file_path = IOS_IPA_PATH
    _ipa = IpaInfo()
    _ipa.init(_file_path, _file_name)

    print(_ipa.getDistinctName())
    print(_ipa.getFriendlyName())
    print(_ipa.getVersionName())

    _ipa.putPList("ppmessage.cn", "root", "YVERTICAL1q2w3e4r5t")
    
    _plist_url = _ipa.getPListUrl("ppmessage.cn")
    print(_plist_url)

    return _plist_url

def _download_html(_ios_plist_url):
    _ios_download_link = ""
    _r = None
    with open(DOWNLOAD_APP_HTML_TEMPLATE, "r") as _file:
        _r = _file.read()
        _r = _r.decode("utf8")
        _r = _r.replace("{IOS_PLIST_URL}", _ios_plist_url)

    with open(DOWNLOAD_APP_HTML, "w") as _file:
        _r = _r.encode("utf8")
        _file.write(_r)

def _import():
    _plist_url = _importIOSApp()
    _download_html(_plist_url)
    return

if __name__ == "__main__":
    import sys
    reload(sys)
    sys.setdefaultencoding('utf8')
    import codecs
    codecs.register(lambda name: codecs.lookup('utf8') if name == 'utf8mb4' else None)
    _import()

    
