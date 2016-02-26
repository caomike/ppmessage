# -*- coding: utf-8 -*-
# Copyright (C) 2010-2016 PPMessage.
#
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# core/ipainfo.py
#
from mdm.help.getipaddress import getIPAddress
from mdm.help.scptransfer import ScpTransfer
from mdm.help.ipin import getNormalizedPNGByData

from mdm.core.constant import DEV_MODE
from mdm.core.constant import PORTAL_PORT
from mdm.core.plistinfo import PListInfo

import pyipa
import StringIO
from PIL import Image

class IpaInfo:

    def __init__(self):
        self.filePath = None
        self.pList = None
        self.parser = None
        self.downloadUrl = None

    def init(self, filePath, fileName):
        self.filePath = filePath
        self.parser = pyipa.IPAparser(filePath)
        self.pList = self.parser.parseInfo()
        self.fileName = fileName
        return True

    def getData(self):
        _d = None
        with open(self.filePath, "rb") as _f:
            _d = _f.read()
        return _d

    def getDistinctName(self):
        return self.pList.get("CFBundleIdentifier")

    def getFriendlyName(self):
        return self.pList.get("CFBundleDisplayName")

    def getVersionName(self):
        return self.pList.get("CFBundleVersion")

    def getDownloadUrl(self):
        _add = "/portal/static/yvertical/portal/resources/app/" + self.fileName
        _url = "https://ppmessage.cn" + _add
        if DEV_MODE:
            _url = "http://" + getIPAddress() + ":" + str(PORTAL_PORT) + _add
        return _url

    def _get_pname(self):
        _pname = getIPAddress()
        _pname = _pname.replace(".", "_")
        _pname = _pname + ".plist"
        return _pname

    def _get_pre(self):
        _pre = "/static/yvertical/portal/download-app"
        return _pre
    
    def getPListUrl(self, host):
        _pname = self._get_pname()
        _url = "itms-services://?action=download-manifest&amp;url=https://"
        _url = _url + host + "/portal" + self._get_pre() + "/" + self._get_pname()
        return _url
    
    def getIconData(self):
        _icon_file = self.pList.get("CFBundleIconFile")
        _icon_path = self.parser.findFile(_icon_file)
        _img = self.parser.zip_obj.read(_icon_path)
        _nimg = getNormalizedPNGByData(_img)
        return _nimg

    def putPList(self, host, user, p):
        _pname = self._get_pname()
        _info = PListInfo()
        _info.init(self)
        _local = "/tmp/" + _pname
        _info.save(_local)
        _scp = ScpTransfer(host, user, p)
        _pre = "/root/mdm/mdm/web/assets" + self._get_pre()
        _remote = _pre + "/" + _pname
        _scp.put(_local, _remote)
        _scp.close()
        return


if __name__ == "__main__" :
    test = IpaInfo(sys.argv[1])
    print test.getDistinctName()
    print test.getFriendlyName()
    print test.getVersionName()
    #print test.getIconData()
