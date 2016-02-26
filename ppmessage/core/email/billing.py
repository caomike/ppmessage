# -*- coding: utf-8 -*-
# Copyright (C) 2010-2016 PPMessage.
#
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# core/email/welcome.py
#
from mdm.core.constant import PORTAL_PORT
from mdm.core.constant import DEV_MODE

from smtplib import SMTP
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from smtplib import SMTPRecipientsRefused

import base64
import logging
import json
import os
import traceback

_EMAIL_HOST='smtp.exmail.qq.com'
_EMAIL_USER='ppmessage@ppmessage.cn'
_EMAIL_PASSWORD='YVERTICAL1q2w3e4r5t'
_EMAIL_FROM='ppmessage@ppmessage.cn'

_SUBJECT_CN='用户注册确认--PPMESSAGE'
_SUBJECT_EN='User registration confirmation -- PPMESSAGE'

_HTML_TEMPLATE_EN = """
<html><head>
</head>
<body>
<center>
<img src="WELCOME_PNG_PLACE" style="width:200px; height:auto;"></img>
<div style="height:40px;"></div>
<p style="font-family: HelveticaNeue, Helvetica, Arial, sans-serif; font-weight: 300; font-size:18px">
The easiest way to communicate for you and customer.
</p>

<a href="LOGIN_URL_PLACE" target="_blank" style="text-decoration: none;">
<div style="font-family: HelveticaNeue, Helvetica, Arial, sans-serif; color:white; height: 30px; width: 262px; background-color:#2597da; border-radius:5px; padding:10px 0 0 0; ">Start customer service with PPMESSAGE</div>
</a>

<p style=" font-weight: 300; font-size:14px">You are able to send message to your customer.</p>

<div style="height:30px;"></div>

<p style="font-family: HelveticaNeue, Helvetica, Arial, sans-serif; font-weight: 300; font-size:18px">Thanks for choosing PPMESSAGE to start customer service.</p>

<img src="SIGNATURE_PNG_PLACE" style="width:200px; height:auto;"> </img>

<p class="p-small" style="margin: 0; font-family: HelveticaNeue, Helvetica, Arial, sans-serif; font-weight: 300; font-size: 12px;">Just in case -- your login email is EMAIL_STR_PLACE</p>
<p class="p-small" style="margin: 0; font-family: HelveticaNeue, Helvetica, Arial, sans-serif; font-weight: 300; font-size: 12px;">and you can <a href="RESET_URL_PLACE" style="color: #2daae4; font-family: HelveticaNeue, Helvetica, Arial, sans-serif; text-decoration: none;" target="_blank">reset your password here</a>.</p>
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
在线用户沟通的最佳方式
</p>

<a href="LOGIN_URL_PLACE" target="_blank" style="text-decoration: none;">
<div style="font-family: HelveticaNeue, Helvetica, Arial, sans-serif; color:white; height: 30px; width: 262px; background-color:#2597da; border-radius:5px; padding:10px 0 0 0; ">使用PPMESSAGE开始服务</div>
</a>

<p style=" font-weight: 300; font-size:14px">马上就可以进行在线服务</p>

<div style="height:30px;"></div>

<p style="font-family: HelveticaNeue, Helvetica, Arial, sans-serif; font-weight: 300; font-size:18px">感谢您使用PPMESSAGE</p>

<img src="SIGNATURE_PNG_PLACE" style="width:200px; height:auto;"> </img>

<p class="p-small" style="margin: 0; font-family: HelveticaNeue, Helvetica, Arial, sans-serif; font-weight: 300; font-size: 12px;">以备万一 -- 你的邮箱是 EMAIL_STR_PLACE</p>
<p class="p-small" style="margin: 0; font-family: HelveticaNeue, Helvetica, Arial, sans-serif; font-weight: 300; font-size: 12px;">您也可以<a href="RESET_URL_PLACE" style="color: #2daae4; font-family: HelveticaNeue, Helvetica, Arial, sans-serif; text-decoration: none;" target="_blank">在这里重设密码</a>.</p>
<p style="margin: 0; font-family: HelveticaNeue, Helvetica, Arial, sans-serif; font-weight: 300;">www.ppmessage.cn</p>
</center>


</body></html>
"""

