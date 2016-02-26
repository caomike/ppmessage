# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Kun Zhao
#
#

from .basehandler import BaseHandler

from mdm.api.error import API_ERR

import logging
import json
import urllib
import random

'''

sms = RegisterSMS()
result = sms.send(18812345678)

'''
class RegisterSMS:

    '''
    get url
    '''
    def _getUrl(self):
        return "http://sms.1xinxi.cn/asmx/smsservice.aspx"

    '''
    sms content template
    '''
    def _getContentTemplate(self):
        return "尊敬的用户，您的注册验证码为：%s 【北京优锐科技】"

    '''
    send register sms
    '''
    def send(self, mobile):
        verificationCode = random.randint(100000, 999999)
        logging.info('mobile:%s, verify_code:%s' % (str(mobile), str(verificationCode)))
        params = urllib.urlencode(
            {
                'name': 'dingguijin@gmail.com',
                'pwd': '953BE9DDEDF1AE4C66D35DF2A474',
                'type': 'pt',
                'sign': '',
                'mobile': mobile,
                'content': self._getContentTemplate() % str(verificationCode),
            }
        )
        f = urllib.urlopen(self._getUrl(), params)
        # code,sendid,invalidcount,successcount,blackcount,msg
        # code:0: 表示成功
        # 0,2015052910410205256606197,0,1,0,提交成功
        response = f.read().split(',')

        # response = [0]
        
        return {
            'successed': int(response[0]) == 0,
            'verfication_code': verificationCode,
        }

'''

require: {mobile:18812345678}
response: {}

'''
class SendSMSHandler(BaseHandler):

    # send successful
    STATUS_SEND_SUCCESSFUL = 0
    # send failed
    STATUS_SEND_FAILED = 1
    # duplicated send in 60 seconds
    STATUS_SEND_DUPLICATED = 2
    
    def _input_data(self):
        if not self._JSON():
            self.writeError(API_ERR.NO_JSON)
            return False
        
        self.input_data = json.loads(self.request.body)

        if "mobile" not in self.input_data:
            self.writeError(API_ERR.NO_PARA)
            return False

        return True

    '''
    get hash key: 'mobile:18812345678'
    '''
    def _getHashKey(self, mobile):
        if hasattr(self, '_hashKey'):
            return self._hashKey

        self._hashKey = "mobile:" + str(mobile)
        return self._hashKey
    
    '''
    is sending ?
    '''
    def _isSending(self, mobile):
        if self.application.redis.ttl(self._getHashKey(mobile)) > 0:
            return True
        
        return False

    '''
    expire: default is 30 minutes,
    '''
    def _record(self, mobile, verficationCode, expire=1800):
        _key = self._getHashKey(mobile)
        self.application.redis.set(_key, verficationCode)
        self.application.redis.expire(_key, expire)

    '''
    response
    '''
    def _response(self, mobile, status):
        _returnData = self.getReturnData()
        _returnData['status'] = status
        _returnData['mobile'] = mobile

        logging.info('SEND_SMS RETURN %s.' % (str(_returnData)))

    '''
    send
    '''
    def _send(self):
        if self._input_data() is False:
            return

        self._mobile = self.input_data.get("mobile")

        # is sending
        if self._isSending(self._mobile):
            self._response(self._mobile, SendSMSHandler.STATUS_SEND_DUPLICATED)
            return

        # send
        sms = RegisterSMS()
        result = sms.send(self._mobile)

        # send successful
        if result["successed"] is True:
            self._record(self._mobile, result["verfication_code"])
            self._response(self._mobile, SendSMSHandler.STATUS_SEND_SUCCESSFUL)
        else:
            self._response(self._mobile, SendSMSHandler.STATUS_SEND_FAILED)            
    
    def _Before(self):
        return True
    
    def _Task(self):
        super(SendSMSHandler, self)._Task()
        self._send()
