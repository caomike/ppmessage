# -*- coding: utf-8 -*-
# Copyright (C) 2010-2016 PPMessage.
#
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# core/email/invite.py
#
from ppmessage.core.constant import WEBSITE_URL
from ppmessage.core.constant import SIGNUP_URL

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

_SUBJECT_CN='用户注册邀请--皮皮消息'
_SUBJECT_EN='User email invitation -- PPMESSAGE'

_HTML_TEMPLATE_EN = """
<html><head>
</head>
<body>
<center>
<img src="WELCOME_PNG_PLACE" style="width:200px; height:auto;"></img>
<div style="height:40px;"></div>
<p style="font-family: HelveticaNeue, Helvetica, Arial, sans-serif; font-weight: 300; font-size:18px">
Hi,dear:your friend USER_NAME_PLACE invited you to be a member of APP_NAME_PLACE
</p>

<a href="START_URL_PLACE" target="_blank" style="text-decoration: none;">
<div style="font-family: HelveticaNeue, Helvetica, Arial, sans-serif; color:white; height: 30px; width: 262px; background-color:#2597da; border-radius:5px; padding:10px 0 0 0; ">Accepted To Be A PPMESSAGER</div>
</a>

<p style=" font-weight: 300; font-size:14px">You'll be sending messages in just a few easy steps.</p>

<div style="height:30px;"></div>

<p style="font-family: HelveticaNeue, Helvetica, Arial, sans-serif; font-weight: 300; font-size:18px">We can't wait to see what you build,</p>

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
您的朋友 USER_NAME_PLACE 邀请您成为 APP_NAME_PLACE 成员
</p>

<a href="START_URL_PLACE" target="_blank" style="text-decoration: none;">
<div style="font-family: HelveticaNeue, Helvetica, Arial, sans-serif; color:white; height: 30px; width: 262px; background-color:#2597da; border-radius:5px; padding:10px 0 0 0; ">点击接受邀请</div>
</a>

<p style=" font-weight: 300; font-size:14px">确认后马上就可以体验</p>

<div style="height:30px;"></div>

<p style="font-family: HelveticaNeue, Helvetica, Arial, sans-serif; font-weight: 300; font-size:18px">期待您的到来</p>

<img src="SIGNATURE_PNG_PLACE" style="width:200px; height:auto;"> </img>

<p class="p-small" style="margin: 0; font-family: HelveticaNeue, Helvetica, Arial, sans-serif; font-weight: 300; font-size: 12px;">皮皮消息 -- 开发者与用户沟通的最佳方式</p>

<p style="margin: 0; font-family: HelveticaNeue, Helvetica, Arial, sans-serif; font-weight: 300;">www.ppmessage.cn</p>
</center>


</body></html>
"""

_TEXT_TEMPLATE_EN = """

Dear:

  Your friend USER_NAME_PLACE invited you to be a member of APP_NAME_PLACE,
please click START_URL_PLACE to accepted the invitation

PPMESSAGE -- The easiest way to communicate between users and developers,and you can click WEBSITE_URL_PLACE to konw more about us.

Yours sincerely,
Guijin Ding
CEO of PPMESSAGE

"""

_TEXT_TEMPLATE_CN = """
您好：
  
  您的朋友 USER_NAME_PLACE 邀请您成为 APP_NAME_PLACE 开发者，
请点击链接 START_URL_PLACE 接受邀请

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
    name = _p + "/" + name
    logging.info(name)
    _f = open(name)
    _d = _f.read()
    _b = base64.b64encode(_d)
    _b = _BASEBASE + _b
    return _b

def _prepare_template(info_list):

    _email = info_list["email"]
    _user_name = info_list["user_name"]
    _app_name = info_list["app_name"]
    
    _welcome = _prepare_png("welcome.png")
    _signature = _prepare_png("signature.png")

    _start_url = SIGNUP_URL
    _website_url = WEBSITE_URL
    
    _template = {
        "user_name": _user_name,
        "email": _email,
        "app_name": _app_name,
        "welcome_png": _welcome,
        "signature_png": _signature,
        "text": _TEXT_TEMPLATE_CN,
        "html": _HTML_TEMPLATE_CN,
        "subject": _SUBJECT_CN,
        "start_url": _start_url,
        "website_url": _website_url,
    }

    # if _language != "zh_cn":
    #     _template["text"] = _TEXT_TEMPLATE_EN
    #     _template["html"] = _HTML_TEMPLATE_EN
    #     _template["subject"] = _SUBJECT_EN
        
    return _template

def _render_template(template):

    _html = template.get("html")
    _html = _html.replace("WELCOME_PNG_PLACE", template.get("welcome_png"))
    _html = _html.replace("SIGNATURE_PNG_PLACE", template.get("signature_png"))
    _html = _html.replace("USER_NAME_PLACE", template.get("user_name"))
    _html = _html.replace("APP_NAME_PLACE", template.get("app_name"))
    _html = _html.replace("START_URL_PLACE", template.get("start_url"))
    template["html"] = _html

    _text = template.get("text")
    _text = _text.replace("USER_NAME_PLACE", template.get("user_name"))
    _text = _text.replace("APP_NAME_PLACE", template.get("app_name"))
    _text = _text.replace("START_URL_PLACE", template.get("start_url"))
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
        return "unreachable"
    except:
        traceback.print_exc()
        logging.error("email sending encounter an error")
        return "error"
    s.quit()
    return "reachable"

def send_invited_email(info_list):
    _t = _prepare_template(info_list)
    _r = _render_template(_t)
    logging.info(_r)
    _send_email(_r)
    return

# if __name__ == '__main__':
#     _portal_user = {
#         "user_email": "dingguijin@gmail.com",
#         "user_lastname" : "Guijin",
#         "user_language" : "en_us",
#         "server_origin" : "127.0.0.1",
#     }
#     send_verify_email(_portal_user)