_TEXT_TEMPLATE_EN = """

Dear FIRST_NAME_STR_PLACE:

To start customer service PPMESSAGE, please go to LOGIN_URL_PLACE login with your email.
We are looking forward to your build with PPMESSAGE. Just in case your email is EMAIL_STR_PLACE.
To reset your password, please go to RESET_URL_PLACE. 

Yours sincerely,
Guijin Ding
Founder & CEO of PPMESSAGE

"""

_TEXT_TEMPLATE_CN = """
FIRST_NAME_STR_PLACE 您好：

请使用浏览器访问如下链接 LOGIN_URL_PLACE，开始为您的客户提供服务。
我非常期待您使用PPMESSAGE的产品面市，选择皮皮消息进行用户服务是对我们莫大的信任和鼓励。

以备万一您忘记了EMAIL_STR_PLACE的密码，可以访问如下链接 RESET_URL_PLACE 重设密码。

此致


    敬礼

丁贵金
创始人&CEO
PPMESSAGE

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

def _prepare_template(portal_user):

    _language = portal_user.get("user_language")
    _email = portal_user.get("user_email")
    _lastname = portal_user.get("user_lastname")
    _host = portal_user.get("server_origin")
    
    if _language == None:
        _language = "zh_cn"

    _welcome = _prepare_png("welcome.png")
    _signature = _prepare_png("signature.png")

    _user_str = json.dumps(portal_user)
    _user_str = base64.b64encode(_user_str)

    _login_url = "https://www.ppmessage.cn/portal/#/app/login/" + _user_str
    _reset_url = "https://www.ppmessage.cn/portal/#/app/recoverpassword/" + _user_str
    if DEV_MODE:
        _login_url = "http://" + portal_user.get("server_origin") + ":" + str(PORTAL_PORT) + "/portal/#/app/login/" + _user_str
        _reset_url = "http://" + portal_user.get("server_origin") + ":" + str(PORTAL_PORT) + "/portal/#/app/recoverpassword/" + _user_str
    
    _template = {
        "last_name": _lastname,
        "email": _email,
        "welcome_png": _welcome,
        "signature_png": _signature,
        "text": _TEXT_TEMPLATE_CN,
        "html": _HTML_TEMPLATE_CN,
        "subject": _SUBJECT_CN,
        "login_url": _login_url,
        "reset_url": _reset_url,
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
    _html = _html.replace("EMAIL_STR_PLACE", template.get("email"))
    _html = _html.replace("LAST_NAME_STR_PLACE", template.get("last_name"))
    _html = _html.replace("LOGIN_URL_PLACE", template.get("login_url"))
    _html = _html.replace("RESET_URL_PLACE", template.get("reset_url"))
    template["html"] = _html

    _text = template.get("text")
    _text = _text.replace("EMAIL_STR_PLACE", template.get("email"))
    _text = _text.replace("LAST_NAME_STR_PLACE", template.get("last_name"))
    _text = _text.replace("LOGIN_URL_PLACE", template.get("login_url"))
    _html = _html.replace("RESET_URL_PLACE", template.get("reset_url"))
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
    except SMTPRecipientsRefused:   #when email is invalid and unreachable
        logging.info("email unreachable")
        s.quit()
        return "unreachable"
    except:
        traceback.print_exc()
        logging.error("email sending encounter an error")
        return "error"
    finally:
        logging.info("clean up")
    s.quit()
    return "reachable"

def send_billing_email(portal_user):
    _t = _prepare_template(portal_user)
    _r = _render_template(_t)
    _ok = _send_email(_r)
    return _ok
    
if __name__ == '__main__':
    _portal_user = {
        "user_email": "dingguijin@gmail.com",
        "user_lastname" : "Guijin",
        "user_language" : "en_us",
        "server_origin" : "127.0.0.1",
    }
    send_verify_email(_portal_user)
