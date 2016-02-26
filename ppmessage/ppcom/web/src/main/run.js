((function() {
    
    var w = window;
    if ( w &&
         ( w.PP === undefined || w.pp === null ) ) {
        w.PP = PPModule(JQueryModule());
        w.ppSettings && w.PP.boot();
    }
    
})());
