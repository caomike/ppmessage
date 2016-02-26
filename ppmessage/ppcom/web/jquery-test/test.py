import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
from tornado.web import StaticFileHandler
from tornado.options import define,options
define("port", default = 8001, help = "run on the given port", type = int)

import os
import logging

def _web_path(pre):
    _path = os.path.join(os.path.dirname(__file__))
    _path = os.path.join(_path, pre)
    logging.info(_path)
    return _path

class TestHandler(tornado.web.RequestHandler):
    
    def post(self):
        page = 'test.html' #test-qqbrowser.html
        with open(page) as f:
            self.write(f.read())

    def get(self):
        self.post()

class PPMessageHandler(tornado.web.RequestHandler):
    def get(self):
        page = 'test-ppmessage.html'
        with open(page) as f:
            self.write(f.read())

class IntercomHandler(tornado.web.RequestHandler):
    
    def post(self):
        page = 'test-intercom.html'
        with open(page) as f:
            self.write(f.read())

    def get(self):
        self.post()

class PPDebugTestHandler(tornado.web.RequestHandler):
    
    def post(self):
        page = 'test-merge.html'
        with open(page) as f:
            self.write(f.read())

    def get(self):
        self.post()

if __name__ == "__main__":
    tornado.options.parse_command_line()

    app = tornado.web.Application(
        handlers = [
            (r"/", TestHandler),
            (r"/debug", PPDebugTestHandler),
            (r"/intercom", IntercomHandler),
            (r"/ppmessage", PPMessageHandler),
            (r"/libs/(.*)", StaticFileHandler, {
                "path": os.path.join(os.path.dirname(__file__), "../assets"),
            }),
            (r"/assets/(.*)", StaticFileHandler, {
                "path": os.path.join(os.path.dirname(__file__), "assets"),
            }),
            (r"/src/(.*)", StaticFileHandler, {
                "path": os.path.join(os.path.dirname(__file__), "../src")
            })
        ],
        debug=True
    )
    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(options.port)
    print "I'm running in port:", options.port
    tornado.ioloop.IOLoop.instance().start()
