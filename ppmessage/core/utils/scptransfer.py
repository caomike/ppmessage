# -*- coding: utf-8 -*-
# Copyright (C) 2010-2016 PPMessage YVertical.
#
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# help/scptransfer.py
#

import paramiko

class ScpTransfer:

    def __init__(self, _host, _user, _pass):
        self._scp = None
        self._sftp = None
        
        self._scp = paramiko.Transport((_host, 22))
        #建立连接
        self._scp.connect(username=_user, password=_pass)
 
        #建立一个sftp客户端对象，通过ssh transport操作远程文件
        self._sftp = paramiko.SFTPClient.from_transport(self._scp)

    def put(self, _local, _remote):
        #Copy a remote file (remotepath) from the SFTP server to the local host
        #sftp.get('/root/debian7','/tmp/debian7')
 
        #Copy a local file (localpath) to the SFTP server as remotepath
        self._sftp.put(_local, _remote)

    def close(self):
        self._scp.close()
