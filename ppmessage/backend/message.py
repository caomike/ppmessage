# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# init/message.py 
# The entry for message service
#
#

from ppmessage_mqtt import mqtt_server
from tornado.options import parse_command_line

if __name__ == "__main__":
    parse_command_line()
    mqtt_server()

