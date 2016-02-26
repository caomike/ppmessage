# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#

from ppmessage.help.datetimeencoder import DateTimeEncoder

from ppmessage.db.common.dbinstance import getDBSessionClass

from ppmessage.db.models import APNSSetting
from ppmessage.db.models import AppPackageInfo

from ppmessage.db.models import AppInfo
from ppmessage.db.models import AppUserData
from ppmessage.db.models import AppBillingData

from ppmessage.db.models import AdminUser
from ppmessage.db.models import DeviceUser
from ppmessage.db.models import DeviceInfo

from ppmessage.db.models import OrgGroup
from ppmessage.db.models import OrgSubGroupData
from ppmessage.db.models import OrgUserGroupData

from ppmessage.db.models import AppGroup
from ppmessage.db.models import AppUserGroupData

from ppmessage.db.models import AppGroupMenu
from ppmessage.db.models import AppMessageAction
from ppmessage.db.models import AppGroupDefaultRule

from ppmessage.db.models import DiscussionGroup
from ppmessage.db.models import DiscussionUserGroupData

from ppmessage.db.models import MessagePushTask
from ppmessage.db.models import MessagePush

from ppmessage.db.models import FileInfo
from ppmessage.db.models import MaterialRefInfo

from ppmessage.db.models import SingleCardMaterialInfo
from ppmessage.db.models import MultipleCardMaterialInfo

from ppmessage.db.models import UserContactData

from ppmessage.db.models import ConversationInfo
from ppmessage.db.models import ConversationUserData

from ppmessage.db.models import PCSocketInfo
from ppmessage.db.models import PCSocketDeviceData

from ppmessage.db.models import PortalWebSession

from ppmessage.db.models import ApiInfo
from ppmessage.db.models import ApiTokenData

from ppmessage.core.constant import REDIS_HOST
from ppmessage.core.constant import REDIS_PORT

from ppmessage.core.constant import CACHE_RUN_STATUS

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
