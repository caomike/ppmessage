# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# db/dbinstance.py
#

from .sqlpsql import SQLPSQL

def getDBSessionClass():
    db = SQLPSQL()
    db.createEngine()
    return db.getSessionClass()

def getDatabaseInstance():
    db = SQLPSQL()
    db.createEngine()
    return db

def getDatabaseEngine():
    db = SQLPSQL()
    db.createEngine()
    return db.dbengine

