#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var root_dir = process.argv[2];

var SIGN_ORIGIN = path.join(root_dir, "hooks/release-signing.properties"),
    KEY_ORIGIN = path.join(root_dir, "hooks/yvertical.keystore"),
    SIGN_TARGET = path.join(root_dir, "platforms/android/release-signing.properties"),
    KEY_TARGET = path.join(root_dir, "platforms/android/yvertical.keystore"),
    content;
    
function copyFile(origin, target) {
    var content;
    
    if ( fs.existsSync(origin)) {
        content = fs.readFileSync(origin);
        fs.writeFileSync(target, content);
    }
}

if (root_dir) {

    // go through each of the platform directories that have been prepared
    var platforms = (process.env.CORDOVA_PLATFORMS ? process.env.CORDOVA_PLATFORMS.split(',') : []);

    for(var x=0; x<platforms.length; x++) {
        // open up the index.html file at the www root
        try {
            var platform = platforms[x].trim().toLowerCase();
            
            if(platform == 'android') {
                copyFile(SIGN_ORIGIN, SIGN_TARGET);
                copyFile(KEY_ORIGIN, KEY_TARGET);
            } else {
                process.stdout.write("skip this platform: " + platform + "\n");
            }

        } catch(e) {
            process.stdout.write(e);
        }
    }

}

