#!/usr/bin/env node

// let yv_app_role = "mobile"
// let js/null.js --> cordova.js

var fs = require('fs');
var path = require('path');

var rootdir = process.argv[2];

function addMobileScriptTag(indexPath, platform) {
    // add the platform class to the body tag
    try {
        var html = fs.readFileSync(indexPath, 'utf8');
        var role_pc = 'window.yv_app_role = "pc"';
        var role_mobile = 'window.yv_app_role = "mobile"';

        html = html.replace(role_pc, role_mobile);

        fs.writeFileSync(indexPath, html, 'utf8');
        
    } catch(e) {
        process.stdout.write(e);
    }
}

if (rootdir) {

    // go through each of the platform directories that have been prepared
    var platforms = (process.env.CORDOVA_PLATFORMS ? process.env.CORDOVA_PLATFORMS.split(',') : []);

    for(var x=0; x<platforms.length; x++) {
        // open up the index.html file at the www root
        try {
            var platform = platforms[x].trim().toLowerCase();
            var indexPath;
            
            if(platform == 'android') {
                indexPath = path.join('platforms', platform, 'assets', 'www', 'index.html');
            } else {
                indexPath = path.join('platforms', platform, 'www', 'index.html');
            }

            if(fs.existsSync(indexPath)) {
                addMobileScriptTag(indexPath, platform);
            }

        } catch(e) {
            process.stdout.write(e);
        }
    }

}
