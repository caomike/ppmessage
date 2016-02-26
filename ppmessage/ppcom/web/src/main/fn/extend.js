function extend(child, parent) {
    child.prototype = (function(supportObjectCreate) {
        
        // support Object.create method (ECMAScript 5.1)
        if (supportObjectCreate) return Object.create(parent.prototype);
        
        // not support Object.create method (like IE8, IE7 ...)
        function F() {}
        F.prototype = parent.prototype;
        return new F();
        
    } (Object.create !== undefined));
    
    child.prototype.constructor = child;
}
