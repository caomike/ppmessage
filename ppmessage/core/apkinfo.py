# -*- coding: utf-8 -*-
# Copyright (C) 2010-2016 PPMessage.
#
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# core/apkinfo.py
#

from ppmessage.core.constant import PORTAL_PORT
from ppmessage.core.utils.atool import zipfile
from ppmessage.core.utils.atool.apk.axml import ResourceParser
from ppmessage.core.utils.atool.apk.axml import ResObject
from ppmessage.core.utils.getipaddress import getIPAddress

from axmlparserpy import apk

class ApkInfo:

    def __init__(self):
        self._apk = None
        self.apkfilepath = None
    
    def init(self, filepath, filename):
        self.apkfilepath = filepath
        self.fileName = filename
        self._apk = apk.APK(filepath)
        return True
        
    def getData(self):
        _d = None
        with open(self.apkfilepath, "rb") as _f:
            _d = _f.read()
        return _d

    def _get_string_by_id(self, _id):
        _id = int(_id, 16)
        
        _zipfd = zipfile.ZipFile(self.apkfilepath, 'r')
        _d = _zipfd.read("resources.arsc")
        _zipfd.close()

        _p = ResourceParser(_d)
        _m = _p.parse_resources()
        _r = ResObject()
        _r.update(_m)

        parser = ResourceParser("")
        parser.set_restable(_r)
        result = parser.dereference_resource(_id)
        _name = result[2]
        
        package = _r.name_map.values()[0]
        _p.set_restable(_r)
        _value = _p.resolve_string(package.name, _name)

        return _value

    def _get_iconname_by_id(self, _id):
        _id = int(_id, 16)

        _zipfd = zipfile.ZipFile(self.apkfilepath, 'r')
        _d = _zipfd.read("resources.arsc")

        _p = ResourceParser(_d)
        _m = _p.parse_resources()
        _r = ResObject()
        _r.update(_m)

        parser = ResourceParser("")
        parser.set_restable(_r)
        result = parser.dereference_resource(_id)
        _draw_dir = result[1]

        #find iconpath by iconname using regex
        _filelist = _zipfd.namelist()
        _iconpath = "res/drawable-hdpi/" + result[2] + ".png"
        import re
        _p = re.compile("res/drawable.+/" + result[2] + ".png")
        for _file in _filelist:
            if _p.match(_file):
                _iconpath = _file
                break

        print "try to find iconpath:" + _iconpath
        _zipfd.close()
        return _iconpath
    
    def getFriendlyName(self):

        _label = self._apk.get_element("application", "android:label")
        if _label[0] == "@":
            return self._get_string_by_id(_label[1:])
        return _label            
                
    def getDistinctName(self):
        return self._apk.get_package()
    
    def getVersionName(self):
        return self._apk.get_androidversion_name()
    
    def getVersionCode(self):
        return self._apk.get_androidversion_code()
    
    def getIconData(self):
        _icon = self._apk.get_element("application", "android:icon")
        _iconname = "res/" + _icon + ".png"
        if _icon[0] == "@":
            _iconname = self._get_iconname_by_id(_icon[1:])

        _zipfd = zipfile.ZipFile(self.apkfilepath, 'r')
        icon_data = _zipfd.read(_iconname, 'r')
        _zipfd.close()
        return icon_data

    def getSupportVersion(self):
        return self._apk.get_min_sdk_version()

    def getDownloadUrl(self):
        return ""

if __name__ == "__main__" :
  import sys
  test = ApkInfo()
  test.init(sys.argv[1])
  print test.getIconData()
