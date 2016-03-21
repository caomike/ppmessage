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
    should_list = ["autoconf", "libtool", "gcc", "g++", "gfortran", "git", "mercurial", "apt-file", "pkg-config", "libtool",
                   "wget", "python", "redis-server", "mysql-server", "python-pip", "apt-utils", "automake", "openssl",
                   "libblas-dev", "liblapack-dev", "libatlas-base-dev", "libffi-dev", "libfdk-aac-dev",
                   "libfreetype6-dev", "libjpeg8-dev", "libmp3lame-dev", "libncurses5-dev",
                   "libopencore-amrwb-dev", "libopencore-amrnb-dev", "libopus-dev", "libpng12-dev",
                   "libpcre3-dev", "libssl-dev", "libffi-dev", "python-dev", "libfreetype6-dev",
                   "libmagic-dev", "libpcre3-dev"]
    except_list = []
    for should_item in should_list:
        try:
            _color_print("install %s" % should_item, "green")
            install_cmd = "apt-get install " + " ".join(should_intem)
            subprocess.check_output(install_cmd, shell=True)
        except:
            except_list.append(should_item)

    if len(except_list) > 0:
        _color_print("not install: %s" % str(except_list))
        _color_print("try manual instal with command: `apt-get install %s`" % " ".join(except_list))
        sys.exit()
    return

def _check_uid():
    if 0 != os.getuid():
        _color_print("need root privilege")
        sys.exit()
    return

def _check_platform():
    if platform.system() != "Linux":
        _color_print("install_debs can not run on non-Linux system.")
        sys.exit()

    distribution = platform.linux_distribution()
    if distribution[0] != "Debian" and distribution[0] != "Ubuntu":
        _color_print("install_debs can not run on non-Debian system.")
        sys.exit()        
    return

if __name__ == "__main__":
    _check_platform()
    _check_uid()
    _install()

