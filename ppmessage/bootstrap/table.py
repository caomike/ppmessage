# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

from ppmessage.core.constant import DB_PASS

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
    print "Drop MDM DB now, please wait..."
    _drop_cmd = "mysql -uroot -p%s mysql -e \"drop database if exists mdm\"" % (DB_PASS)
    _create_cmd = "mysql -uroot -p%s mysql -e \"create database mdm default charset utf8\"" % (DB_PASS)

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
    from ppmessage.db.common.sqlmysql import BaseModel
    from ppmessage.db.common.dbinstance import getDatabaseEngine
    import codecs
    codecs.register(lambda name: codecs.lookup('utf8') if name == 'utf8mb4' else None)
    _engine = getDatabaseEngine()
    BaseModel.metadata.create_all(_engine)

    # utf8mb4
    _updateMessagePushTasksCharset(_engine)    
    
    print("create dbviews...")
    _createDBViews(_engine)
    
    print("create dtviews...")
    _createDTViews(_engine)

    print "Initialize MDM DB done!"


    
