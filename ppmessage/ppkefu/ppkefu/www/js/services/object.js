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
            PPObject.prototype.online = false;
            PPObject.prototype.need_update = false;            
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
