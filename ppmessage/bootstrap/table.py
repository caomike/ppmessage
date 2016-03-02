# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

from ppmessage.bootstrap.config import BOOTSTRAP_CONFIG

import subprocess
import traceback
import uuid

def _updateMessagePushTasksCharset(_engine):
    '''
    let it support store emoji
    '''
    _update = "ALTER TABLE message_push_tasks CHANGE body body VARCHAR(256) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
    _engine.execute(_update)

if __name__ == "__main__":

    DB_NAME = BOOTSTRAP_CONFIG.get("mysql").get("db_name")
    DB_PASS = BOOTSTRAP_CONFIG.get("mysql").get("db_pass")
    DB_USER = BOOTSTRAP_CONFIG.get("mysql").get("db_user")
    
    print "Drop MDM DB now, please wait..."
    
    _drop_cmd = "mysql -u%s -p%s mysql -e \"drop database if exists %s\"" % (DB_USER, DB_PASS, DB_NAME)
    _create_cmd = "mysql -u%s -p%s mysql -e \"create database %s default charset utf8\"" % (DB_USER, DB_PASS, DB_NAME)

    subprocess.check_output(_drop_cmd, shell=True)
    subprocess.check_output(_create_cmd, shell=True)

    from ppmessage.db.models import AdminUser
    from ppmessage.db.models import DeviceUser
    from ppmessage.db.models import OrgGroup
    from ppmessage.db.models import OrgSubGroupData
    from ppmessage.db.models import OrgUserGroupData

    from ppmessage.db.models import DeviceInfo

    from ppmessage.db.models import MessagePushTask
    from ppmessage.db.models import MessagePush

    from ppmessage.db.models import AppGroup
    from ppmessage.db.models import AppUserGroupData
    from ppmessage.db.models import AppGroupMenu
    from ppmessage.db.models import AppGroupDefaultRule
    from ppmessage.db.models import FileInfo
    from ppmessage.db.models import MessageAudioFileInfo
    from ppmessage.db.models import APNSSetting
    from ppmessage.db.models import OAuthSetting
    from ppmessage.db.models import OAuthInfo

    # PORTAL
    from ppmessage.db.models import AdminUser
    
    print "Initialize MDM DB now, please wait..."
    from ppmessage.db.sqlmysql import BaseModel
    from ppmessage.db.dbinstance import getDatabaseEngine
    import codecs
    codecs.register(lambda name: codecs.lookup('utf8') if name == 'utf8mb4' else None)
    _engine = getDatabaseEngine()
    BaseModel.metadata.create_all(_engine)

    # utf8mb4
    _updateMessagePushTasksCharset(_engine)    
    
    print "Initialize MDM DB done!"


    
