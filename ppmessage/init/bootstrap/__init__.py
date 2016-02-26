# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# __init__.py
#

def get_bootstrap_data():
    try:
        from .data import BOOTSTRAP_DATA as bootstrap_data
    except:
        return None
    return bootstrap_data

