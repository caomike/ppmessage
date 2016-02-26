# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
#
from .basehandler import BaseHandler

from ppmessage.core.srv.signal import async_signal_dis_message

from ppmessage.core.imageconverter import ImageConverter
from ppmessage.core.audioconverter import AudioConverter

from ppmessage.core.constant import MESSAGE_MAX_TEXT_LEN
from ppmessage.core.constant import MESSAGE_SUBTYPE
from ppmessage.core.constant import MESSAGE_TYPE
from ppmessage.core.constant import THUMBNAIL_HEIGHT
from ppmessage.core.constant import THUMBNAIL_WIDTH

from ppmessage.api.error import API_ERR

from ppmessage.core.constant import TASK_STATUS
from ppmessage.core.constant import YVOBJECT

from ppmessage.db.models import DeviceUser
from ppmessage.db.models import MessagePushTask
from ppmessage.db.models import VideoMaterialInfo
from ppmessage.db.models import FileInfo
from ppmessage.db.models import ConversationInfo

from ppmessage.core.redis import redis_hash_to_dict

import json
import uuid
import logging
import datetime
import time

class ForwardMessageHandler(BaseHandler):

    """
    POST
    requst:
    header
    message {
    to_uuid:,
    to_type:,
    body:
    }

    response:
    body {id:id} task id
    nothing
    """

    def _Task(self):
        super(ForwardMessageHandler, self)._Task()
        _request = json.loads(self.request.body)

        logging.info("ForwardMessage with %s." % (str(_request)))

        self.task_id = 0
        if "from_uuid" not in _request \
           or "to_type" not in _request \
           or "to_uuid" not in _request \
           or "task_uuid" not in _request:
            logging.error("send message failed for input.")
            self.setErrorCode(API_ERR.NO_PARA)
            return

        _old = redis_hash_to_dict(self.application.redis, MessagePushTask, _request["task_uuid"])
        if _old is None:
            logging.error("Error for no task uuid=%s." % (_request["task_uuid"]))
            self.setErrorCode(API_ERR.NO_TASK)
            return

        _from_uuid = _request.get("from_uuid")
        _conversation_uuid = _request.get("to_uuid")
        _uuid = str(uuid.uuid1())
        _now_datetime = datetime.datetime.now()
        _now = _now_datetime.strftime("%Y-%m-%d %H:%M:%S %f")

        _task = {
            "uuid": _uuid,
            "conversation_uuid": _conversation_uuid,
            "app_uuid": self.app_uuid,
            "message_type": _old.message_type,
            "message_subtype": _old.message_subtype,
            "from_uuid": _from_uuid,
            "from_type": YVOBJECT.DU,
            "from_device_uuid": _request["device_uuid"],
            "to_uuid": _conversation_uuid,
            "to_type": _request["to_type"],
            "body": _old.body,
            "task_status": TASK_STATUS.PENDING,
        }

        _row = MessagePushTask(**_task)
        _row.async_add()
        _row.create_redis_keys(self.application.redis)

        _row = ConversationInfo(uuid=_conversation_uuid, lastest_task=_uuid)
        _row.async_update()
        _row.update_redis_keys(self.application.redis)
        
        _m = {"task_uuid": _uuid}
        async_signal_dis_message(_m)

        #link file
        if _old.message_subtype == MESSAGE_SUBTYPE.FILE:
            self._check_link_file(_old, _from_uuid)
        
        _rdata = self.getReturnData()
        _rdata["ts"] = int(time.mktime(_now_datetime.timetuple()))
        _rdata["ts"] = round(_rdata["ts"])
        _rdata["task"] = _uuid
        return

    """
    Check whether or not need to link file to the user's own file lists
    """
    def _checkLinkFile(self, task, from_uuid):
        fileInfo = json.loads(task.body)
            
        if "fid" not in fileInfo:
            logging.info("ForwardMessage can not find fid.")
            return
        
        self.application.fileRefsLinker.linkFile(fileInfo, from_uuid)
