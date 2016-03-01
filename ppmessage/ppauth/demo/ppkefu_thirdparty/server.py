# -*- coding: utf-8 -*-

import tornado.web
import tornado.ioloop
import tornado.options
import tornado.httpserver
import tornado.httpclient

import os
import json
import uuid
import logging

tornado.options.define("port", default=8090, help="", type=int)

API_URI = "http://localhost:8080/api"
AUTH_URI = "http://localhost:8080/ppauth/auth"
TOKEN_URI = "http://localhost:8080/ppauth/token"
REDIRECT_URI = "http://localhost:8090/auth_callback"

APP_UUID = "9d77fee8-db7f-11e5-a6a5-ac87a30c6610"
CLIENT_ID = "MTgwNjMxZTg5MzZhMTliYzNkZTA1NGU1YmY0ZmE0NDljZGRkM2QwMw=="
CLIENT_SECRET = "MjViNTFhODQwODQzNWNhMzQyNDI3MDVlYzNlYmRmYWFjMjZiOTA2Nw=="

def createBodyString(params):
    body = ""
    for param in params:
        body += "&" + param + "=" + str(params[param])
    return body.lstrip("&")

class AuthCallbackHandler(tornado.web.RequestHandler):

    def get(self):
        """
        REDIRECT_URI and CLIENT_ID should match with client
        """
        code = self.get_query_argument("code")
        # FIXME: should compare state with former state
        state = self.get_query_argument("state")
        body = createBodyString({
            "code": code,
            "client_id": CLIENT_ID,
            "redirect_uri": REDIRECT_URI,
            "client_secret": CLIENT_SECRET,
            "grant_type": "authorization_code"
        })

        request = tornado.httpclient.HTTPRequest(TOKEN_URI, method="POST", body=body)
        client = tornado.httpclient.HTTPClient()
        response = client.fetch(request)

        res_body = json.loads(response.body)
        logging.info(res_body)
        self.write("code: "+ code + "<hr>" + "state: " + state + "<hr>")
        for item in res_body:
            self.write(item + ": " + str(res_body[item]) + "<hr>")

        # a test
        user_list = self.getAppServiceUserList(res_body["access_token"])
        self.write("<h1>test getappserviceuserlist using access_token</h1>");
        for item in user_list:
            self.write(item + ": " + str(user_list[item]) + "<hr>")

    # token test
    def getAppServiceUserList(self, token):
        api_uri = API_URI + "/PP_GET_APP_SERVICE_USER_LIST"
        body = json.dumps({ "app_uuid": APP_UUID })
        headers = {
            "Content-Type": "application/json",
            "Authorization": "OAuth " + token
        }
        request = tornado.httpclient.HTTPRequest(api_uri, method="POST", headers=headers, body=body)
        client = tornado.httpclient.HTTPClient()
        response = client.fetch(request)
        res_body = json.loads(response.body)
        return res_body

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        index_path = os.path.abspath(os.path.dirname(__file__)) + "/client/index.html";
        with open(index_path, "r") as f:
            self.write(f.read())

class RequestAuthHandler(tornado.web.RequestHandler):
    def get(self):
        params = {
            "state": str(uuid.uuid1()),   # FIXME: save state for comparison later
            "client_id": CLIENT_ID,
            "redirect_uri": REDIRECT_URI,
            "response_type": "code"
        }
        logging.info(params)
        target_url = AUTH_URI + "?" + createBodyString(params)
        self.redirect(target_url)
        
class App(tornado.web.Application):
    def __init__(self):
        settings = {}
        settings["debug"] = True
        settings["static_path"] = os.path.abspath(os.path.dirname(__file__)) + "/client"
        handlers = [
            ("/", MainHandler),
            ("/request_auth", RequestAuthHandler),
            ("/auth_callback", AuthCallbackHandler)
        ]
        super(App, self).__init__(handlers, **settings)

if __name__ == "__main__":
    tornado.options.parse_command_line()
    app = App()
    http_server = tornado.httpserver.HTTPServer(app)
    http_server.listen(tornado.options.options.port)
    logging.info("Starting Auth Callback servcie.")
    tornado.ioloop.IOLoop.instance().start()
