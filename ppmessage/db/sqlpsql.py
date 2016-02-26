# -*- coding: utf-8 -*-
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# mdm/db/sqlmysql.py
#

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import scoped_session
from sqlalchemy import create_engine

from sqlalchemy import exc
from sqlalchemy import event
from sqlalchemy.pool import Pool

from ppmessage.core.singleton import singleton
from ppmessage.core import getMDMDBHost
from ppmessage.core import getMDMDBName
from ppmessage.core import getMDMDBUser
from ppmessage.core import getMDMDBPassword

import traceback

BaseModel = declarative_base()

@event.listens_for(Pool, "checkout")
def ping_connection(dbapi_connection, connection_record, connection_proxy):
    try:
        cursor = dbapi_connection.cursor()
        cursor.execute("SELECT 1")
        cursor.close()
    except:
        # optional - dispose the whole pool
        # instead of invalidating one at a time
        # connection_proxy._pool.dispose()

        # raise DisconnectionError - pool will try
        # connecting again up to three times before raising.
        raise exc.DisconnectionError()
    
    
@singleton
class SQLPSQL():

    def __init__(self):
        self.dbhost = getMDMDBHost()
        self.dbname = getMDMDBName()
        self.dbuser = getMDMDBUser()
        self.dbpassword = getMDMDBPassword()
        self.dbengine = None
        self.dbsession_class = None
        
    def createEngine(self):
                
        db_string = "postgresql+psycopg2://%s:%s@%s/%s" % (self.dbuser, 
                                                           self.dbpassword,
                                                           self.dbhost,
                                                           self.dbname)
        if self.dbengine == None:
            self.dbengine = create_engine(db_string, echo_pool=True)
        # it will create a thread local session for every single web request
        return self.dbengine

    def getSessionClass(self):
        assert(self.dbengine)
        return scoped_session(sessionmaker(bind=self.dbengine))

    def createTables(self):
        BaseModel.metadata.create_all(self.dbengine)
        

