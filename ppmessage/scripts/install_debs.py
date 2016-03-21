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
    should_list = ["autoconf", "libtool", "gcc", "g++", "git", "mercurial", "apt-file", "pkg-config", "wget",
                   "redis-server", "mysql-server", "python-pip",
                   "libffi-dev", "python-dev", "libjpeg8-dev", "libpng12-dev", "libfreetype6-dev",
                   "libmagic-dev", "libpcre3", "libpcre3-dev", "openssl", "libssl-dev",
                   "libopencore-amrwb-dev", "libopencore-amrnb-dev", "libmp3lame-dev", "libopus-dev"]
    except_list = []
    for should_item in should_list:
        try:
            install_cmd = "apt-get install " + " ".join(should_intem)
            subprocess.check_output(install_cmd, shell=True)
        except:
            _color_print("failed to run: %s`" % install_cmd)
            except_list.add(should_item)

    if len(except_list) > 0:
        _color_print("not install: %s", str(except_list))
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

