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


def _dbview_object_infos(_engine):
    _drop_cmd = "mysql -uroot -p%s mdm -e \"drop view if exists dbview_object_infos\"" % (DB_PASS)
    subprocess.check_output(_drop_cmd, shell=True)
    _create_sql = "create view dbview_object_infos as \
    select  \
    \"DU\" as type, \
    device_users.uuid as uuid, \
    device_users.user_fullname as name, \
    device_users.user_icon as icon \
    from device_users \
    union \
    select  \
    \"AU\" as type, \
    admin_users.uuid as uuid, \
    admin_users.user_fullname as name, \
    admin_users.user_icon as icon \
    from admin_users \
    union \
    select \
    \"OG\" as type, \
    org_groups.uuid as uuid, \
    org_groups.group_name as name, \
    org_groups.group_icon as icon \
    from org_groups \
    union \
    select \
    \"AG\" as type, \
    app_groups.uuid as uuid, \
    app_groups.group_name as name, \
    app_groups.group_icon as icon \
    from app_groups"
    
    _engine.execute(_create_sql)

    
def _createDBViews(_engine):
    _dbview_object_infos(_engine)


def _dtview_root_org_groups(_engine):
    _drop_cmd = "mysql -uroot -p%s mdm -e \"drop view if exists dtview_root_org_groups\"" % (DB_PASS)
    subprocess.check_output(_drop_cmd, shell=True)
    _create_sql = "create view dtview_root_org_groups as \
    select * \
    from org_groups where is_root=1"
    
    _engine.execute(_create_sql)


def _dtview_org_group_users(_engine):
    # org_user_group_datas with some of device user and enterprise user
    _drop_cmd = "mysql -uroot -p%s mdm -e \"drop view if exists dtview_org_group_users\"" % (DB_PASS)
    subprocess.check_output(_drop_cmd, shell=True)
    _create_sql = "create view dtview_org_group_users as \
    select ou.*, du.user_name, du.user_fullname, du.user_icon\
    from org_user_group_datas ou \
    left join device_users du on ou.user_uuid = du.uuid"
    _engine.execute(_create_sql)

    
def _dtview_org_sub_groups(_engine):
    # org_sub_group_datas with some info of sub groups
    _drop_cmd = "mysql -uroot -p%s mdm -e \"drop view if exists dtview_org_sub_groups\"" % (DB_PASS)
    subprocess.check_output(_drop_cmd, shell=True)
    _create_sql = "create view dtview_org_sub_groups as \
    select og.*, g.group_name as sub_group_name, g.group_icon as sub_group_icon, g.group_desc as sub_group_desc \
    from org_sub_group_datas og \
    left join org_groups g on og.sub_group_uuid = g.uuid \
    "
    _engine.execute(_create_sql)

        
def _dtview_app_users(_engine):
    # device user view
    _drop_cmd = "mysql -uroot -p%s mdm -e \"drop view if exists dtview_app_users\"" % (DB_PASS)
    subprocess.check_output(_drop_cmd, shell=True)
    
    _create_sql = "create view dtview_app_users as \
    select app_user_datas.uuid as uuid, \
    device_users.uuid as user_uuid, \
    device_users.user_fullname as user_fullname, \
    device_users.user_email as user_email, \
    device_users.user_icon as user_icon, \
    device_users.createtime as createtime, \
    device_users.is_anonymous_user as is_anonymous_user, \
    app_infos.uuid as app_uuid, \
    app_infos.app_name as app_name, \
    app_infos.user_uuid as app_user_uuid, \
    app_user_datas.is_portal_user as is_portal_user, \
    app_user_datas.is_owner_user as is_owner_user, \
    app_user_datas.is_service_user as is_service_user \
    from app_user_datas \
    left join device_users on \
    app_user_datas.user_uuid = device_users.uuid \
    left join app_infos on \
    app_user_datas.app_uuid = app_infos.uuid"

    _engine.execute(_create_sql)
    return

