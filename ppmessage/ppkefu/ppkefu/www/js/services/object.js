ppmessageModule.factory("yvObject", [

function () {

    function PPObject(uuid) {
        this.uuid = uuid;
        
        if (typeof this.name !== "string") {
            PPObject.prototype.name = "";
            PPObject.prototype.icon = "";
            PPObject.prototype.email = "";
            PPObject.prototype.type = "DU";
            PPObject.prototype.updatetime = 0;
            PPObject.prototype.fullname = "";
            PPObject.prototype.signature = "";
            PPObject.prototype.need_update = false;

            // provide infos about portal user
            PPObject.prototype.mobile_online = false;
            PPObject.prototype.browser_online = false;
            PPObject.prototype.extra_data = null;            
        }
    }

    return {
        check_prototype: function (object) {
            return PPObject.prototype.isPrototypeOf(object);
        },

        create: function (uuid) {
            var object = new PPObject(uuid);
            return object;
        }
    }

}]);
