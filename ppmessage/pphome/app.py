# -*- coding: utf-8 -*-
#
# Copyright (C) 2010-2016 YVertical.
# Guijin Ding, dingguijin@gmail.com
# All rights reserved
#
#
# pphome/app.py
#

from tornado.web import Application
from tornado.web import RequestHandler
from tornado.web import RedirectHandler
from tornado.web import StaticFileHandler
from tornado.locale import load_translations
from tornado.locale import get as get_locale

import os
import json
import logging

def get_current_path(_dir_name):
    _static_path = os.path.abspath(__file__)
    _static_path = os.path.dirname(_static_path)
    _static_path = _static_path + os.sep + _dir_name
    return _static_path

class BaseHandler(RequestHandler):
    ''' Base request handler for all html requests '''
    def render_html(self, html, lang=None):
        ''' Render html with lang '''
        _lang = lang or self.locale.code or 'zh_CN'
        # Redirect me or render directly ?
        if lang == None:
            self.redirect(_lang + '/' + html)
            return
        try:
            self.render(html, locale=get_locale(_lang), _=get_locale(_lang).translate)
        except Exception as e:
            logging.info( 'exception: %s', str( e or 'unknown' ) )
            self.write_error(404)

    def static_url(self, path, include_host=None, **kwargs):
        self.require_setting("static_path", "static_url")
        base = "/home/static/"
        return base + path

class MainHandler(BaseHandler):
    def get(self):
        self.render_html('index.html')
        return

class HtmlHandler(BaseHandler):    
    def get(self, html):
        self.render_html(html)
        return

class HtmlLangHandler(BaseHandler):
    def get(self, lang, html):
        self.render_html(html, lang)
        return
    
class App(Application):
    def __init__(self):
        self.support_locales = [
            "en_US",
            "zh_CN",
            "zh_TW",
        ]
        load_translations(get_current_path("i18n"))
        settings = {}
        settings["debug"] = True
        settings["static_path"] = get_current_path("static")
        settings["template_path"] = get_current_path("html")
        settings["cookie_secret"] = "24oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo="
        handlers = [
            (r"/", MainHandler),
            (r"/([\w]+\.html$)", HtmlHandler),
            (r"/([a-z]+_[A-Za-z]+)/([\w]+\.html$)", HtmlLangHandler)
        ]
        Application.__init__(self, handlers, **settings)
    

