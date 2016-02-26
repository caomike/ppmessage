# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage YVertical.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# getpath.py

import os
import sys
import platform
import re

def get_web_path(path_name):

    _sys = platform.system()
    help_path = os.path.join(os.path.dirname(__file__))
    if _sys == "Windows":
        mdm_path = help_path[:-5] + "web"
        pattern = r"\\[^\\]*\.exe\\.*"
        web_path = re.subn(pattern, '', help_path)[0]
        asset_path = os.path.join(web_path, "assets")
    elif _sys == "Linux":
        mdm_path = help_path[:-5]
        asset_path = os.path.join(mdm_path, "web/assets")
    elif _sys == "Darwin":
        mdm_path = help_path.split("/help")[0]
        asset_path = os.path.join(mdm_path, "web/assets")
    else:
        print "ERROR: can not recognize the system: " + _sys + "."
        
    return_path = os.path.join(asset_path, path_name)
    return return_path

def get_portal_path(path_name):

    _sys = platform.system()
    help_path = os.path.join(os.path.dirname(__file__))
    if _sys == "Windows":
        mdm_path = help_path[:-5] + "web"
        pattern = r"\\[^\\]*\.exe\\.*"
        web_path = re.subn(pattern, '', help_path)[0]
        asset_path = os.path.join(web_path, "assets")
    elif _sys == "Linux":
        mdm_path = help_path[:-5]
        asset_path = os.path.join(mdm_path, "portal/assets")
    elif _sys == "Darwin":
        mdm_path = help_path.split("/help")[0]
        asset_path = os.path.join(mdm_path, "portal/assets")
    else:
        print "ERROR: can not recognize the system: " + _sys + "."
        
    return_path = os.path.join(asset_path, path_name)
    return return_path
