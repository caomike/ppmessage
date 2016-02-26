# -*- coding: utf-8 -*-
# Copyright (C) 2010-2016 PPMessage YVertical.
#
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# help/days.py
#

import datetime

def get_between_days(_begin, _end):
    _b = datetime.datetime.strptime(_begin, "%Y-%m-%d")
    _e = datetime.datetime.strptime(_end, "%Y-%m-%d")
    _delta = _e - _b
    _date_list = []
    for i in range(_delta.days+1):
        _d = _b + datetime.timedelta(days=i)
        _date_list.append(_d.date().strftime("%Y-%m-%d"))
    return _date_list

def get_day_begin_end(_day):
    _begin = datetime.datetime.strptime(_day.strftime("%Y-%m-%d 00:00:00"), "%Y-%m-%d %H:%M:%S")
    _end = datetime.datetime.strptime(_day.strftime("%Y-%m-%d 23:59:59"), "%Y-%m-%d %H:%M:%S")
    return _begin, _end
