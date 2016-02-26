# -*- coding: utf-8 -*-
# Copyright (C) 2010-2016 PPMessage.
#
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# core/email/arrear.py
#
from mdm.core.constant import PORTAL_PORT
from mdm.core.constant import DEV_MODE

from smtplib import SMTP
from smtplib import SMTPRecipientsRefused
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

import base64
import logging
import json
import os
import traceback

_EMAIL_HOST='smtp.exmail.qq.com'
_EMAIL_USER='ppmessage@ppmessage.cn'
_EMAIL_PASSWORD='YVERTICAL1q2w3e4r5t'
_EMAIL_FROM='ppmessage@ppmessage.cn'

_SUBJECT_CN='续费通知--皮皮消息'
_SUBJECT_EN='Arrears Notification -- PPMESSAGE'

_HTML_TEMPLATE_EN = """
<html><head>
</head>
<body>
<center>
<img src="WELCOME_PNG_PLACE" style="width:200px; height:auto;"></img>
<div style="height:40px;"></div>
<p style="font-family: HelveticaNeue, Helvetica, Arial, sans-serif; font-weight: 300; font-size:18px">
Hi,dear:your team APP_NAME_PLACE soon arrears, please renewals.<br>
It will affect continuing on using our service and storage of your datas on our web
</p>
<p style=" font-weight: 300; font-size:14px">Your team info is as follows:</p>
<p style=" font-weight: 300; font-size:12px">User Name: USER_NAME_PLACE</p>
<p style=" font-weight: 300; font-size:12px">Team Name: APP_NAME_PLACE</p>
<p style=" font-weight: 300; font-size:12px">Create Time: BEGIN_TIME_PLACE</p>
<p style=" font-weight: 300; font-size:12px">Validity Period: END_TIME_PLACE</p>
<p style=" font-weight: 300; font-size:12px">Payment Amount: AMOUNT_PLACE</p>
<p style=" font-weight: 300; font-size:12px">Consumed: CONSUMED_PLACE</p>
<p style=" font-weight: 300; font-size:12px">Trade no: TRADE_NO_PLACE</p>

<a href="ARREAR_URL_PLACE" target="_blank" style="text-decoration: none;">
<div style="font-family: HelveticaNeue, Helvetica, Arial, sans-serif; color:white; height: 30px; width: 262px; background-color:#2597da; border-radius:5px; padding:10px 0 0 0; ">Renewals Now</div>
</a>

<div style="height:30px;"></div>

<img src="SIGNATURE_PNG_PLACE" style="width:200px; height:auto;"> </img>

<p class="p-small" style="margin: 0; font-family: HelveticaNeue, Helvetica, Arial, sans-serif; font-weight: 300; font-size: 12px;">PPMESSAGE -- The easiest way to communicate between users and developers</p>

<p style="margin: 0; font-family: HelveticaNeue, Helvetica, Arial, sans-serif; font-weight: 300;">www.ppmessage.cn</p>
</center>


</body></html>
"""

