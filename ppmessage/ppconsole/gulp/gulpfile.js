var gulp = require('gulp');
var gutil = require('gulp-util');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var ngmin = require('gulp-ngmin');
var uglify = require('gulp-uglify');
var gulpif = require('gulp-if');
var buildConfig = require("./build.config.js");
var path = require('path');
var args = require("get-gulp-args")();
var replace = require('gulp-replace');
var os = require("os");
var fs = require("fs");

var watching_paths = {
    scripts: [
        '../static/js/*.js',
        '../static/js/**/*.js',
	'../static/js/**/**/*.js',
    ],
    css: [
        '../static/css/*.css'
    ],
    html: [
        '../static/html/*.html'
    ],
    config: ['./build.config.js']
};

var _get_bootstrap_data = function() {
    var data = fs.readFileSync("../../bootstrap/data.py", "utf8");
    data = data.slice(data.search("BOOTSTRAP_DATA"));
    data = eval(data);
    return data;
};

var bootstrap_data = _get_bootstrap_data();
var min_js = false;
if (bootstrap_data.js.min == "yes") {
    min_js = true;
}

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
        .pipe(replace('{ppconsole_api_uuid}', bootstrap_data.PPCONSOLE.api_uuid))
        .pipe(replace('{ppconsole_api_key}', bootstrap_data.PPCONSOLE.api_key))
        .pipe(replace('{ppconsole_api_secret}', bootstrap_data.PPCONSOLE.api_secret))
        .pipe(replace('{ppmessage_app_uuid}', bootstrap_data.team.app_uuid))
        .pipe(replace('{WEB_ROLE}', "user"))
        .pipe(gulp.dest(buildConfig.buildPath))
        .pipe(gulpif(min_js, ngmin()))
        .pipe(gulpif(min_js, uglify()))
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
        .pipe(replace('{ppconsole_api_uuid}', bootstrap_data.PPCONSOLE.api_uuid))
        .pipe(replace('{ppconsole_api_key}', bootstrap_data.PPCONSOLE.api_key))
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
    gulp.watch(watching_paths.scripts, ['default']);
    gulp.watch(watching_paths.config, ['refresh-config', 'default']);
    gulp.watch(watching_paths.html, ['default']);
});
