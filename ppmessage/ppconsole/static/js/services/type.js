angular.module("this_app").
   factory("yvType", [
    "yvConstants",
function (yvConstants) {

    function _get_subtype(message) {
        // message query from db
        if (message.message_subtype) {
            return message.message_subtype;
        }
        // incoming message message subtype
        if (message.ms) {
            return message.ms;
        }

        return null;
    }

    return {
        is_logout: function (message) {
            var subtype = _get_subtype(message);
            if (subtype === yvConstants.MESSAGE_SUBTYPE.LOGOUT) {
                return true;
            }
            return false;
        },

        is_document: function (message) {
            var subtype = _get_subtype(message);
            if (subtype === yvConstants.MESSAGE_SUBTYPE.DOCUMENT) {
                return true;
            }
            return false;
        },

        is_file: function (message) {
            var subtype = _get_subtype(message);
            if (subtype === yvConstants.MESSAGE_SUBTYPE.DOCUMENT) {
                return true;
            }
            if (subtype === yvConstants.MESSAGE_SUBTYPE.FILE) {
                return true;
            }
            return false;
        },

        is_video: function (message) {
            var subtype = _get_subtype(message);
            if (subtype === yvConstants.MESSAGE_SUBTYPE.VIDEO) {
                return true;
            }
            return false;
        },


        is_single_card: function (message) {
            var subtype = _get_subtype(message);
            if (subtype === yvConstants.MESSAGE_SUBTYPE.SINGLE_CARD) {
                return true;
            }
            return false;
        },

        is_multiple_card: function (message) {
            var subtype = _get_subtype(message);
            if (subtype === yvConstants.MESSAGE_SUBTYPE.MULTIPLE_CARD) {
                return true;
            }
            return false;
        },

        is_text: function (message) {
            var subtype = _get_subtype(message);
            if (subtype === yvConstants.MESSAGE_SUBTYPE.TEXT) {
                return true;
            }
            return false;
        },

        is_txt: function (message) {
            var subtype = _get_subtype(message);
            if (subtype === yvConstants.MESSAGE_SUBTYPE.TXT) {
                return true;
            }
            return false;
        },

        is_image: function (message) {
            var subtype = _get_subtype(message);
            if (subtype === yvConstants.MESSAGE_SUBTYPE.IMAGE) {
                return true;
            }
            return false;
        },

        is_gps_location: function (message) {
            var subtype = _get_subtype(message);
            if (subtype === yvConstants.MESSAGE_SUBTYPE.GPS_LOCATION) {
                return true;
            }
            return false;
        },

        is_audio: function (message) {
            var subtype = _get_subtype(message);
            if (subtype === yvConstants.MESSAGE_SUBTYPE.AUDIO) {
                return true;
            }
            return false;
        },

        is_left: function (message) {
            if (message.message_direction === yvConstants.MESSAGE_DIR.DIR_IN) {
                return true;
            }
            return false;
        },

        is_right: function (message) {
            if (message.message_direction === yvConstants.MESSAGE_DIR.DIR_OUT) {
                return true;
            }
            return false;
        },

        is_left_audio: function (message) {
            if (this.is_left(message) && this.is_audio(message)) {
                return true;
            }
            return false;
        },

        is_right_audio: function (message) {
            if (this.is_right(message) && this.is_audio(message)) {
                return true;
            }
            return false;
        }
    };
}]);
