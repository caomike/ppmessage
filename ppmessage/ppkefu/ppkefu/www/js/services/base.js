ppmessageModule.factory('yvBase', [
    "$timeout",
    "$rootScope",
    "yvDB",
    "yvSys",
    "yvAPI",
    "yvLog",
    "yvLink",
    "yvObject",
    "yvMessage",
    "yvContact",
    "yvConversation",
function ($timeout, $rootScope, yvDB, yvSys, yvAPI, yvLog, yvLink, yvObject, yvMessage, yvContact, yvConversation) {
    
    var scope = $rootScope.$new();
    var service_mapping = null;
    var update_mapping = null;
    var scope_mapping = null;
    
    scope.objects = {
        dict: {},
        list: []
    };
    
    scope.conversations = {
        dict: {},
        list: [],
        page: 0,
        current_active: null
    };

    scope.contacts = {
        dict: {},
        list: [],
        current_active: null
    };

    scope_mapping = {
        "object": scope.objects,
        "contact": scope.contacts,
        "conversation": scope.conversations
    };
    
    service_mapping = {
        "object": yvObject,
        "contact": yvContact,
        "conversation": yvConversation
    };

    update_mapping = {
        "object": _update_object,
        "conversation": _update_conversation
    };
    
    scope.$watchCollection("conversations.dict", function (new_dict, old_dict) {
        _regenerate_conversations_list(new_dict);
        _check_update_conversations(new_dict);
    });
    
    scope.$watchCollection("contacts.dict", function (new_dict, old_dict) {
        _regenerate_contacts_list(new_dict);
    });

    scope.$watchCollection("objects.dict", function (new_objects, old_objects) {
        _check_update_objects(new_objects);
    });
    
    scope.$on("event:reset-base", function () {
        _reset();
    });
    
    scope.$on("event:reorder-conversations", function () {
        _reorder_conversations();
    });

    
    function _reorder_conversations() {
        scope.conversations.list.sort(function (conv1, conv2) {
            if (!conv1.latest_message && !conv2.latest_message) {
                return conv2.$$hashKey < conv1.$$hashKey ? 1 : -1;
            }
            if (!conv1.latest_message && conv2.latest_message) {
                return 1;
            }
            if (conv1.latest_message && !conv2.latest_message) {
                return -1;
            }
            return conv2.latest_message.timestamp - conv1.latest_message.timestamp;
        });
    }

    
    function _reorder_contacts() {
        scope.contacts.list.sort(function (contact1, contact2) {
            if (contact1.fullname <= contact2.fullname) {
                return 1;
            }
            return -1;
        });
    }


    function _regenerate_conversations_list(new_dict) {
        scope.conversations.list.length = 0;
        angular.forEach(new_dict, function (conv) {
            scope.conversations.list.push(conv);
        });
        _reorder_conversations();
    }


    function _regenerate_contacts_list(new_dict) {
        scope.contacts.list.length = 0;
        angular.forEach(new_dict, function (contact) {
            scope.contacts.list.push(contact);
        });
        _reorder_contacts();
    }


    function _check_update_objects(new_objects) {
        angular.forEach(new_objects, function (object, uuid) {
            if (!object.need_update) {
                return;
            }

            object.need_update = false;
            yvAPI.get_user_info(uuid, function (data) {
                _update_object(object, data);
            }, function () {
                object.need_update = true;
            }, function () {
                object.need_update = true;
            });
        });
    }
    

    function _update_object(object, data, callback) {
        object.name = data.user_name;
        object.email = data.user_email;
        object.updatetime = data.updatetime;
        object.fullname = data.user_fullname;
        object.signature = data.user_signature;

        yvLink.get_real_icon(data.user_icon, function (icon) {
            $timeout(function () {
                object.icon = icon;
            });
            callback && callback(object);
            
            if (yvSys.has_db()) {
                yvDB.add_object(object);
            }
        });
    }


    function _check_update_conversations(new_conversations) {
        angular.forEach(new_conversations, function (conversation, uuid) {
            if (!conversation.need_update) {
                return;
            }

            conversation.need_update = false;
            yvAPI.get_conversation(uuid, function (data) {
                if (data.user_uuid && !scope.objects.dict[data.user_uuid]) {
                    var new_object = yvObject.create(data.user_uuid);
                    new_object.need_update = true;
                    scope.objects.dict[data.user_uuid] = new_object;
                }
                conversation.show = true;
                _update_conversation(conversation, data);
            }, function () {
                conversation.need_update = true;
            }, function () {
                conversation.need_update = true;
            });
        });
    }
    

    function _update_conversation(conversation, conv, callback) {
        var icon = conv.conversation_icon;
        var name = conv.conversation_name;

        if (conv.conversation_data && conv.conversation_data.conversation_icon) {
            icon = conv.conversation_data.conversation_icon;
        }
        if (conv.conversation_data && conv.conversation_data.conversation_name) {
            name = conv.conversation_data.conversation_name;
        }
        if (conv.latest_message) {
            conversation.latest_message = yvMessage.history_message(conv.latest_message);
        }

        conversation.name = name;
        conversation.user_uuid = conv.user_uuid;
        conversation.group_uuid = conv.group_uuid;
        conversation.type = conv.conversation_type;        

        _reorder_conversations();
        callback && callback(conversation);

        yvLink.get_real_icon(icon, function (real_icon) {
            $timeout(function () {
                conversation.icon = real_icon;
            });
            
            if (yvSys.has_db()) {
                yvDB.add_conversation(conversation);
            }
        });
    }

    
    function _reset() {
        scope.objects.dict = {};
        scope.contacts.dict = {};
        scope.conversations.dict = {};
    }

    
    function _new(type, uuid) {
        var service = service_mapping[type];
        if (service) {
            return service.create(uuid);
        }
        return null;
    }

    function _prototype(type, item) {
        var service = service_mapping[type];
        if (service) {
            return service.check_prototype(item);
        }
        return false;
    }
    
    return {
        reset: function () {
            _reset();
        },

        get: function (type, uuid, attribute) {
            var hash = scope_mapping[type];
            if (hash && hash.dict.hasOwnProperty(uuid)) {
                var item = hash.dict[uuid];
                if (arguments.length === 2) {
                    return item;
                }
                if (item.hasOwnProperty(attribute)) {
                    return item[attribute];
                }
            }
            return null;
        },
        
        get_scope: function (type) {
            var hash = scope_mapping[type];
            return hash ? hash : null;
        },

        get_list: function (type) {
            var hash = scope_mapping[type];
            return hash ? hash.list : null;
        },

        set: function (type, uuid, key, value) {
            var data = {};
            data[key] = value;
            this.mset(type, uuid, data);
        },

        mset: function (type, uuid, data) {
            var hash = scope_mapping[type];
            if (!hash) {
                return;
            }
            var item = hash.dict[uuid];
            if (!item) {
                item = _new(type, uuid);
                hash.dict[uuid] = item;
            }
            angular.forEach(data, function (value, key) {
                item[key] = value;
            });
        },
        
        active: function (type, itemOrUuid) {
            var hash = scope_mapping[type];
            if (!hash) {
                return null;
            }
            if (arguments.length === 1) {
                return hash.current_active;
            }

            var target = null;
            var current = hash.current_active;            

            if (_prototype(type, itemOrUuid) || !itemOrUuid) {
                target = itemOrUuid;
            } else if (hash.dict.hasOwnProperty(itemOrUuid)) {
                target = hash.dict[itemOrUuid];
            }

            if (current) current.active = false;
            if (target) target.active = true;
            hash.current_active = target;

            return hash.current_active;
        },

        remove: function (type, uuid) {
            var hash = scope_mapping[type];
            if (!hash) {
                return;
            }
            var item = hash.dict[uuid];
            item && delete hash.dict[uuid];
        },

        create: function (type, uuid) {
            var item = this.get(type, uuid);
            return item ? item : _new(type, uuid);
        },

        add: function (type, item) {
            var hash = scope_mapping[type];
            if (hash.dict[item.uuid]) {
                return;
            }
            if (_prototype(type, item)) {
                hash.dict[item.uuid] = item;
            }
        },
        
        update: function (type, instance, data, callback) {
            var update = update_mapping[type];
            update && update(instance, data, callback);
        },
        
    };
}]);
