# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 PPMessage.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
# core/imageconverter.py
#

from mdm.core.constant import THUMBNAIL_WIDTH
from mdm.core.constant import THUMBNAIL_HEIGHT

import base64
from PIL import Image
from io import BytesIO
from StringIO import StringIO
import logging
import os

class ImageConverter:

    position_dict = {
        "1": (59, [
            (40, 40, 99, 99)
        ]),
        "2": (59, [
            (7, 40, 66, 99),
            (73, 40, 132, 99)
        ]),
        "3": (59, [
            (40, 7, 99, 66),
            (7, 73, 66, 132),
            (73, 73, 132, 132)
        ]),
        "4": (59, [
            (7, 7, 66, 66),
            (73, 7, 132, 66),
            (7, 73, 66, 132),
            (73, 73, 132, 132)
        ]),
        "5": (37, [
            (29, 29, 66, 66),
            (73, 29, 110, 66),
            (7, 73, 44, 110),
            (51, 73, 88, 110),
            (95, 73, 132, 110)
        ]),
        "6": (37, [
            (51, 7, 88, 44),
            (29, 51, 66, 88),
            (73, 51, 110, 88),
            (7, 95, 44, 132),
            (51, 95, 88, 132),
            (95, 95, 132, 132)
        ]),
        "7": (37, [
            (51, 7, 88, 44),
            (7, 51, 44, 88),
            (51, 51, 88, 88),
            (95, 51, 132, 88),
            (7, 95, 44, 132),
            (51, 95, 88, 132),
            (95, 95, 132, 132)
        ]),
        "8": (37, [
            (29, 7, 66, 44),
            (73, 7, 110, 44),
            (7, 51, 44, 88),
            (51, 51, 88, 88),
            (95, 51, 132, 88),
            (7, 95, 44, 132),
            (51, 95, 88, 132),
            (95, 95, 132, 132)
        ]),
        "9": (37, [
            (7, 7, 44, 44),
            (51, 7, 88, 44),
            (95, 7, 132, 44),
            (7, 51, 44, 88),
            (51, 51, 88, 88),
            (95, 51, 132, 88),
            (7, 95, 44, 132),
            (51, 95, 88, 132),
            (95, 95, 132, 132)
        ])
    }

    @staticmethod
    def resize(_data, _width, _height):
        _im = Image.open(BytesIO(base64.b64decode(_data)))
        _ratio = min(_width/_im.size[0], _height/_im.size[1])
        _im.thumbnail((_im.size[0]*_ratio, _im.size[1]*_ratio), Image.ANTIALIAS)
        _o = StringIO()
        _im.save(_o, format="PNG",quality=50)
        _o.seek(0)

        return base64.b64encode(_o.read())

    @staticmethod
    def thumbnail(_data, _format):
        _width = THUMBNAIL_WIDTH
        _height = THUMBNAIL_HEIGHT
        _im = _data
        if not isinstance(_data, Image.Image):
            _im = Image.open(BytesIO(_data))
        _im = _im.convert("RGB")
        _ratio = min(_width*1.00/_im.size[0]*1.00, _height*1.00/_im.size[1]*1.00)
        _to = (int(_im.size[0]*_ratio), int(_im.size[1]*_ratio))
        _im.thumbnail(_to, Image.ANTIALIAS)
        _o = StringIO()
        _im.save(_o, format=_format, quality=50)
        _o.seek(0)
        return _o.read()

    @staticmethod
    def png2jpeg(_data):
        _im = Image.open(BytesIO(_data))
        _o = StringIO()
        _im.save(_o, format="JPEG", quality=50)
        _o.seek(0)
        return _o.read()


    # background size: (139px, 139px)
    # format: PNG
    # border-width: 7px
    # icon-size: (37px, 37px) for 3x3, (59px, 59px) for 2x2
    @staticmethod
    def conversation_icon(icon_list):
        length = len(icon_list)

        if length > 9:
            length = 9
            icon_list = icon_list[0:9]
        
        abspath = os.path.abspath(__file__)
        current_dir = os.path.dirname(abspath)
        default_icon_path = os.path.join(current_dir, "default_icon.png")
        background_path = os.path.join(current_dir, "conversation_icon_background.png")
        background_image = Image.open(background_path)
        size, position_list  = ImageConverter.position_dict.get(str(length), (None, None))

        if size is not None:
            thumbnail_size = (size, size)
            thumbnail_box = (0, 0, size, size)

            for i, icon in enumerate(icon_list):
                if not icon:
                    icon_image = Image.open(default_icon_path)
                else:
                    try:
                        icon_image = Image.open(icon)
                    except IOError, e:
                        icon_image = Image.open(default_icon_path)
                icon_image.thumbnail(thumbnail_size)
                region = icon_image.crop(thumbnail_box)
                background_image.paste(region, position_list[i])

        io = StringIO()
        background_image.save(io, "PNG")
        io.seek(0)
        return io.read()
