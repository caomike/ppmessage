# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage YVertical.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# help/path.py
#
#

import os
import platform

from .getpath import getLocalPath

if platform.system() == "Windows":
    file_aapt = getLocalPath("preinstall\\aapt.exe")
    tmp = []
    for i in file_aapt.split('\\'):
        if " " in i:
            i = '"' + i + '"'
        tmp.append(i)
    file_path = '\\'.join(tmp)
    
    APK_FILE_PATH = r"c:/mdm_data/apkpool/public/"
    KEYTOOL_FILE_PATH = r"c:/mdm_data/keytool/"
    CONTENT_FILE_PATH = r"c:/mdm_data/content_repo/"
else:
    file_path = getLocalPath("preinstall/aapt")
    
    APK_FILE_PATH = "/mdm_data/apkpool/public/"
    KEYTOOL_FILE_PATH = "/mdm_data/keytool/"
    CONTENT_FILE_PATH = "/mdm_data/content_repo/"
    IMPORT_USER_PATH = "/mdm_data/import_user/"
    
AAPT_PATH = r"%s %s" % (file_path, r"d badging")

def getApkFilePath():
    return APK_FILE_PATH

def getKeyToolFilePath():
    return KEYTOOL_FILE_PATH

def getContentFilePath():
    return CONTENT_FILE_PATH

def getAaptPath():
    return AAPT_PATH

def getImportUserPath():
    return IMPORT_USER_PATH
