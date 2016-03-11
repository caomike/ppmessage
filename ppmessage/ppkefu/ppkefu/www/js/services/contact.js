ppmessageModule.factory("yvContact", [

function () {

    function Contact(uuid) {
        this.uuid = uuid;

        if (typeof this.name !== "string") {
            Contact.prototype.name = "";
            Contact.prototype.icon = "";
            Contact.prototype.email = "";
            Contact.prototype.fullname = "";
            Contact.prototype.signature = "";
            Contact.prototype.is_portal_user = false;
            Contact.prototype.is_service_user = true;

            Contact.prototype.online = false;
            Contact.prototype.active = false;
        }
    }

    return {
        check_prototype: function (contact) {
            return Contact.prototype.isPrototypeOf(contact);
        },

        create: function (uuid) {
            var contact = new Contact(uuid);
            return contact;
        }
    }
}]);
