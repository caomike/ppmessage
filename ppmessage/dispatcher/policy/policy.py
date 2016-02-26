# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 .
# Guijin Ding, dingguijin@gmail.com
#
#


from .algorithm import AbstractAlgorithm

from mdm.core.constant import IOS_FAKE_TOKEN

from mdm.core.constant import CONVERSATION_TYPE
from mdm.core.constant import MESSAGE_SUBTYPE
from mdm.core.constant import MESSAGE_TYPE
from mdm.core.constant import MESSAGE_STATUS
from mdm.core.constant import TASK_STATUS

from mdm.core.constant import PPCOM_OFFLINE
from mdm.core.constant import APP_POLICY
from mdm.core.constant import YVOBJECT
from mdm.core.constant import DIS_SRV
from mdm.core.constant import OS

from mdm.db.models import OrgGroup
from mdm.db.models import DeviceUser
from mdm.db.models import DeviceInfo
from mdm.db.models import OrgUserGroupData
from mdm.db.models import AppUserData
from mdm.db.models import MessagePush
from mdm.db.models import MessagePushTask
from mdm.db.models import PCSocketInfo
from mdm.db.models import PCSocketDeviceData
from mdm.db.models import ConversationUserData

from mdm.core.srv.signal import async_signal_dis_message
from mdm.core.srv.signal import async_signal_iospush_push
from mdm.core.srv.signal import async_signal_pcsocket_push
from mdm.core.srv.signal import async_signal_mqttpush_push

from mdm.core.redis import redis_hash_to_dict
from mdm.help.datetimestring import datetime_to_timestamp

from apnsclient import Message

from operator import itemgetter

import uuid
import time
import json
import logging


_registry = {}

class Meta(type):
    def __init__(cls, name, bases, dict_):
        _registry[name] = cls
        type.__init__(cls, name, bases, dict_)
        return

    @classmethod
    def name(cls):
        return APP_POLICY.META

Policy = Meta("Policy", (object,), {})

