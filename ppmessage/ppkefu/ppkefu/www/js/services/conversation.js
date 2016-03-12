ppmessageModule.factory("yvConversation", [
    "$rootScope",
function ($rootScope) {

    function Conversation(uuid) {
        this.uuid = uuid;
        this.messages = [];
        
        if (typeof this.type !== "string") {
            Conversation.prototype.type = "";
            Conversation.prototype.name = "";
            Conversation.prototype.icon = "";
            Conversation.prototype.unread = 0;
            Conversation.prototype.user_uuid = "";
            Conversation.prototype.group_uuid = "";
            Conversation.prototype.assigned_uuid = "";
            Conversation.prototype.last_chat_text = "";
            Conversation.prototype.latest_message = null;
            Conversation.prototype.need_update = false;
            Conversation.prototype.active = false;
            Conversation.prototype.show = true;            
            
            Conversation.prototype.has_message = function (message) {
                if (this.messages.indexOf(message) != -1) {
                    return true;
                }
                var target = this.get_message_by_tid(message.task_uuid); 
                return target ? true : false;
            };

            Conversation.prototype.get_message_by_tid = function (task_uuid) {
                for (var i = 0, length = this.messages.length; i < length; i++) {
                    if (this.messages[i].task_uuid == task_uuid) {
                        return this.messages[i];
                    }
                }
                return null;
            };

            Conversation.prototype.add_message = function (message) {
                if (this.has_message(message)) {
                    return; // dont repeatly add message
                }
                this.messages.push(message);
                this._refresh();
            };

            Conversation.prototype.delete_message = function (message) {
                var index = this.messages.indexOf(message);
                if (index !== -1) {
                    this.messages.splice(index, 1);
                    this._refresh();
                }
            };

            Conversation.prototype._reorder_messages = function () {
                var length = this.messages.length;
                this.messages.sort(_sort_message_by_timestamp);
                return this.messages[length - 1] || null;
            };

            Conversation.prototype._refresh = function () {
                this.latest_message = this._reorder_messages();
                _reorder_conversations();
            };
        }


        function _sort_message_by_timestamp(message1, message2) {
            return message1.timestamp - message2.timestamp;
        }


        function _reorder_conversations() {
            $rootScope.$broadcast("event:reorder-conversations");
        }
        
    }

    
    return {
        check_prototype: function (conversation) {
            return Conversation.prototype.isPrototypeOf(conversation);
        },

        create: function (conv_uuid) {
            var conversation = new Conversation(conv_uuid);
            return conversation;
        }
    }
}]);