def _dtview_message_infos(_engine):
    _drop_cmd = "mysql -uroot -p%s mdm -e \"drop view if exists dtview_message_infos\"" % (DB_PASS)
    subprocess.check_output(_drop_cmd, shell=True)
    _create_sql = "create view dtview_message_infos as \
    select \
    message_push_tasks.uuid as uuid, \
    message_push_tasks.from_uuid as from_uuid, \
    message_push_tasks.from_type as from_type, \
    message_push_tasks.to_uuid as to_uuid, \
    message_push_tasks.to_type as to_type, \
    message_push_tasks.message_type as message_type, \
    message_push_tasks.message_subtype as message_subtype, \
    message_push_tasks.title as title, \
    message_push_tasks.body as body, \
    message_push_tasks.message_body as message_body, \
    message_push_tasks.task_status as task_status, \
    message_push_tasks.createtime as createtime, \
    dbview_object_infos_from.name as from_name, \
    dbview_object_infos_from.icon as from_icon, \
    dbview_object_infos_to.name as to_name, \
    dbview_object_infos_to.icon as to_icon \
    from message_push_tasks \
    inner join \
    dbview_object_infos as dbview_object_infos_from \
    on message_push_tasks.from_uuid=dbview_object_infos_from.uuid \
    inner join \
    dbview_object_infos as dbview_object_infos_to \
    on message_push_tasks.to_uuid=dbview_object_infos_to.uuid"
    
    _engine.execute(_create_sql)



def _dtview_user_messages(_engine):
# device user view
    _drop_cmd = "mysql -uroot -p%s mdm -e \"drop view if exists dtview_user_messages\"" % (DB_PASS)
    subprocess.check_output(_drop_cmd, shell=True)
    _create_sql = "create view dtview_user_messages as \
    select \
    message_pushs.task_uuid as uuid, \
    message_pushs.task_uuid as receive_task_uuid, \
    null as send_task_uuid, \
    message_pushs.user_uuid as user_uuid, \
    dbview_object_infos_send.name as from_name, \
    dbview_object_infos_send.icon as from_icon, \
    dbview_object_infos_send.type as from_type, \
    dbview_object_infos_send.uuid as from_uuid, \
    device_users.uuid as to_uuid, \
    device_users.user_fullname as to_name, \
    device_users.user_icon as to_icon, \
    \"DU\" as to_type, \
    message_push_tasks.createtime as createtime, \
    message_push_tasks.message_type as message_type, \
    message_push_tasks.message_subtype as message_subtype, \
    message_push_tasks.task_status as task_status, \
    message_push_tasks.body as body, \
    message_push_tasks.message_body as message_body \
    from message_pushs \
    left join device_users on message_pushs.user_uuid=device_users.uuid \
    left join message_push_tasks on message_pushs.task_uuid=message_push_tasks.uuid \
    left join dbview_object_infos as dbview_object_infos_send \
    on dbview_object_infos_send.uuid=message_push_tasks.from_uuid \
    union \
    select \
    message_push_tasks.uuid as uuid, \
    null as receive_task_uuid, \
    message_push_tasks.uuid as send_task_uuid, \
    message_push_tasks.from_uuid as user_uuid, \
    dbview_object_infos_receive.name as to_name, \
    dbview_object_infos_receive.icon as to_icon, \
    dbview_object_infos_receive.type as to_type, \
    dbview_object_infos_receive.uuid as to_uuid, \
    device_users.uuid as from_uuid, \
    device_users.user_fullname as from_name, \
    device_users.user_icon as from_icon, \
    \"DU\" as from_type, \
    message_push_tasks.createtime as createtime, \
    message_push_tasks.message_type as message_type, \
    message_push_tasks.message_subtype as message_subtype, \
    message_push_tasks.task_status as task_status, \
    message_push_tasks.body as body, \
    message_push_tasks.message_body as message_body \
    from message_push_tasks \
    left join device_users on message_push_tasks.from_uuid=device_users.uuid \
    left join dbview_object_infos as dbview_object_infos_receive \
    on dbview_object_infos_receive.uuid=message_push_tasks.to_uuid"
    
    _engine.execute(_create_sql)


