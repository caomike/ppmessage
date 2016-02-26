# -*- coding: utf-8 -*-
# Copyright (C) 2010-2016 PPMessage.
#
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# core/plistinfo.py
#

import plistlib

class PListInfo:

    def __init__(self):
        self._ipa = None
        
    def init(self, _ipa):
        self._ipa = _ipa
        
    def save(self, _path):
        _ipa_identifer = self._ipa.getDistinctName()
        _ipa_version = self._ipa.getVersionName()
        _ipa_name = self._ipa.getFriendlyName()
        _ipa_url = self._ipa.getDownloadUrl()
        
        _plist = {
            "items" : [{
                "assets": [{"kind": "software-package", "url": _ipa_url}],
                "metadata": {"bundle-identifier": _ipa_identifer, "bundle-version": _ipa_version, "kind": "software", "title": _ipa_name},
            }],
        }
        plistlib.writePlist(_plist, _path)
        return

    

