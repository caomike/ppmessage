# -*- coding: utf-8 -*-
# Copyright (C) 2010-2016 PPMessage YVertical.
#
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# help/datetime.py
#
from ppmessage.core.constant import DATETIME_FORMAT
import datetime
import time

def now_to_string(_fmt):
    return datetime.datetime.now().strftime(DATETIME_FORMAT[_fmt])

def string_to_datetime(_str, _fmt):
    return datetime.datetime.strptime(_str, DATETIME_FORMAT[_fmt])

def datetime_to_timestamp(_dt):
    return int(time.mktime(_dt.timetuple()))