_HTML_TEMPLATE_CN = """

<html><head>
</head>
<body>
<center>
<img src="WELCOME_PNG_PLACE" style="width:200px; height:auto;"></img>
<div style="height:40px;"></div>
<p style="font-family: HelveticaNeue, Helvetica, Arial, sans-serif; font-weight: 300; font-size:18px">
您的团队 APP_NAME_PLACE 快要欠费了，请及时续费<br>
欠费会影响您继续使用我们的服务以及您在我们网站上数据的存储
</p>
<p style="font-family: HelveticaNeue, Helvetica, Arial, sans-serif; font-weight: 300; font-size:18px">团队信息如下：</p>
<p style="font-family: HelveticaNeue, Helvetica, Arial, sans-serif; font-weight: 300; font-size:14px">用户名： USER_NAME_PLACE</p>
<p style="font-family: HelveticaNeue, Helvetica, Arial, sans-serif; font-weight: 300; font-size:14px">团队名： APP_NAME_PLACE</p>
<p style="font-family: HelveticaNeue, Helvetica, Arial, sans-serif; font-weight: 300; font-size:14px">创建时间： BEGIN_TIME_PLACE</p>
<p style="font-family: HelveticaNeue, Helvetica, Arial, sans-serif; font-weight: 300; font-size:14px">服务有效期： END_TIME_PLACE</p>
<p style="font-family: HelveticaNeue, Helvetica, Arial, sans-serif; font-weight: 300; font-size:14px">预付款： AMOUNT_PLACE</p>
<p style="font-family: HelveticaNeue, Helvetica, Arial, sans-serif; font-weight: 300; font-size:14px">已消费： CONSUMED_PLACE</p>
<p style="font-family: HelveticaNeue, Helvetica, Arial, sans-serif; font-weight: 300; font-size:14px">订单号： TRADE_NO_PLACE</p>

<a href="ARREAR_URL_PLACE" target="_blank" style="text-decoration: none;">
<div style="font-family: HelveticaNeue, Helvetica, Arial, sans-serif; color:white; height: 30px; width: 262px; background-color:#2597da; border-radius:5px; padding:10px 0 0 0; ">现在续费</div>
</a>

<div style="height:30px;"></div>

<img src="SIGNATURE_PNG_PLACE" style="width:200px; height:auto;"> </img>

<p class="p-small" style="margin: 0; font-family: HelveticaNeue, Helvetica, Arial, sans-serif; font-weight: 300; font-size: 12px;">皮皮消息 -- 开发者与用户沟通的最佳方式</p>

<p style="margin: 0; font-family: HelveticaNeue, Helvetica, Arial, sans-serif; font-weight: 300;">www.ppmessage.cn</p>
</center>


</body></html>
"""

_TEXT_TEMPLATE_EN = """

Dear:

  Your team APP_NAME_PLACE soon arrears ,please renewals

  Click ARREAR_URL_PLACE to renewal

PPMESSAGE -- The easiest way to communicate between users and developers,and you can click WEBSITE_URL_PLACE to konw more about us.

Yours sincerely,
Guijin Ding
CEO of PPMESSAGE

"""

_TEXT_TEMPLATE_CN = """
您好：
  
  您的团队 APP_NAME_PLACE 快要欠费了，
请点击链接 ARREAR_URL_PLACE 开始续费

皮皮消息 -- 开发者与用户沟通的最佳方式，你也可以点击 WEBSITE_URL_PLACE 了解更多.
  

此致


    敬礼

丁贵金
创始人&CEO
皮皮消息

"""

def _prepare_png(name):
    _BASEBASE = "data:image/png;base64,"
    _p = os.path.join(os.path.dirname(__file__))
    print _p
    name = _p + "/" + name
    _f = open(name)
    _d = _f.read()
    _b = base64.b64encode(_d)
    _b = _BASEBASE + _b
    return _b

def _prepare_template(info_list):

    _email = info_list["user_email"]
    _user_name = info_list["user_name"]
    _app_name = info_list["app_name"]
    _begin_time = info_list["begintime"]
    _end_time = info_list["endtime"]
    _arrear_url = "https://www.ppmessage.cn/portal/#/app/login/"
    _language = info_list["language"]
    _amount = info_list["amount"]
    _consumed = info_list["consumed"]
    _trade_no = info_list["trade_no"]
    
    _welcome = _prepare_png("welcome.png")
    _signature = _prepare_png("signature.png")

    _website_url = "https://www.ppmessage.cn/portal/#/app/main/"

    if DEV_MODE:
        _website_url = "http://" + info_list.get("server_origin") + ":" + str(PORTAL_PORT) + "/portal/#/app/main/"
        _arrear_url = "http://" + info_list.get("server_origin") + ":" + str(PORTAL_PORT) + "/portal/#/app/login/"

    _template = {
        "user_name": _user_name,
        "email": _email,
        "app_name": _app_name,
        "welcome_png": _welcome,
        "signature_png": _signature,
        "text": _TEXT_TEMPLATE_CN,
        "html": _HTML_TEMPLATE_CN,
        "subject": _SUBJECT_CN,
        "website_url": _website_url,
        "begin_time": _begin_time,
        "end_time": _end_time,
        "arrear_url": _arrear_url,
        "amount": _amount,
        "consumed": _consumed,
        "trade_no": _trade_no,
    }

    if _language != "zh_cn":
        _template["text"] = _TEXT_TEMPLATE_EN
        _template["html"] = _HTML_TEMPLATE_EN
        _template["subject"] = _SUBJECT_EN
        
    return _template

