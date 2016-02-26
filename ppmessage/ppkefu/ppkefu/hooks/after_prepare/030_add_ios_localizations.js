#!/usr/bin/env node

var fs = require('fs');
var path = require('path');

var root_dir = process.argv[2];
var plist_path = path.join(root_dir, "platforms/ios/ppmessage/ppmessage-Info.plist");
    
var localization_key = "<key>CFBundleLocalizations</key>";
var origin = "<key>CFBundleExecutable</key>";
var replace =
    "<key>NSAppTransportSecurity</key>\n" +
	"<dict>\n" +
	"  <key>NSAllowsArbitraryLoads</key>\n" +
	"    <true/>\n" +
	"</dict>\n" +
    "<key>CFBundleLocalizations</key>\n" + 
    "<array>\n" + 
    "  <string>en</string>\n" +
    "  <string>zh_CN</string>\n" + 
    "</array>\n" +
    "<key>CFBundleExecutable</key>";

function add_localization (file_path, origin, replace) {
    
    if (fs.existsSync(file_path)) {
        
        var data = fs.readFileSync(file_path, "utf-8");
        
        if (data.indexOf(localization_key) == -1) {
            var result = data.replace(origin, replace);
            fs.writeFileSync(file_path, result, "utf-8");
        }
        
    } else {
        console.log("no such file:", file_path);
    }
    
}

if (root_dir) {

    // go through each of the platform directories that have been prepared
    var platforms = (process.env.CORDOVA_PLATFORMS ? process.env.CORDOVA_PLATFORMS.split(',') : []);

    for(var x=0; x<platforms.length; x++) {
        // open up the index.html file at the www root
        try {
            var platform = platforms[x].trim().toLowerCase();
            if(platform == 'ios') {
                add_localization(plist_path, origin , replace);
            } else {
                process.stdout.write("skip this plaform: " + platform + "\n");
            }
            
        } catch(e) {
            process.stdout.write(e);
        }
    }

}