def _dtview_service_messages(_engine):
# device user view
    _drop_cmd = "mysql -uroot -p%s mdm -e \"drop view if exists dtview_service_messages\"" % (DB_PASS)
    subprocess.check_output(_drop_cmd, shell=True)
    _create_sql = "create view dtview_service_messages as \
    select \
    message_push_tasks.uuid as uuid, \
    message_push_tasks.from_uuid as group_uuid, \
    message_push_tasks.from_uuid as from_uuid, \
    message_push_tasks.from_type as from_type, \
    message_push_tasks.from_uuid as to_uuid, \
    message_push_tasks.from_type as to_type, \
    message_push_tasks.createtime as createtime, \
    message_push_tasks.message_type as message_type, \
    message_push_tasks.message_subtype as message_subtype, \
    message_push_tasks.task_status as task_status, \
    message_push_tasks.body as body, \
    message_push_tasks.message_body as message_body, \
    dbview_object_infos_from.icon as from_icon, \
    dbview_object_infos_from.name as from_name, \
    dbview_object_infos_to.icon as to_icon, \
    dbview_object_infos_to.name as to_name \
    from message_push_tasks \
    left join dbview_object_infos as dbview_object_infos_to \
    on dbview_object_infos_to.uuid=message_push_tasks.to_uuid \
    left join dbview_object_infos as dbview_object_infos_from \
    on dbview_object_infos_from.uuid=message_push_tasks.from_uuid \
    where message_push_tasks.from_type=\"AG\" \
    union \
    select \
    message_push_tasks.uuid as uuid, \
    message_push_tasks.to_uuid as group_uuid, \
    message_push_tasks.from_uuid as from_uuid, \
    message_push_tasks.from_type as from_type, \
    message_push_tasks.from_uuid as to_uuid, \
    message_push_tasks.from_type as to_type, \
    message_push_tasks.createtime as createtime, \
    message_push_tasks.message_type as message_type, \
    message_push_tasks.message_subtype as message_subtype, \
    message_push_tasks.task_status as task_status, \
    message_push_tasks.body as body, \
    message_push_tasks.message_body as message_body, \
    dbview_object_infos_from.icon as from_icon, \
    dbview_object_infos_from.name as from_name, \
    dbview_object_infos_to.icon as to_icon, \
    dbview_object_infos_to.name as to_name \
    from message_push_tasks \
    left join dbview_object_infos as dbview_object_infos_to \
    on dbview_object_infos_to.uuid=message_push_tasks.to_uuid \
    left join dbview_object_infos as dbview_object_infos_from \
    on dbview_object_infos_from.uuid=message_push_tasks.from_uuid \
    where message_push_tasks.to_type=\"AG\" and \
    message_push_tasks.from_type=\"DU\" "
    
    _engine.execute(_create_sql)

    
def _dtview_user_app_infos(_engine):
# device user view
    _drop_cmd = "mysql -uroot -p%s mdm -e \"drop view if exists dtview_user_app_infos\"" % (DB_PASS)
    subprocess.check_output(_drop_cmd, shell=True)
    _create_sql = "create view dtview_user_app_infos as \
    select \
    user_app_infos.uuid as uuid, \
    user_app_infos.user_uuid as user_uuid, \
    user_app_infos.device_uuid as device_uuid, \
    user_app_infos.app_uuid as app_uuid, \
    user_app_infos.installed_version_name as installed_version_name, \
    user_app_infos.installed_version_code as installed_version_code, \
    device_infos.device_fullname as device_fullname, \
    device_infos.device_ostype as device_ostype, \
    device_infos.device_osversion as device_osversion, \
    device_infos.device_ios_model as device_ios_model, \
    device_infos.device_android_apilevel as device_android_apilevel, \
    app_package_infos.app_friendly_name as app_friendly_name, \
    app_package_infos.app_distinct_name as app_distinct_name, \
    app_package_infos.app_file_uuid as app_file_uuid, \
    app_package_infos.app_file_name as app_file_name, \
    app_package_infos.app_icon_uuid as app_icon_uuid, \
    app_package_infos.app_version_name as app_version_name,\
    app_package_infos.app_version_code as app_version_code \
    from user_app_infos \
    left join device_infos on user_app_infos.device_uuid=device_infos.uuid \
    left join app_package_infos on user_app_infos.app_uuid=app_package_infos.uuid"
    _engine.execute(_create_sql)

def _dtview_app_groups(_engine):
    # device user view
    _drop_cmd = "mysql -uroot -p%s mdm -e \"drop view if exists dtview_app_groups\"" % (DB_PASS)
    subprocess.check_output(_drop_cmd, shell=True)
    _create_sql = "create view dtview_app_groups as \
    select \
    app_groups.uuid as uuid, \
    app_groups.group_name as group_name, \
    app_groups.group_type as group_type, \
    app_groups.group_desc as group_desc, \
    app_groups.group_icon as group_icon, \
    app_groups.createtime as createtime, \
    app_groups.user_uuid as user_uuid, \
    dbview_object_infos.name as user_name, \
    dbview_object_infos.icon as user_icon, \
    dbview_object_infos.type as user_type \
    from app_groups \
    left join dbview_object_infos on \
    app_groups.user_uuid = dbview_object_infos.uuid"
    
    _engine.execute(_create_sql)


def _dtview_app_user_group_datas(_engine):
    _drop_cmd = "mysql -uroot -p%s mdm -e \"drop view if exists dtview_app_user_group_datas\"" % (DB_PASS)
    subprocess.check_output(_drop_cmd, shell=True)
    _create_sql = "create view dtview_app_user_group_datas as \
    select \
    app_user_group_datas.uuid as uuid, \
    app_user_group_datas.group_uuid as group_uuid, \
    app_user_group_datas.user_uuid as user_uuid, \
    dbview_object_infos.name as user_name, \
    dbview_object_infos.icon as user_icon \
    from app_user_group_datas \
    left join dbview_object_infos on \
    dbview_object_infos.uuid=app_user_group_datas.user_uuid"
    
    _engine.execute(_create_sql)

    
