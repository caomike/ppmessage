# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

"""
require.py check the system environment
1) OS (Debian Linux, Mac OS X)
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
    try:
        from distutils.sysconfig import get_python_lib
        site_package_dir = get_python_lib()
    except:
        _color_print("python packages path not found.")
        sys.exit()

    if 0 != os.getuid():
        _color_print("need root privilege")
        sys.exit()
        
    _current_dir = os.path.dirname(os.path.abspath(__file__))
    _ppmessage_dir = _current_dir
    return

def _require():
    _require_ppmessage_pth()
    return

if __name__ == "__main__":
    _require()

