$yvUserService.$inject = [];
function $yvUserService() {

    var _user = {
        uuid: null,
        
        app_uuid: null,
        session_uuid: null,
        
        email: null,
        fullname: null,
        
        icon: null,
        lang: null,
        role: null,
        logined: false,
        password: null,

        status: null,

        firstname: null,
        lastname: null,

        company: null,
        team: null,

        access_token: null,
    };

    return {
        get: function (attribute) {
            if (arguments.length === 0) {
                return _user;
            }
            if (_user.hasOwnProperty(attribute)) {
                return _user[attribute];
            }
            return null;
        },

        set: function (attribute, value) {
            if (_user.hasOwnProperty(attribute)) {
                _user[attribute] = value;
            }
        },

        is_admin_user: function() {
            return _user && _user.status === 'ADMIN';
        },

        set_company: function(_company) {
            _user.company = _company;
        },

        get_company: function() {
            return _user.company;
        },

        set_lastname: function(_name) {
            _user.lastname = _name;
        },
        
        get_lastname: function() {
            return _user.lastname;
        },

        set_firstname: function(_name) {
            _user.firstname = _name;
        },
        
        get_firstname: function() {
            return _user.firstname;
        },
        
        set_status: function(_status) {
            _user.status = _status;
        },

        get_status: function() {
            return _user.status;
        },
        
        get_password: function() {
            return _user.password;
        },

        set_password: function(password) {
            _user.password = password;
        },
        
        get_session: function() {
            return _user.session_uuid;
        },

        set_session: function(_id) {
            _user.session_uuid = _id;
        },

        set_email: function(_email) {
            _user.email = _email;
        },

        get_email: function() {
            return _user.email;
        },
        
        set_fullname: function(_name) {
            _user.fullname = _name;
        },

        get_fullname: function() {
            return _user.fullname;
        },
        
        set_icon: function(_icon) {
            _user.icon = _icon;
        },

        get_icon: function() {
            return _user.icon;
        },
                
        set_uuid: function(_uuid) {
            _user.uuid = _uuid;
        },

        get_uuid: function() {
            return _user.uuid;
        },
        
        set_language: function(_l) {
            _user.lang = _l;
        },

        get_language: function() {
            return _user.lang;
        },
        
        set_role: function(_role) {
            _user.role = _role;
        },

        get_role: function() {
            return _user.role;
        },
        
        set_logined: function(_logined) {
            _user.logined = _logined;
        },

        get_logined: function() {
            return _user.logined;
        },

        set_app_uuid: function(_uuid) {
            _user.app_uuid = _uuid;
        },

        get_app_uuid: function() {
            return _user.app_uuid;
        },

        set_team: function(_team) {
            if (_user.team == null) {
                _user.team = {};
            }
            if ( !_team ) {
                _user.team = _team;
            }
            for (var _i in _team) {
                if (_team.hasOwnProperty(_i)) {
                    _user.team[_i] = _team[_i];
                }
            }
            return;
        },

        get_team: function() {
            return _user.team;
        },

        set_team_agent: function(_agent_num) {
            _user.team.agent_num = _agent_num;
        },

        get_team_agent: function() {
            return _user.team.agent_num;
        },

        set_login_data: function(data) {
            this.set_logined(true);
            this.set_fullname(data.user_fullname);
            this.set_lastname(data.user_lastname);
            this.set_firstname(data.user_firstname);
            this.set_company(data.user_company);
            this.set_email(data.user_email);
            this.set_session(data.session_uuid);
            this.set_uuid(data.uuid);
            this.set_password(data.user_password);
            this.set_app_uuid(data.app_uuid);
            this.set_icon(data.user_icon);
            this.set_status(data.user_status);
            return;
        },

        //clean up all data and status
        logout: function() {
            for (var _i in _user) {
                _user[_i] = null;
            };
            _user["logined"] = false;
            console.log("===",this.get());
            return;
        },
    };
}

angular.module("this_app.services")
    .factory("yvUser", $yvUserService);
