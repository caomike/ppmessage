# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
#
# All rights reserved
#

from tornado.web import RequestHandler

import logging
import qrcode
import StringIO

class QRCodeHandler(RequestHandler):

    def get(self):
        _link = self.get_argument("link", default=None)
        if not _link:
            return None

        _qr = qrcode.QRCode(version=1,
                            error_correction=qrcode.constants.ERROR_CORRECT_L,
                            box_size=10,
                            border=4)
        _qr.add_data(_link)
        _qr.make(fit=True)
        _img = _qr.make_image()
        _img_io = StringIO.StringIO()
        _img.save(_img_io, "jpeg")
        self.set_header("Content-Type", "image/jpeg")
        self.write(_img_io.getvalue())
        