def _dtview_file_infos(_engine):
    # device user view
    _drop_cmd = "mysql -uroot -p%s mdm -e \"drop view if exists dtview_file_infos\"" % (DB_PASS)
    subprocess.check_output(_drop_cmd, shell=True)
    _create_sql = "create view dtview_file_infos as \
    select \
    file_infos.uuid as uuid, \
    file_infos.file_name as file_name, \
    file_infos.file_mime as file_mime, \
    file_infos.file_size as file_size, \
    file_infos.user_uuid as user_uuid, \
    file_infos.createtime as createtime, \
    device_users.user_fullname as user_fullname, \
    device_users.user_icon as user_icon \
    from file_infos \
    left join device_users on \
    file_infos.user_uuid = device_users.uuid \
    where file_infos.material_type != 'application/x-yv-icon' "

    
    _engine.execute(_create_sql)


def _dtview_admin_received_messages(_engine):
    # device user view
    _drop_cmd = "mysql -uroot -p%s mdm -e \"drop view if exists dtview_admin_received_messages\"" % (DB_PASS)
    subprocess.check_output(_drop_cmd, shell=True)
    _create_sql = "create view dtview_admin_received_messages as \
    select \
    message_push_tasks.uuid as uuid, \
    message_push_tasks.title as message_title, \
    message_push_tasks.body as message_body, \
    device_users.user_fullname as user_fullname, \
    device_users.user_icon as user_icon, \
    device_users.uuid as user_uuid \
    from message_push_tasks \
    left join device_users on \
    message_push_tasks.from_uuid = device_users.uuid \
    where message_push_tasks.to_type='AU' and message_push_tasks.from_type='DU'"
    
    _engine.execute(_create_sql)


def _dtview_image_material_infos(_engine):
    """
    the material needs a user as owner
    if created by any admin, the owner is null
    """
    _drop_cmd = "mysql -uroot -p%s mdm -e \"drop view if exists dtview_image_material_infos\"" % (DB_PASS)
    subprocess.check_output(_drop_cmd, shell=True)
    _create_sql = "create view dtview_image_material_infos as \
    select \
    file_infos.uuid as uuid, \
    file_infos.file_name as file_name, \
    file_infos.file_mime as file_mime, \
    file_infos.file_size as file_size, \
    file_infos.user_uuid as user_uuid, \
    file_infos.createtime as createtime, \
    dbview_object_infos.name as user_name, \
    dbview_object_infos.icon as user_icon, \
    dbview_object_infos.type as user_type \
    from file_infos \
    left join dbview_object_infos on \
    file_infos.user_uuid = dbview_object_infos.uuid \
    where file_infos.material_type = 'application/x-yv-material-image' "
    
    _engine.execute(_create_sql)


def _dtview_single_card_material_infos(_engine):
    _drop_cmd = "mysql -uroot -p%s mdm -e \"drop view if exists dtview_single_card_material_infos\"" % (DB_PASS)
    subprocess.check_output(_drop_cmd, shell=True)
    _create_sql = "create view dtview_single_card_material_infos as \
    select \
    single_card_material_infos.uuid as uuid, \
    single_card_material_infos.user_uuid as user_uuid, \
    single_card_material_infos.title as title, \
    single_card_material_infos.abstract as abstract, \
    single_card_material_infos.cover_file_uuid as cover_file_uuid, \
    single_card_material_infos.content_file_uuid as content_file_uuid, \
    single_card_material_infos.createtime as createtime, \
    dbview_object_infos.name as user_name, \
    dbview_object_infos.icon as user_icon, \
    dbview_object_infos.type as user_type \
    from single_card_material_infos \
    left join dbview_object_infos on \
    single_card_material_infos.user_uuid = dbview_object_infos.uuid"
        
    _engine.execute(_create_sql)

def _dtview_video_material_infos(_engine):
    _drop_cmd = "mysql -uroot -p%s mdm -e \"drop view if exists dtview_video_material_infos\"" % (DB_PASS)
    subprocess.check_output(_drop_cmd, shell=True)
    _create_sql = "create view dtview_video_material_infos as \
    select \
    video_material_infos.uuid as uuid, \
    video_material_infos.user_uuid as user_uuid, \
    video_material_infos.cover_file_uuid as cover_file_uuid, \
    video_material_infos.video_file_uuid as video_file_uuid, \
    video_material_infos.duration as duration, \
    video_material_infos.createtime as createtime, \
    file_infos.file_name as file_name, \
    file_infos.file_size as file_size, \
    file_infos.file_mime as file_mime, \
    dbview_object_infos.name as user_name, \
    dbview_object_infos.icon as user_icon, \
    dbview_object_infos.type as user_type \
    from video_material_infos \
    left join dbview_object_infos on \
    video_material_infos.user_uuid = dbview_object_infos.uuid \
    left join file_infos on \
    file_infos.uuid = video_material_infos.video_file_uuid"
    
    _engine.execute(_create_sql)

