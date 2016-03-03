var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var ngmin = require('gulp-ngmin');
var uglify = require('gulp-uglify');
var replace = require('gulp-replace');
var del = require('del');
var buildConfig = require("./build.config.js");
var path = require('path');
var fs = require('fs');
var args = require('get-gulp-args')();
var os = require('os');

var _get_bootstrap_data = function() {
    var data = fs.readFileSync("../../../bootstrap/data.py", "utf8");
    data = data.slice(data.search("BOOTSTRAP_DATA"));
    data = eval(data);
    return data;
};

var bootstrap_data = _get_bootstrap_data();
var ws = "ws://";
var http = "http://";
var host = bootstrap_data.server.name + ":" + bootstrap_data.nginx.listen;
var mode = "dev";
if (bootstrap_data.nginx.ssl == "on") {
    http = "https://";
    ws = "wss://";
    host = bootstrap_data.server.name + ":" + bootstrap_data.nginx.ssl_listen;
}

if (bootstrap_data.js.min == "yes") {
    mode = "script";
}

var auth = http + host + "/ppauth";
var api = http + host + "/api";
var portal = http + host;
var ppcom_assets_path = http + host + "/ppcom/assets/";
var web_socket_url = ws + host + "/pcsocket/WS";
var file_upload_url = http + host + "/upload";
var file_upload_txt_url = http + host + "/upload_txt";
var file_download_url= http + host + "/download/";

var watchingPaths = {
    scripts: ['../src/**/*.js'],
    css: ['../src/css/**/*.css'],
    config: ['./build.config.js']
};


gulp.task('css', function(done) {
    gulp.src(buildConfig.cssFiles)
        .pipe(concat('pp-lib.css'))
        .pipe(gulp.dest(buildConfig.distPath))
        .pipe(minifyCss())
        .pipe(replace('"', '\''))
        .pipe(replace('\n', ''))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest(buildConfig.distPath))
        .on('end', done);
});

gulp.task('merge', ['css'], function(done) {
    var css = fs.readFileSync("../assets/pp-lib.min.css", "utf8");
    gulp.src("../src/view/pp-view-element-css.js")
        .pipe(replace('{css}', css))
        .pipe(rename({ extname: '.replaced.js' }))
        .pipe(gulp.dest("../src/view"))
        .on('end', done);
});

gulp.task('dev', ['merge'], function(done) {
    gulp.src(buildConfig.scriptFiles)
        .pipe(concat('pp-library.js'))
        .pipe(replace('{auth}', auth))
        .pipe(replace('{api}', api))
        .pipe(replace('{portal}', portal))
        .pipe(replace('{web_socket_url}', web_socket_url))
        .pipe(replace('{file_upload_url}', file_upload_url))
        .pipe(replace('{file_download_url}', file_download_url))
        .pipe(replace('{file_upload_txt_url}', file_upload_txt_url))
        .pipe(replace('{ppcom_assets_path}', ppcom_assets_path))
        .pipe(replace('{ppcom_api_key}', bootstrap_data.PPCOM.api_key))
        .pipe(replace('{ppcom_api_secret}', bootstrap_data.PPCOM.api_secret))
        .pipe(gulp.dest(buildConfig.distPath))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(buildConfig.distPath))
        .on('end', done);
});

gulp.task('scripts', ['merge'], function(done) {
    gulp.src(buildConfig.scriptFiles)
        .pipe(concat('pp-library.js'))
        .pipe(replace('{api}', api))
        .pipe(replace('{portal}', portal))
        .pipe(replace('{web_socket_url}', web_socket_url))
        .pipe(replace('{file_upload_url}', file_upload_url))
        .pipe(replace('{file_download_url}', file_download_url))
        .pipe(replace('{file_upload_txt_url}', file_upload_txt_url))
        .pipe(replace('{ppcom_assets_path}', ppcom_assets_path))
        .pipe(replace('{ppcom_api_key}', bootstrap_data.PPCOM.api_key))
        .pipe(replace('{ppcom_api_secret}', bootstrap_data.PPCOM.api_secret))
        .pipe(gulp.dest(buildConfig.distPath))
        .pipe(ngmin())
        .pipe(uglify())
        .on('error', function(e) {
            console.log(e);
            done();        
        })
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(buildConfig.distPath))
        .on('end', done);
});

// CLEAN source code on complected
gulp.task('clean:src', [ mode ], function(done) {
    try {
        return del([
            buildConfig.distPath + '/pp-library.js',
            buildConfig.distPath + '/pp-lib.css',
            buildConfig.distPath + '/pp-lib.min.css',
        ], {
            force: true
        });
    } catch ( e )  {
        // ignore
    }
});

gulp.task('refresh-config', function(done) {
    var pwd = path.resolve() + "/build.config.js";
    delete require.cache[pwd];
    buildConfig = require("./build.config.js");
    done();
});

gulp.task('watch', ['default'], function() {
    gulp.watch(watchingPaths.css, ['default']);
    gulp.watch(watchingPaths.scripts, ['default']);
    gulp.watch(watchingPaths.config, ['refresh-config', 'default']);
});
