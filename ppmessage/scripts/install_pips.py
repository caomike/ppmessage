# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

"""
install_pips.py use pip to install all python modules which ppmessage depends on.
"""

import os
import sys
import platform
import traceback
import subprocess

def _color_print(str, color="red"):
    if color == "red":
        print('\033[1;31;40m')
    if color == "green":
        print('\033[1;32;40m')
    print(str)
    print('\033[0m')
    return

def _install():
    should_list = [#"apns-client", no apns-client
        "AxmlParserPY", "beautifulsoup4", "biplist", "certifi", "cffi", "chardet",
        "cryptography", "evernote", "filemagic", "geoip2", "green",
        "identicon", "ipaddr", "ipython", "jieba", "matplotlib",
        "maxminddb", "numpy",
        "paho-mqtt", "paramiko", "Pillow", "pip", "ppmessage-mqtt", "pyOpenSSL",
        "pyparsing", "pypinyin", "python-dateutil", "python-gcm", "qiniu", "qrcode",
        "readline", "redis", "requests", "rq", "scikit-learn", "scipy", "setuptools",
        "six", "SQLAlchemy", "supervisor", "tornado", "xlrd"]

    for should_item in should_list:
        install_cmd = "pip install " + should_item
        _color_print("%s" % install_cmd, "green")

        _missed = []
        try:
            subprocess.check_output(install_cmd, shell=True)
        except:
            _missed.append(should_item)

    if len(_missed) > 0:
        _color_print("failed to run: `pip install %s`" % _missed) 
        sys.exit()
        
    return

def _check_csr():
    check_cmd = "csrutil status"
    try:
        csr_status = subprocess.check_output(check_cmd, shell=True)
    except:
        _color_print("failed to check csrutil status")
        sys.exit()
    
    _color_print(csr_status)
    return

def _check_uid():
    if 0 != os.getuid():
        _color_print("need root privilege")
        sys.exit()
    return

if __name__ == "__main__":
    if platform.system() == "Darwin":
        _check_csr()
    _check_uid()
    _install()