def _render_template(template):

    _html = template.get("html")
    _html = _html.replace("WELCOME_PNG_PLACE", template.get("welcome_png"))
    _html = _html.replace("SIGNATURE_PNG_PLACE", template.get("signature_png"))
    _html = _html.replace("USER_NAME_PLACE", template.get("user_name"))
    _html = _html.replace("APP_NAME_PLACE", template.get("app_name"))
    _html = _html.replace("BEGIN_TIME_PLACE", template.get("begin_time"))
    _html = _html.replace("END_TIME_PLACE", template.get("end_time"))
    _html = _html.replace("ARREAR_URL_PLACE", template.get("arrear_url"))
    _html = _html.replace("AMOUNT_PLACE", template.get("amount"))
    _html = _html.replace("CONSUMED_PLACE", template.get("consumed"))
    _html = _html.replace("TRADE_NO_PLACE", template.get("trade_no"))
    template["html"] = _html

    _text = template.get("text")
    _text = _text.replace("APP_NAME_PLACE", template.get("app_name"))
    _text = _text.replace("ARREAR_URL_PLACE", template.get("arrear_url"))
    _html = _html.replace("WEBSITE_URL_PLACE", template.get("website_url"))
    template["text"] = _text
    
    return template

def _send_email(template):
    #create message container --the correct type is multipart/alternative
    msg=MIMEMultipart('alternative')
    msg['Subject'] = template.get("subject")
    msg['From'] = _EMAIL_FROM
    msg['To'] = template.get("email")
    text = template.get("text")
    html = template.get("html")

    import sys
    reload(sys)
    sys.setdefaultencoding('utf-8')
    
    text = text.encode("utf-8")
    html = html.encode("utf-8")
    
    #record the MIME type of both parts--text/plain and text/html
    part1=MIMEText(text,'plain')
    part2=MIMEText(html,'html')
    #attach parts into message container.
    # According to RFC 2046, the last part of a multipart message, in this case
    # the HTML message, is best and preferred.
    msg.attach(part1)
    msg.attach(part2)
    #send the message from the smtp server
    s = SMTP(_EMAIL_HOST)
    try:
        s.login(_EMAIL_USER, _EMAIL_PASSWORD)
    except:
        logging.error("email login encounter an error")
        return "login error"
    try:
        s.sendmail(_EMAIL_FROM, template.get("email"), msg.as_string())
        logging.info("email reachable")
    except SMTPRecipientsRefused:
        logging.info("email unreachable")
        s.quit()
        return "unreachbale"
    except:
        traceback.print_exc()
        logging.info("email sending encounter an error")
        return "error"
    s.quit()
    return "reachable"

def send_arrear_email(info_list):
    _t = _prepare_template(info_list)
    _r = _render_template(_t)
    logging.info(_r)
    _send_email(_r)
    return

if __name__ == '__main__':
    _device_user = {
        "user_email": "1330745625@qq.com",
        "user_name" : "humingzhi",
        "app_name" : "demo",
        "begintime" : "2014.8.12",
        "endtime": "2015.8.12",
        "language": "zh_cn",
        "trade_no": "90238093",
        "amount": "23",
        "consumed": "21",
        "server_origin": "127.0.0.1",
    }
    send_arrear_email(_device_user)
