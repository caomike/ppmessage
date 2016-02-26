# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Lining , ning.li@yvertical.com
#
# All rights reserved
#


from tornado.web import StaticFileHandler

import mimetypes
import logging
import magic


class IconFileHandler(StaticFileHandler):

    def get_content_type(self):
        try:
            _mime = None
            with magic.Magic(flags=magic.MAGIC_MIME_TYPE) as m:
                _mime = m.id_filename(self.absolute_path)
            logging.info("mime is %s" % _mime)
            if _mime:
                self.set_header('Content-Type', _mime)
                return
        except Exception, e:
            pass
        self.set_header('Content-Type', 'image/jpg')

