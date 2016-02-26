# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

from mdm.help.datetimeencoder import DateTimeEncoder

from mdm.db.common.dbinstance import getDBSessionClass

from mdm.db.models import APNSSetting
from mdm.db.models import AppPackageInfo

from mdm.db.models import AppInfo
from mdm.db.models import AppUserData
from mdm.db.models import AppBillingData

from mdm.db.models import AdminUser
from mdm.db.models import DeviceUser
from mdm.db.models import DeviceInfo

from mdm.db.models import OrgGroup
from mdm.db.models import OrgSubGroupData
from mdm.db.models import OrgUserGroupData

from mdm.db.models import AppGroup
from mdm.db.models import AppUserGroupData

from mdm.db.models import AppGroupMenu
from mdm.db.models import AppMessageAction
from mdm.db.models import AppGroupDefaultRule

from mdm.db.models import DiscussionGroup
from mdm.db.models import DiscussionUserGroupData

from mdm.db.models import MessagePushTask
from mdm.db.models import MessagePush

from mdm.db.models import FileInfo
from mdm.db.models import MaterialRefInfo

from mdm.db.models import SingleCardMaterialInfo
from mdm.db.models import MultipleCardMaterialInfo

from mdm.db.models import UserContactData

from mdm.db.models import ConversationInfo
from mdm.db.models import ConversationUserData

from mdm.db.models import PCSocketInfo
from mdm.db.models import PCSocketDeviceData

from mdm.db.models import PortalWebSession

from mdm.db.models import ApiInfo
from mdm.db.models import ApiTokenData

from mdm.core.constant import REDIS_HOST
from mdm.core.constant import REDIS_PORT

from mdm.core.constant import CACHE_RUN_STATUS

from sqlalchemy import DateTime

import redis
import logging
import datetime
import traceback

def _load_generic(_cls, _redis, _session):
    _all = _session.query(_cls).all()
    for _i in _all:
        _i.create_redis_keys(_redis, _is_load=True)
    return

def load():
    _redis = redis.Redis(REDIS_HOST, REDIS_PORT, db=1)
    _redis.flushdb()
    _session_class = getDBSessionClass()
    _session = _session_class()

    _cls_list = [
        AdminUser,
        DeviceUser,
        DeviceInfo,            
        
        ConversationInfo,
        ConversationUserData,
        
        FileInfo,
        MaterialRefInfo,
        
        AppInfo,
        AppUserData,
        AppBillingData,
        
        MessagePushTask,
        MessagePush,
        
        APNSSetting,
        AppPackageInfo,
        
        PCSocketInfo,
        PCSocketDeviceData,

        PortalWebSession,

        OrgGroup,
        OrgUserGroupData,        

        ApiInfo,
    ]

    logging.basicConfig(level=logging.DEBUG)
    
    try:
        for _i in _cls_list:
            logging.info("Loading %s...", _i.__tablename__)
            _load_generic(_i, _redis, _session)
            logging.info("Loading .... done.")
    except:
        traceback.print_exc()
    finally:
        _session_class.remove()
        
    logging.info("$$$$$$$$$$$ LOAD DONE $$$$$$$$$$$$$")
    return
    
if __name__ == "__main__":
    load()
