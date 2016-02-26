# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# db/dbinstance.py
#

from .sqlmysql import SQLMysql

def getDBSessionClass():
    db = SQLMysql()
    db.createEngine()
    return db.getSessionClass()

def getDatabaseInstance():
    db = SQLMysql()
    db.createEngine()
    return db

def getDatabaseEngine():
    db = SQLMysql()
    db.createEngine()
    return db.dbengine
