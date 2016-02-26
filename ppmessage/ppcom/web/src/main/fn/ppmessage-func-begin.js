function PPMessage (jQuery) {

    // Global module variables for convenience use
    var fn = {
        $: jQuery,
        Service: {},
        View: {},
        Modal: {},
        Controller: {},
        Factory: {},
        Configuration: {},
        Toolkit: {}
    },
        
        $ = fn.$,
        Service = fn.Service,
        View = fn.View,
        Modal = fn.Modal,
        Controller = fn.Controller,
        Factory = fn.Factory,
        Ctrl = Controller,
        Configuration = fn.Configuration,
        Toolkit = fn.Toolkit,
        
        $timeout = setTimeout,
        $clearTimeout = clearTimeout,

        // on async get data callback
        $onResult = function ( data, callback ) {
            if ( callback ) callback ( data );
        };
