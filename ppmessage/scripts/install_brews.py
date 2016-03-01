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
    basic_list = ["pcre", "dos2unix", ""hg", "autoconf", "libtool", "automake", "redis", "libmagic", "mysql", "libjpeg", "libffi", "fdk-aac", "lame", "mercurial"]

    for should_item in basic_list:
        install_cmd = "brew install " + should_item
        _color_print("%s" % install_cmd, "green")
        try:
            subprocess.check_output(install_cmd, shell=True)
        except:
            _color_print("failed to run: `brew install %s`" % should_item) 
            sys.exit()

    install_cmds = [
        "brew tap homebrew/services",
        "brew tap homebrew/nginx",
        "brew install nginx-full --with-upload-module",
        "brew install ffmpeg --with-fdk-aac --with-opencore-amr --with-libvorbis --with-opus"
    ]
    
    for install_cmd in install_cmds:
        _color_print("%s" % install_cmd, "green")
        try:
            subprocess.check_output(install_cmd, shell=True)
        except:
            _color_print("failed to run: %s" % install_cmd)
            sys.exit()
            
    return

def _check_brew():
    which_cmd = "which brew"
    no_brew = False
    try:
        subprocess.check_output(which_cmd, shell=True)
    except:
        _color_print("No brew install, auto download...")
        no_brew = True

    install_cmd = '/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"'
    if no_brew:
        try:
            subprocess.check_output(install_cmd, shell=True)
        except:
            _color_print("Failed to execute: %s" % install_cmd)
            sys.exit()  
    return

def _check_uid():
    if 0 == os.getuid():
        _color_print("Don't use root privilege")
        sys.exit()
    return

if __name__ == "__main__":
    _check_uid()
    _check_brew()
    _install()

