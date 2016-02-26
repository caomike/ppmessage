# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage YVertical.
# Yuan Wanshang, wanshang.yuan@yvertical.com
# All rights reserved
#
# web/sendemail.py
#

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

                
def sendEmail(to_list, sub, content_text, content_html):
    """
    to_list: send to someone
    sub: theme
    content: email content
    #homedir = os.path.split(os.path.realpath(__file__))[0]
    #fp = open(homedir + "/assets/static/metronic/admin/assets/img/bg/1.jpg")
    #img = MIMEImage(fp.read())
    #fp.close()
    #img.add_header('Content-ID', '<image1>')
 
    """
    
    mail_host = "smtp.126.com"
    mail_user = "yvertical"
    mail_pass = "!Q@W#E$R%67890"
    mail_postfix = "126.com"
    
    me = mail_user + "<" + mail_user + "@" + mail_postfix + ">"
    msg = MIMEMultipart("alternative")
    msg["Subject"] = sub
    msg["From"] = me
    msg["To"] = ";".join(to_list)
    
    part1 = MIMEText(content_text, "plain")
    part2 = MIMEText(content_html, "html")
    msg.attach(part1)
    msg.attach(part2)
    #msg.attach(img)
        
    try:
        s = smtplib.SMTP()
        s.connect(mail_host)
        s.login(mail_user, mail_pass)
        s.sendmail(me, to_list, msg.as_string())
        s.close()
        return True
    except Exception, e:
        print str(e)
        return False