class AbstractPolicy(Policy):

    def __init__(self, dis):
        self._dis = dis
        self._task = dis._task

        self._redis = dis.application.redis
        
        self._online_users = set()
        self._offline_users = set()
        
        self._devices = set()

        self._devices_hash = {}
        self._users_hash = {}

        self._is_service_user = {}
        self._conversation_users = set()
        self._conversation_user_datas_uuid = {}
        self._conversation_user_datas_hash = {}
        
        self._users = set()
        
        self._name = APP_POLICY.ABASTRACT
        return

    @classmethod
    def name(cls):
        return APP_POLICY.ABASTRACT

    @classmethod
    def get_policy_cls_by_name(cls, name):
        _p = BroadcastPolicy
        if name == None:
            return _p
        
        for i in _registry:
            if _registry[i].name() == name:
                _p = _registry[i]
                break
        return _p

    @classmethod
    def conversation_users(cls, _app_uuid, _conversation_uuid, _redis):
        _key = ConversationUserData.__tablename__ + ".conversation_uuid." + _conversation_uuid
        _users = _redis.smembers(_key)
        return list(_users)

    @classmethod
    def conversation_datas(cls, _app_uuid, _conversation_uuid, _users, _redis):
        _pi = _redis.pipeline()
        _pre = ConversationUserData.__tablename__ + ".app_uuid." + _app_uuid + ".user_uuid."
        _pos = ".conversation_uuid." + _conversation_uuid
        for _user_uuid in _users:
            _key = _pre + _user_uuid + _pos
            _pi.get(_key)
        _datas = _pi.execute()
        return _datas

    @classmethod
    def create_conversation_users(cls, _app_uuid, _group_uuid, _redis):
        return []
    
    @classmethod
    def app_users(cls, _app_uuid, _is_service_user, _redis):
        if _app_uuid == None:
            return []
        _key = AppUserData.__tablename__ + \
               ".app_uuid." + _app_uuid + \
               ".is_service_user." + str(_is_service_user)
        _users = _redis.smembers(_key)
        return list(_users)

    @classmethod
    def distributor_users(cls, _app_uuid, _redis):
        # is_service_user == True
        if _app_uuid == None:
            return []
        _key = AppUserData.__tablename__ + \
               ".app_uuid." + _app_uuid + \
               ".is_service_user.True" + \
               ".is_distributor_user.True"
        _users = _redis.smembers(_key)
        return list(_users)

    @classmethod
    def group_users(cls, _group_uuid, _redis):
        _pattern = OrgUserGroupData.__tablename__ + \
                   ".group_uuid." + _group_uuid
        _keys = _redis.smembers(_pattern)
        return list(_keys)

    @classmethod
    def get_service_care_users(cls, _app_uuid, _user_uuid, _redis):
        return None

    @classmethod
    def get_portal_care_users(cls, _app_uuid, _user_uuid, _redis):
        return None
    
    def _android_token(self, _user_uuid, _device_uuid):
        _token = _user_uuid + "/" + _device_uuid + "/" + self._task["message_type"] + "/" + self._task["uuid"]
        return _token
    
    def _body(self):
        _message = {}
        _message["id"] = self._task.get("uuid")
        _message["fi"] = self._task.get("from_uuid")
        _message["ti"] = self._task.get("to_uuid")
        _message["ft"] = self._task.get("from_type")
        _message["tt"] = self._task.get("to_type")
        _message["mt"] = self._task.get("message_type")
        _message["ms"] = self._task.get("message_subtype")
        _message["ci"] = self._task.get("conversation_uuid")
        _message["ct"] = self._task.get("conversation_type")
        _message["tl"] = self._task.get("title")
        _message["bo"] = self._task.get("body")

        if _message["ct"] == CONVERSATION_TYPE.S2P:
            _message["ti"] = self._task["app_uuid"]
            _message["tt"] = YVOBJECT.AP
            if self._name == APP_POLICY.GROUP:
                #_message["ti"] == self._task["to_uuid"]
                _message["tt"] == YVOBJECT.OG
                
        if isinstance(self._task.get("title"), unicode):
            _message["tl"] = self._task.get("title").encode("utf-8")
        if isinstance(self._task.get("body"), unicode):
            _message["bo"] = self._task.get("body").encode("utf-8")

        _message["ts"] = int(time.mktime(self._task["createtime"].timetuple())) 
        _message["ts"] = round(_message["ts"])
        self._task["message_body"] = _message

        _message_body = json.dumps(self._task["message_body"])
        if isinstance(_message_body, unicode):
            _message_body = _message_body.encode("utf-8")
            
        _values = {
            "uuid": self._task["uuid"],
            "task_status": TASK_STATUS.PROCESSED,
            "message_body": _message_body,
        }
        _row = MessagePushTask(**_values)
        _row.async_update()
        _row.update_redis_keys(self._redis)
        return

    def _user_devices(self, _user_uuid):
        _user = self._users_hash.get(_user_uuid)
        _is_service_user = self._is_service_user.get(_user_uuid)
        
        if _user == None or _is_service_user == None:
            logging.error("no user in hash: %s" % _user_uuid)
            return
        
        _user["_online_devices"] = {}
        _device_name = ["mobile_device_uuid", "browser_device_uuid"]
        if _is_service_user == False:
            _device_name = ["ppcom_mobile_device_uuid", "ppcom_browser_device_uuid"]

        _is_user_online = False
        for _i in _device_name:
            _device_uuid = self._users_hash[_user_uuid][_i]
            if _device_uuid == None or len(_device_uuid) == 0:
                continue
            _device = redis_hash_to_dict(self._redis, DeviceInfo, _device_uuid)
            if _device == None:
                continue

            self._devices_hash[_device_uuid] = _device
            self._devices.add(_device_uuid)
            
            if _device.get("device_is_online") == True:
                _user["_online_devices"][_device_uuid] = _device
                _is_user_online = True

        # should check all devices
        if _is_user_online == True:
            self._online_users.add(_user_uuid)
        else:
            self._offline_users.add(_user_uuid)

        return

    def _users_devices(self):
        for _i in self._users:
            self._users_hash[_i] = redis_hash_to_dict(self._redis, DeviceUser, _i)

        for _i in self._users:
            self._user_devices(_i)

        logging.info("online : %d, %s" % (len(self._online_users), self._online_users))
        logging.info("offline : %d, %s" % (len(self._offline_users), self._offline_users))
        return

    def _pcsocket_data(self, _device_uuid):
        _redis = self._redis
        _key = PCSocketDeviceData.__tablename__ + \
                   ".device_uuid." + _device_uuid
        _pc_socket_uuid = _redis.get(_key)
        if _pc_socket_uuid == None:
            logging.error("device no pcsocket %s" % _device_uuid)
            return None
        _info = redis_hash_to_dict(_redis, PCSocketInfo, _pc_socket_uuid)
        if _info == None:
            logging.error("dispatcher cant not find pcsocket %s" % str(_pc_socket_uuid))
            return None
        _d = {"host": _info["host"], "port": _info["port"], "device_uuid": _device_uuid}
        return _d
    
    def _push_to_db(self, _user_uuid, _device_uuid, _status=MESSAGE_STATUS.PUSHED):
        _values = {
            "uuid": str(uuid.uuid1()),
            "app_uuid": self._task["app_uuid"],
            "task_uuid": self._task["uuid"],
            "user_uuid": _user_uuid,
            "device_uuid": _device_uuid,
            "status": _status
        }
                    
        _row = MessagePush(**_values)
        _row.async_add()
        _row.create_redis_keys(self._redis)
        return _row.uuid

    def _push_to_ios(self, _user_uuid, _device_uuid):
        logging.info("push ios %s:%s" % (_user_uuid, _device_uuid))
        _device = self._devices_hash.get(_device_uuid)
        _user = self._users_hash.get(_user_uuid)
        _app_uuid = self._task["app_uuid"]
        _conversation_data = self._conversation_user_datas_hash.get(_user_uuid)
        
        if _user == None:
            logging.error("push ios failed for 0001")
            return
        if _device == None:
            logging.error("push ios failed for 0002")
            return
        _token = _device.get("device_ios_token")
        if _token == None or len(_token) == 0:
            logging.error("push ios failed for 2")
            return
        if _device["device_ios_token"] == IOS_FAKE_TOKEN:
            logging.error("push ios failed for 3")
            return
        if _conversation_data != None and _conversation_data["user_mute_notification"] == True:
            # user only do not want recv push for this conversation
            logging.error("push ios failed for 4")
            return

        _count = 0
        if _user.get("user_show_badge") == True:
            _key = MessagePush.__tablename__ + \
                   ".app_uuid." + _app_uuid + \
                   ".user_uuid." + _user_uuid + \
                   ".device_uuid." + _device_uuid        
            _count = len(self._redis.smembers(_key))
        
        _config = {
            "user_language": _user.get("user_language"),
            "device_ios_token": _token,
            "unacked_notification_count": _count,
            "user_silence_notification": _user.get("user_silence_notification")
        }
        
        _push = {
            "config": _config,
            "body": self._task.get("message_body"),
            "app": _app_uuid
        }
        logging.info("push ios: %s" % str(_push))
        async_signal_iospush_push(_push)
        return

    def _push_to_android(self, _user_uuid, _device_uuid):
        _app_uuid = self._task["app_uuid"]
        
        _device = self._devices_hash.get(_device_uuid)
        _user = self._users_hash.get(_user_uuid)
        _conversation_data = self._conversation_user_datas_hash.get(_user_uuid)

        _count = 0
        if _user.get("user_show_badge") == True:
            _key = MessagePush.__tablename__ + \
                   ".app_uuid." + _app_uuid + \
                   ".user_uuid." + _user_uuid + \
                   ".device_uuid." + _device_uuid        
            _count = len(self._redis.smembers(_key))

        _config = {
            "user_language": _user.get("user_language"),
            "unacked_notification_count": _count,
            "user_silence_notification": _user.get("user_silence_notification")
        }
        _mqtt_token = self._android_token(_user_uuid, _device_uuid)
        _gcm_token = _device.get("device_android_gcmtoken")
        if _device.get("device_use_gcmpush") == True and _gcm_token != None:
            _config["android_gcm_token"] = _gcm_token
        else:
            _config["android_mqtt_token"] = _mqtt_token,
        _push = {
            "config": _config,
            "body": self._task.get("message_body"),
            "app_uuid": _app_uuid
        }
        # logging.info("push android: %s" % str(_push))
        if _config.get("android_gcm_token") != None:
            async_signal_gcmpush_push(_push)
        else :
            async_signal_mqttpush_push(_push)
        return
    
    def _push_to_pc(self, _user_uuid, _device_uuid):
        _pcsocket = self._pcsocket_data(_device_uuid)
        if _pcsocket == None:
            logging.error("no pcsocket data for: %s" % _device_uuid)
            return
        
        _device = self._devices_hash.get(_device_uuid)

        # if _device == None:
        #     logging.error("no device hash for: %s" % _device_uuid)
        #     return
        
        _from_user = {}
        _from_type = self._task.get("from_type")
        
        _fields = [
            "uuid",
            "user_icon",
            "user_email",
            "user_fullname",
            "updatetime",
        ]
        
        if _from_type == YVOBJECT.DU:
            for _i in _fields:
                _from_user[_i] = self._task["_user"].get(_i)
            _from_user["updatetime"] = datetime_to_timestamp(_from_user["updatetime"])
            
        if _from_type == YVOBJECT.OG:
            _from_user = self._task["_group"]
            
        if _from_type == YVOBJECT.AP:
            _from_user = self._task["_app"]

        _body = self._task.get("message_body")
        _body["pid"] = _device.get("push_uuid")
        _body["from_user"] = _from_user
        _push = {
            "pcsocket": _pcsocket,
            "body": _body
        }
        async_signal_pcsocket_push(_push)
        return
    
    def _push_to_mobile(self, _user_uuid, _device_uuid):
        if self._task["from_type"] == YVOBJECT.DU:
            _is_service_user = self._is_service_user.get(self._task["from_uuid"])
            if _is_service_user != False:
                logging.info("not from portal user, no push")
                return

        _is_service_user = self._is_service_user.get(_user_uuid)
        if _is_service_user != True:
            logging.info("not service user, not push");
            return

        _device = self._devices_hash[_device_uuid]
        if _device["device_ostype"] == OS.IOS:
            self._push_to_ios(_user_uuid, _device_uuid)
            return

        if _device["device_ostype"] == OS.AND:
            self._push_to_android(_user_uuid, _device_uuid)
            return
        
        return

    def _push_to_offline(self, _user_uuid):
        #self._push_to_db(_user_uuid, None, MESSAGE_STATUS.NODEVICE) 
        return
    
    def _push(self):
        if len(self._online_users) == 0:
            self.no_online_user()
                
        for _i in self._online_users:
            _user = self._users_hash[_i]
            _online_devices = _user.get("_online_devices")
            _real_push = not _user.get("user_mute_notification")
            for _j in _online_devices:
                _pid = self._push_to_db(_i, _j)
                self._devices_hash[_j]["push_uuid"] = _pid
                self._push_to_pc(_j, _j)
                if _real_push == True:
                    self._push_to_mobile(_i, _j)

        ### for _i in self._offline_users:
        ###     self._push_to_offline(_i)
        return

    def _other_device(self):
        """
        the other device uuid belong to same user uuid
        """
        if self._task.get("from_device_uuid") == None:
            return
        if self._task.get("from_type") != YVOBJECT.DU:
            return
        if self._task.get("_user") == None:
            return

        if self._task["conversation_type"] == CONVERSATION_TYPE.P2S:
            if self._task["_user"]["ppcom_mobile_device_uuid"] == None or \
               self._task["_user"]["ppcom_browser_device_uuid"] == None:
                return

        if self._task["conversation_type"] == CONVERSATION_TYPE.S2S or \
           self._task["conversation_type"] == CONVERSATION_TYPE.S2P:
            if self._task["_user"]["mobile_device_uuid"] == None or \
               self._task["_user"]["browser_device_uuid"] == None:
                return

        _device_uuid = None
        if self._task["conversation_type"] == CONVERSATION_TYPE.P2S:
            _device_uuid = self._task["_user"]["ppcom_mobile_device_uuid"]
            if self._task["from_device_uuid"] == self._task["_user"]["ppcom_mobile_device_uuid"]:
                _device_uuid = self._task["_user"]["ppcom_browser_device_uuid"]
        else:
            _device_uuid = self._task["_user"]["mobile_device_uuid"]
            if self._task["from_device_uuid"] == self._task["_user"]["mobile_device_uuid"]:
                _device_uuid = self._task["_user"]["browser_device_uuid"]

        if _device_uuid not in self._devices_hash:
            _device = redis_hash_to_dict(self._redis, DeviceInfo, _device_uuid)
            if _device == None or _device["device_is_online"] != True:
                return
            self._devices_hash[_device_uuid] = _device

        _user_uuid = self._task["from_uuid"]
        if _user_uuid not in self._users_hash:
            self._users_hash[_user_uuid] = self._task["_user"]

        _pid = self._push_to_db(_user_uuid, _device_uuid)
        self._devices_hash[_device_uuid]["push_uuid"] = _pid
        self._push_to_pc(_user_uuid, _device_uuid)
        return

    def _explicit(self):
        """
        explicit message SYS type
        """
        _device_uuid = self._task.get("to_device_uuid")
        _device = redis_hash_to_dict(self._redis, DeviceInfo, _device_uuid)
        if _device == None:
            logging.error("no device:%s" % _device_uuid)
            return

        _user_uuid = self._task.get("from_uuid")
        self._users_hash[_user_uuid] = self._task["_user"]
        self._devices_hash[_device_uuid] = _device
        # not save db for explicit message
        self._push_to_pc(_user_uuid, _device_uuid)
        return
    
    def _send_apologize(self, _text):
        _task = {
            "uuid": str(uuid.uuid1()),
            "app_uuid": self._task["app_uuid"],
            "conversation_uuid": self._task["conversation_uuid"],
            "conversation_type": CONVERSATION_TYPE.S2P,
            "message_type": MESSAGE_TYPE.NOTI,
            "message_subtype": MESSAGE_SUBTYPE.TEXT,
            "from_uuid": self._task["to_uuid"],
            "from_type": self._task["to_type"],
            "to_uuid": self._task["to_uuid"],
            "to_type": self._task["to_type"],
            "body": _text,
            "task_status": TASK_STATUS.PENDING,
        }
        _row = MessagePushTask(**_task)
        _row.async_add()
        _row.create_redis_keys(self._redis)
        #self._send_to_queue(_row.uuid)
        _m = {"task_uuid": _row.uuid}
        async_signal_dis_message(_m)
        return

    def _get_app_apologize(self):
        _text = None
        _lang = self._task["_user"]["user_language"]
        if _lang == None or len(_lang) == 0:
            _lang = "zh_cn"

        _offline = "offline_" + _lang
        _text = self._task["_app"][_offline]
        if _text == None:
            _text = PPCOM_OFFLINE[_lang]
        return _text
    
    def no_online_user(self):
        if self._task["conversation_type"] != CONVERSATION_TYPE.P2S:
            return

        if self._task["_app"].get("return_offline_message") != True:
            logging.info("return_offline_message is not set")
            return
        
        _text = self._get_app_apologize()
        if _text == None:
            return
        self._send_apologize(_text)
        return
    
    def users(self):
        _app_uuid = self._task["app_uuid"]
        _conversation_uuid = self._task["conversation_uuid"]

        _users = AbstractPolicy.conversation_users(_app_uuid, _conversation_uuid, self._redis)
        _datas = AbstractPolicy.conversation_datas(_app_uuid, _conversation_uuid, _users, self._redis)
        _datas = dict(zip(_users, _datas))

        # the is_service_user include the sender user_uuid
        _table = AppUserData.__tablename__ + ".app_uuid." + _app_uuid + ".user_uuid."
        _pi = self._redis.pipeline()
        for _user_uuid in _users:
            _key = _table + _user_uuid
            _pi.get(_key)
        _is = _pi.execute()

        _is_list = []
        for _i in _is:
            if _i == None or len(_i) == 0:
                _is_list.append(False)
                continue
            _d = json.loads(_i)
            _is_list.append(_d.get("is_service_user"))    
        self._is_service_user = dict(zip(_users, _is_list))
        
        # remove the sender self
        if self._task["from_type"] == YVOBJECT.DU:
            _user_uuid = self._task["from_uuid"]
            if _user_uuid in _users:
                _users.remove(_user_uuid)
            if _user_uuid in _datas:
                del _datas[_user_uuid]

        self._users = _users
        self._conversation_users = _users
        self._conversation_user_datas_uuid = _datas
        return

    def dispatch(self):
        self._body()
        
        if self._task.get("to_device_uuid") != None:
            self._explicit()
            return

        if self._task.get("conversation_uuid") == None:
            logging.error("no conversation should be explicit")
            return
        
        self.users()
        self._users_devices()
        self._push()
        self._other_device()
        return
    
class BroadcastPolicy(AbstractPolicy):
    def __init__(self, dis):
        super(BroadcastPolicy, self).__init__(dis)
        self._name = APP_POLICY.BROADCAST
        return

    @classmethod
    def name(cls):
        return APP_POLICY.BROADCAST

    def users(self):
        super(BroadcastPolicy, self).users()
        return

    @classmethod
    def create_conversation_users(cls, _app_uuid, _group_uuid, _redis):
        return AbstractPolicy.distributor_users(_app_uuid, _redis)

    @classmethod
    def get_service_care_users(cls, _app_uuid, _user_uuid, _redis):
        _a_users = AbstractPolicy.app_users(_app_uuid, True, _redis)
        _b_users = AbstractPolicy.app_users(_app_uuid, False, _redis)
        return _a_users + _b_users

    @classmethod
    def get_portal_care_users(cls, _app_uuid, _user_uuid, _redis):
        _a_users = AbstractPolicy.app_users(_app_uuid, True, _redis)
        return _a_users

