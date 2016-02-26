# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage YVertical.
# Yuan Wanshang, wanshang.yuan@yvertical.com
# All rights reserved
#
# help/csv2mysql.py
#

from mdm.db.common.dbinstance import getDatabaseInstance
from mdm.db.models import DeviceUser
from mdm.db.models import OrgGroup
from mdm.db.models import OrgUserGroupData
from mdm.db.models import OrgSubGroupData

import traceback
import csv
import chardet

def Csv2Mysql(csv_file):
    dbsession_class = getDatabaseInstance().dbsession_class
    db_session = dbsession_class()
    csv_data = csv.reader(file(csv_file))

    flag = 0
    for i in csv_data:
        flag += 1
        if flag != 1:
            row = []
            for item in i:
                row.append(encodeToUtf8(item, code_str))
            try:
                user_id = isUserExists(db_session, row[0])
                if not user_id:
                    deviceuser = DeviceUser()
                    deviceuser.user_name = row[0]
                    deviceuser.user_fullname = row[1]
                    deviceuser.user_email = row[2]
                    deviceuser.user_type = row[3]
                    deviceuser.user_status = row[4]
                    deviceuser.user_icon = "/static/yvertical/assets/img/user1.png"
                    deviceuser.user_gender = row[5]
                    deviceuser.user_dob = row[6]
                    deviceuser.user_doj = row[7]
                    deviceuser.user_rid = row[8]
                    deviceuser.user_iid = row[9]
                    is_byod = isByod(row[12])
                    deviceuser.user_is_byod = is_byod
                    deviceuser.user_is_enod = not is_byod
                    db_session.add(deviceuser)
                    db_session.commit()
                    user_id = deviceuser.id
            except:
                dbsession_class.remove()
                traceback.print_exc()
                break
                
            try:
                group_id = isGroupExists(db_session, row[11])
                if not group_id:
                    orggroup = OrgGroup()
                    orggroup.group_name = row[11]
                    orggroup.group_icon = "/static/yvertical/assets/img/group.jpg"
                    db_session.add(orggroup)
                    db_session.commit()
                    group_id = orggroup.id
            except:
                dbsession_class.remove()
                traceback.print_exc()

            try:
                user_data_id = isUserDataExists(db_session, user_id, group_id)
                if not user_data_id:
                    user_data = OrgUserGroupData()
                    user_data.group_id = group_id
                    user_data.user_id = user_id
                    user_data.is_leader = isLeader(row[10])
                    db_session.add(user_data)
                    db_session.commit()
            except:
                dbsession_class.remove()
                traceback.print_exc()

        else:
            if isinstance(i[0], unicode):
                code_str = None
            else:
                code_str = chardet.detect(i[0])["encoding"]

def isUserExists(db_session, _o):
    try:
        user_obj = db_session.query(DeviceUser.id).filter(DeviceUser.user_name==_o).scalar()
        if user_obj:
            return user_obj
        else:
            return False
    except:
        dbsession_class.remove()
        traceback.print_exc()
    
def isGroupExists(db_session, _o):
    try:
        group_obj = db_session.query(OrgGroup.id).filter(OrgGroup.group_name==_o).scalar()
        if group_obj:
            return group_obj
        else:
            return False
    except:
        dbsession_class.remove()
        traceback.print_exc()

def isUserDataExists(db_session, _uid, _gid):
    try:
        user_data = db_session.query(OrgUserGroupData)\
                              .filter(OrgUserGroupData.group_id==_gid)\
                              .filter(OrgUserGroupData.user_id==_uid).scalar()
        if user_data:
            return True
        else:
            return False
    except:
        dbsession_class.remove()
        traceback.print_exc()

def isLeader(_o):
    if _o == "y":
        return True
    else:
        return False

def isByod(_o):
    if _o == "是":
        return True
    else:
        return False

def encodeToUtf8(_o, code_str):
    if code_str:
        return _o.decode(code_str).encode("utf-8")
    else:
        return _o.encode("utf-8")
