# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

"""
require.py check the system environment
1) set `ppmessage` module path
2) Software package (dpkg, homebrew)
3) Python pip
4) Node npm
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

def _check_brew():
    which_cmd = 'which brew'
    try:
        cmd_res = subprocess.check_output(which_cmd, shell=True)
    except:
        traceback.print_exc()
        _color_print("Homebrew not installed. Get brew from http://brew.sh.")
        sys.exit()
        
    list_cmd = 'brew list'
    try:
        list_res = subprocess.check_output(list_cmd, shell=True)
    except:
        _color_print("`brew list` can not execute")
        sys.exit()

    list_res = list_res.split("\n")
    brew_list = []
    for brew_item in list_res:
        if len(brew_item) == 0:
            continue
        brew_list.append(brew_item)

    should_list = ["dos2unix", "faac", "node", "fdk-aac", "ffmpeg", "gettext", "jpeg", "lame", "libffi", "libmagic", "libogg", "libvo-aacenc", "libvorbis", "makedepend", "mercurial", "mp3val", "mysql", "nginx-full", "opencore-amr", "openssl", "opus", "ossp-uuid", "pcre", "pkg-config", "readline", "redis", "upload-nginx-module", "watchman", "wget", "x264", "xvid", "xz", "yasm"]
    for should_item in should_list:
        if should_item not in brew_list:
            _color_print("%s not installed, try use `brew install %s`" % (should_item, should_item))
            sys.exit()

    _color_print("brew check ok!", "green")
    return

def _check_debian():
    linux_distribution = platform.linux_distribution()
    if linux_distribution[0] != "Debian" and linux_distribution[0] != "Ubuntu":
        _color_print("not Debian or Ubuntu, ppmessage needs Debian or Ubuntu")
        sys.exit()

    which_cmd = "which dpkg"
    try:
        cmd_res = subprocess.check_output(which_cmd, shell=True)
    except:
        _color_print("no dpkg command installed, try `aptitude install dpkg`")
        sys.exit()

    dpkg_list = ["apt-file", "git", "mysql-server", "pkg-config", "python-pip", "wget", "gcc", "libffi-dev", "python-dev", "redis-server", "libjpeg8-dev", "libpng12-dev", "libfreetype6-dev", "mercurial", "g++", "libopencore-amrwb-dev", "libopencore-amrnb-dev", "libmp3lame-dev", "libopus-dev", "libmagic-dev", "libpcre3-dev", "openssl", "libssl-dev"]
    
    for dpkg_item in dpkg_list:
        dpkg_cmd = "dpkg -s " + dpkg_item
        try:
            subprocess.check_output(dpkg_cmd, shell=True)
        except:
            _color_print("%s not installed, try `aptitude install %s`" % (dpkg_item, dpkg_item))
            sys.exit()

    return

def _require_ppmessage_pth():
    """
    let python know `ppmessage` module 
    """
    try:
        from distutils.sysconfig import get_python_lib
        site_package_dir = get_python_lib()
    except:
        _color_print("python packages path not found.")
        sys.exit()

    if 0 != os.getuid():
        _color_print("need root privilege")
        sys.exit()
        
    current_dir = os.path.dirname(os.path.abspath(__file__))
    current_dir = current_dir.split(os.path.sep)
    current_dir = current_dir[:-2]
    ppmessage_dir = os.path.sep.join(current_dir)

    pth = site_package_dir + os.path.sep + "ppmessage.pth"
    with open(pth, "w") as f:
        f.write(ppmessage_dir)
    return

def _require_software_packages():
    """
    check the required software packages
    For Linux Debian, check dpkg
    For Mac OS X, check homebrew

    check only, no download, no install
    """

    current_platform = platform.system()
    if current_platform == "Darwin":
        _check_brew()
        return

    if current_platform == "Linux":
        _check_debian()
        return

    _color_print("ppmessage not support %s" % current_platform)
    return

def _require_pips():
    """
    check the required python pip packages
    check only, no download no install
    """

    which_cmd = 'which pip'
    try:
        cmd_res = subprocess.check_output(which_cmd, shell=True)
    except:
        traceback.print_exc()
        _color_print("pip not installed")
        sys.exit()

    list_cmd = 'pip list'
    try:
        list_res = subprocess.check_output(list_cmd, shell=True)
    except:
        _color_print("`pip list` can not execute")
        sys.exit()

    list_res = list_res.split("\n")
    pip_list = []
    for pip_item in list_res:
        if len(pip_item) == 0:
            continue
        pip_list.append(pip_item.split(" ")[0])

    should_list = ["apns-client", "AxmlParserPY", "beautifulsoup4", "biplist", "certifi", "cffi", "chardet",
                   "cryptography", "evernote", "filemagic", "geoip2", "green",
                   "identicon", "ipaddr", "ipython", "jieba", "matplotlib",
                   "maxminddb", "mysql-connector-python", "numpy",
                   "paho-mqtt", "paramiko", "Pillow", "pip", "ppmessage-mqtt", "pyOpenSSL",
                   "pyparsing", "pypinyin", "python-dateutil", "python-gcm", "qiniu", "qrcode",
                   "readline", "redis", "requests", "rq", "scikit-learn", "scipy", "setuptools",
                   "six", "SQLAlchemy", "supervisor", "tornado", "xlrd"]

    for should_item in should_list:
        if should_item not in pip_list:
            _color_print("%s python module not installed" % (should_item))
            sys.exit()

    _color_print("pip check ok!", "green")
    return

def _require_node():
    """
    check node.js
    """
    which_cmd = "which npm"
    try:
        subprocess.check_output(which_cmd, shell=True)
    except:
        _color_print("npm not installed, try use root privilege to install node.js")
        sys.exit()

    return

def _require():
    _require_ppmessage_pth()
    _require_software_packages()
    _require_pips()
    _require_node()
    return

if __name__ == "__main__":
    _require()