def _dtview_document_material_infos(_engine):
    _drop_cmd = "mysql -uroot -p%s mdm -e \"drop view if exists dtview_document_material_infos\"" % (DB_PASS)
    subprocess.check_output(_drop_cmd, shell=True)
    _create_sql = "create view dtview_document_material_infos as \
    select \
    file_infos.uuid as uuid, \
    file_infos.user_uuid as user_uuid, \
    file_infos.createtime as createtime, \
    file_infos.file_name as file_name, \
    file_infos.file_size as file_size, \
    file_infos.file_mime as file_mime, \
    dbview_object_infos.name as user_name, \
    dbview_object_infos.icon as user_icon, \
    dbview_object_infos.type as user_type \
    from file_infos \
    left join dbview_object_infos on \
    file_infos.user_uuid = dbview_object_infos.uuid \
    where file_infos.material_type = 'application/x-yv-material-document'"
    
    _engine.execute(_create_sql)


def _dtview_audio_material_infos(_engine):
    _drop_cmd = "mysql -uroot -p%s mdm -e \"drop view if exists dtview_audio_material_infos\"" % (DB_PASS)
    subprocess.check_output(_drop_cmd, shell=True)
    _create_sql = "create view dtview_audio_material_infos as \
    select \
    file_infos.uuid as uuid, \
    file_infos.user_uuid as user_uuid, \
    file_infos.createtime as createtime, \
    file_infos.file_name as file_name, \
    file_infos.file_size as file_size, \
    file_infos.file_mime as file_mime, \
    dbview_object_infos.name as user_name, \
    dbview_object_infos.icon as user_icon, \
    dbview_object_infos.type as user_type \
    from file_infos \
    left join dbview_object_infos on \
    file_infos.user_uuid = dbview_object_infos.uuid \
    where file_infos.material_type = 'application/x-yv-material-audio'"
    
    _engine.execute(_create_sql)


def _dtview_file_material_infos(_engine):
    _drop_cmd = "mysql -uroot -p%s mdm -e \"drop view if exists dtview_file_material_infos\"" % (DB_PASS)
    subprocess.check_output(_drop_cmd, shell=True)
    _create_sql = "create view dtview_file_material_infos as \
    select \
    file_infos.uuid as uuid, \
    file_infos.user_uuid as user_uuid, \
    file_infos.createtime as createtime, \
    file_infos.file_name as file_name, \
    file_infos.file_size as file_size, \
    file_infos.file_mime as file_mime, \
    dbview_object_infos.name as user_name, \
    dbview_object_infos.icon as user_icon, \
    dbview_object_infos.type as user_type \
    from file_infos \
    left join dbview_object_infos on \
    file_infos.user_uuid = dbview_object_infos.uuid \
    where file_infos.material_type = 'application/x-yv-material-file'"
    
    _engine.execute(_create_sql)


    
def _createDTViews(_engine):
    _dtview_root_org_groups(_engine)
    _dtview_org_group_users(_engine)
    _dtview_org_sub_groups(_engine)
    _dtview_user_messages(_engine)
    _dtview_user_app_infos(_engine)
    _dtview_app_groups(_engine)
    _dtview_file_infos(_engine)
    _dtview_admin_received_messages(_engine)
    _dtview_image_material_infos(_engine)
    _dtview_single_card_material_infos(_engine)
    _dtview_video_material_infos(_engine)
    _dtview_document_material_infos(_engine)
    _dtview_file_material_infos(_engine)
    _dtview_audio_material_infos(_engine)
    _dtview_message_infos(_engine)
    _dtview_app_user_group_datas(_engine)    
    _dtview_service_messages(_engine)
    _dtview_app_users(_engine)
    return
    
def _createAPNSSetting():
    from ppmessage.db.common.dbinstance import getDBSessionClass

    session_class = getDBSessionClass()
    session = session_class()
    _object = APNSSetting(
        uuid=str(uuid.uuid1())
    )
    session.add(_object)
    try:
        session.commit()
    except:
        traceback.print_exc()
    finally:
        session_class.remove()

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


    
