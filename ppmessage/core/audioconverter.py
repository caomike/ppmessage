# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# core/audioconverter.py
#

from tempfile import mkstemp
from os import unlink, close, write
import time
import base64
import subprocess

def _randomFileWithData(_data, _suffix):
    _prefix = str(time.time())
    (_handle, _name) = mkstemp(suffix=_suffix, prefix=_prefix)
    write(_handle, _data)
    close(_handle)
    return _name

def _randomFile(_suffix):
    _prefix = str(time.time())
    (_handle, _name) = mkstemp(suffix=_suffix, prefix=_prefix)
    close(_handle)
    return _name

# assume the input is the raw audio data not encoded with base64
def _convert(_data, _iformat, _oformat):
    _fi0 = _randomFileWithData(_data, "."+_iformat)
    _fo0 = _randomFile("."+_oformat)
    _command = None

    if _oformat == "amr":
        _command = "ffmpeg -y -i %s -codec amr_nb -ac 1 -ar 8000 -b:a 8k %s" % (_fi0, _fo0)
    elif _oformat == "ogg":
        _command = "ffmpeg -y -i %s -codec opus -f ogg %s" % (_fi0, _fo0)
    elif _oformat == "mp3":
        _command = "ffmpeg -y -i %s -ac 1 -b:a 8k %s" % (_fi0, _fo0)
    elif _oformat == "m4a":
        _command = "ffmpeg -y -i %s -codec libfdk_aac -ar 8000 -b:a 8k %s" % (_fi0, _fo0)

    _command = _command.split(" ")

    _p = subprocess.Popen(_command, shell=False, stderr=subprocess.PIPE)
    _r = _p.wait()
    print _p.stderr.read()

    _d = None
    with open(_fo0, "rb") as _f:
        _d = _f.read()
    
    unlink(_fi0)
    unlink(_fo0)
    
    return _d
    

class AudioConverter:
    """
    input base64
    return base64
    """
    
    @staticmethod
    def wav2amr(_data):        
        _d = _convert(_data, "wav", "amr")
        return _d
    
    @staticmethod
    def wav2ogg(_data):
        _d = _convert(_data, "wav", "ogg")
        return _d
    
    @staticmethod
    def amr2ogg(_data):
        _d = _convert(_data, "amr", "ogg")
        return _d
    
    @staticmethod
    def ogg2amr(_data):
        _d = _convert(_data, "ogg", "amr")
        return _d
    
    @staticmethod
    def ogg2mp3(_data):
        _d = _convert(_data, "ogg", "mp3")
        return _d

    @staticmethod
    def amr2mp3(_data):
        _d = _convert(_data, "amr", "mp3")
        return _d

    @staticmethod
    def wav2mp3(_data):
        _d = _convert(_data, "wav", "mp3")
        return _d

    @staticmethod
    def m4a2mp3(_data):
        _d = _convert(_data, "m4a", "mp3")
        return _d

    @staticmethod
    def m4a2amr(_data):
        _d = _convert(_data, "m4a", "amr")
        return _d

    @staticmethod
    def amr2m4a(_data):
        _d = _convert(_data, "amr", "m4a")
        return _d

    @staticmethod
    def m4a2m4a(_data):
        _d = _convert(_data, "m4a", "m4a")
        return _d
