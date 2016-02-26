# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# 
#

import logging


_the_logger = None

def set_app_name(_name):
    p = logging.getLogger(_name)
    p.setLevel(logging.DEBUG)
    ch = logging.StreamHandler()
    ch.setLevel(logging.DEBUG)
    #formatter = logging.Formatter(_name + ' AA%(asctime)s - %(message)s')
    #ch.setFormatter(formatter)
    p.addHandler(ch)

    _the_logger = p

def log_error(_log):
    if _the_logger is not None:
        _the_logger.error(_log)
    else:
        logging.error(_log)

def log_info(_log):
    #if _the_logger is not None:
    #    logging.info(_log)
    #else:
    #    logging.info(_log)
    logging.info(_log)
