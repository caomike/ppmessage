# -*- coding: utf-8 -*-
# Copyright (C) 2010-2016 PPMessage.
#
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# core/email/reset.py
#

from ppmessage.help.datetimeencoder import DateTimeEncoder
from ppmessage.core.constant import PORTAL_PORT
from ppmessage.core.constant import DEV_MODE

from smtplib import SMTP
from smtplib import SMTPRecipientsRefused
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.header import Header

import base64
import logging
import json
import os
import traceback

_EMAIL_HOST='smtp.exmail.qq.com'
_EMAIL_USER='ppmessage@ppmessage.cn'
_EMAIL_PASSWORD='YVERTICAL1q2w3e4r5t'
_EMAIL_FROM='ppmessage@ppmessage.cn'

_SUBJECT_CN='忘记密码--皮皮消息'
_SUBJECT_EN='Forgot your password -- PPMESSAGE'

_HTML_TEMPLATE_EN = """
<html><head>
</head>
<body>

<p>PPMESSAGE received a request to reset the password for your Layer user account associated with this email address.</p>

<p>To reset your password, click on the link below:</p>

<p><a href="RESET_URL_PLACE" target="_blank"> RESET_URL_PLACE </a></p>

<p> If you didn't request a password reset, please ignore this email. </p>

<p>Thanks,</p>
<p>The PPMESSAGE Team</p>
<p>ppmessage.cn</p>
<p></p>

</body>
</html>
"""

_HTML_TEMPLATE_CN = """

<html><head>
</head>
<body>

<p>皮皮消息收到了与这个邮件关联用户的密码重设请求。</p>

<p>完成密码重设，请点击以下链接：</p>

<p><a href="RESET_URL_PLACE" target="_blank"> RESET_URL_PLACE </a></p>

<p> 如果您没有执行过密码重设的请求，请忽略这封邮件。</p>

<p>谢谢！</p>
<p>皮皮消息团队</p>
<p>ppmessage.cn</p>
<p></p>

</body>
</html>
"""

_TEXT_TEMPLATE_EN = """

PPMESSAGE received a request to reset the password for your Layer user account associated with this email address.

To reset your password, click on the link below:

RESET_URL_PLACE

If you didn't request a password reset, please ignore this email.

Thanks,
The PPMESSAGE Team
ppmessage.cn

"""

_TEXT_TEMPLATE_CN = """

皮皮消息收到了与这个邮件关联用户的密码重设请求。

完成密码重设，请点击以下链接：

RESET_URL_PLACE

如果您没有执行过密码重设的请求，请忽略这封邮件。

谢谢！
皮皮消息团队
ppmessage.cn


"""


def _prepare_template(portal_user):

    _language = portal_user.get("user_language")
    _email = portal_user.get("user_email")
    _lastname = portal_user.get("user_lastname")
    _host = portal_user.get("server_host")
    
    if _language == None:
        _language = "zh_cn"

    _user_str = json.dumps(portal_user, cls=DateTimeEncoder)
    _user_str = base64.b64encode(_user_str)

    _reset_url = "https://www.ppmessage.cn/portal/#/app/recoverpassword/" + _user_str
    if DEV_MODE:
        _reset_url = "http://" + portal_user.get("server_origin") + ":" + str(PORTAL_PORT) + "/portal/#/app/recoverpassword/" + _user_str
    
    _template = {
        "email": _email,
        "text": _TEXT_TEMPLATE_CN,
        "html": _HTML_TEMPLATE_CN,
        "subject": _SUBJECT_CN,
        "reset_url": _reset_url,
    }

    if _language != "zh_cn":
        _template["text"] = _TEXT_TEMPLATE_EN
        _template["html"] = _HTML_TEMPLATE_EN
        _template["subject"] = _SUBJECT_EN
        
    return _template

def _render_template(template):

    _html = template.get("html")
    _html = _html.replace("RESET_URL_PLACE", template.get("reset_url"))
    template["html"] = _html

    _text = template.get("text")
    _text = _text.replace("RESET_URL_PLACE", template.get("reset_url"))
    template["text"] = _text
    
    return template

def _build_email_msg(template):
    '''
    For Chinese language support, test on 

    - `mail.qq.com`
    - `mail.163.com`
    - `mail.google.com`

    working well
    '''
    import sys
    reload(sys)
    sys.setdefaultencoding('utf-8')
    
    mailto = template.get("email")
    subject = template.get("subject")
    body = template.get("html") # 'html' or 'plain'
    
    if isinstance(body, unicode):
        body = str(body)

    me= ("%s<" + _EMAIL_FROM + ">") % ( Header('PPMessage','utf-8'), )
    msg = MIMEText(body, 'html', 'utf-8') # 'html' or 'plain'
    if not isinstance(subject,unicode):
        subject = unicode(subject)
    msg['Subject'] = subject
    msg['From'] = me
    msg['To'] = mailto
    msg["Accept-Language"]="zh-CN"
    msg["Accept-Charset"]="ISO-8859-1,utf-8"

    return msg

def _send_email(template):
    s = SMTP(_EMAIL_HOST)
    msg = _build_email_msg(template)
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
        logging.info("email sending encounter an error")
        return "error"
    s.quit()
    return "reachable"

def send_reset_email(portal_user):
    _t = _prepare_template(portal_user)
    _r = _render_template(_t)
    _send_email(_r)
    return

if __name__ == '__main__':
    _portal_user = {
        "user_email": "dingguijin@gmail.com",
        "user_lastname" : "Guijin",
        "user_language" : "en_us",
        "server_origin" : "127.0.0.1",
    }
    send_reset_email(_portal_user)
