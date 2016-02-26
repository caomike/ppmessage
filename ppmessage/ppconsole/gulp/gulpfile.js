var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var ngmin = require('gulp-ngmin');
var uglify = require('gulp-uglify');
var buildConfig = require("./build.config.js");
var path = require('path');
var args = require("get-gulp-args")();
var replace = require('gulp-replace');
var os = require("os");
var fs = require("fs");

var watching_paths = {
    scripts: [
        '../static/scripts/web/js/*.js',
        '../static/scripts/web/js/**/*.js',
    ],
    css: [
        '../static/css/*.css'
    ],
    config: ['./build.config.js']
};

var _get_host_ip = function() {
    var ifaces = os.networkInterfaces();
    var name_array = Object.keys(ifaces);
    for(var i = 0; i < name_array.length; i++) {
        var ifname = name_array[i];
        var face_array = ifaces[ifname];
        for (var j = 0; j < face_array.length; j++) {
            var iface = face_array[j];

            if ("IPv4" !== iface.family || iface.internal !== false) {
                // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
                continue;
            }
            return iface.address;
        }
    }
    return "127.0.0.1";
};

var _get_bootstrap_data = function() {
    var data = fs.readFileSync("../../init/bootstrap/data.py", "utf8");
    data = data.slice(data.search("BOOTSTRAP_DATA"));
    data = eval(data);
    return data;
};

var bootstrap_data = _get_bootstrap_data();
var developer_mode = false;
var server = "ppmessage.cn"
if (args.env && args.env === "dev") {
    developer_mode = true;
    server = _get_host_ip() + ":8080";
}
console.log(server);


gulp.task('default', ['user', 'admin']);
gulp.task('user', ['user-css', 'user-scripts']);
gulp.task('admin', ['admin-css', 'admin-scripts']);

gulp.task('user-css', function(done) {
    gulp.src(buildConfig.cssFiles.user)
        .pipe(concat('ppconsole-user.css'))
        .pipe(gulp.dest(buildConfig.buildPath))
        .pipe(minifyCss())
        .on('error', function(e) {
            console.log(e);        
            done();
        })
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest(buildConfig.buildPath))
        .on('end', done);
});

gulp.task('admin-css', function(done) {
    gulp.src(buildConfig.cssFiles.admin)
        .pipe(concat('ppconsole-admin.css'))
        .pipe(gulp.dest(buildConfig.buildPath))
        .pipe(minifyCss())
        .on('error', function(e) {
            console.log(e);        
            done();
        })
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest(buildConfig.buildPath))
        .on('end', done);
});


gulp.task('user-scripts', function(done) {
    gulp.src(buildConfig.scriptFiles.user)
        .pipe(concat('ppconsole-user.js'))
        .pipe(replace('{ppconsole_api_uuid}', bootstrap_data.ppconsole.api_uuid))
        .pipe(replace('{ppconsole_api_key}', bootstrap_data.ppconsole.api_key))
        .pipe(replace('{ppmessage_app_uuid}', bootstrap_data.app_uuid))
        .pipe(replace('{WEB_ROLE}', "user"))
        .pipe(gulp.dest(buildConfig.buildPath))
        //.pipe(ngmin())
        //.pipe(uglify())
        .on('error', function(e) {
            console.log(e);
            done();        
        })
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(buildConfig.buildPath))
        .on('end', done);
});

gulp.task('admin-scripts', function(done) {
    gulp.src(buildConfig.scriptFiles.admin)
        .pipe(concat('ppconsole-admin.js'))
        .pipe(replace('{ppconsole_api_uuid}', bootstrap_data.ppconsole.api_uuid))
        .pipe(replace('{ppconsole_api_key}', bootstrap_data.ppconsole.api_key))
        .pipe(replace('{WEB_ROLE}', "admin"))
        .pipe(gulp.dest(buildConfig.buildPath))
        .pipe(ngmin())
        .pipe(uglify())
        .on('error', function(e) {
            console.log(e);
            done();        
        })
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(buildConfig.buildPath))
        .on('end', done);
});

gulp.task('refresh-config', function(done) {
    var pwd = path.resolve() + "/build.config.js";
    delete require.cache[pwd];
    buildConfig = require("./build.config.js");
    done();
});

gulp.task('watch', ['default'], function() {
    gulp.watch(watching_paths.css, ['watch-css']);
    gulp.watch(watching_paths.scripts, ['watch-scripts']);
    gulp.watch(watching_paths.config, ['refresh-config', 'default']);
});
