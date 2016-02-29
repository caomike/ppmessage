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

def _color_print(str):
    print('\033[1;31;40m')
    print(str)
    print('\033[0m')
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
    return

def _require_pips():
    """
    check the required python pip packages
    check only, no download no install
    """
    return

def _require_node():
    """
    check node.js
    """
    return

def _require():
    _require_ppmessage_pth()
    _require_software_packages()
    _require_pips()
    _require_node()
    return

if __name__ == "__main__":
    _require()

