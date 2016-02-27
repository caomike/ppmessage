/*
 * replace 'AUTH_URI', 'REDIRECT_URI' and 'CLIENT_ID' with your own ones
 * 
 */

var AUTH_URI = "http://localhost:8080/ppauth/auth";
var REDIRECT_URI = "http://localhost:8090/auth_callback";
var CLIENT_ID = "MTgwNjMxZTg5MzZhMTliYzNkZTA1NGU1YmY0ZmE0NDljZGRkM2QwMw==";

function createQueryString(params) {
    var query_string = "";
    for (param in params) {
        query_string += "&" + param + "=" + params[param];
    }
    if (query_string.length == 0) {
        return query_string;
    }
    return "?" + query_string.slice(1);
}

function openAuthPage() {
    var params = {
        "state": "stable",
        "response_type": "code",
        "client_id": CLIENT_ID,
        "redirect_uri": REDIRECT_URI
    };
    var auth_uri = AUTH_URI + createQueryString(params);
    
    window.open(auth_uri);
}
