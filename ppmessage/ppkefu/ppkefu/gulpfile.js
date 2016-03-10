var fs = require("fs");
var gulp = require("gulp");
var gutil = require("gulp-util");
var bower = require("bower");
var concat = require("gulp-concat");
var sass = require("gulp-sass");
var minifyCss = require("gulp-minify-css");
var rename = require("gulp-rename");
var uglify = require("gulp-uglify");
var replace = require("gulp-replace");
var templateCache = require("gulp-angular-templatecache");
var sh = require("shelljs");
var buildConfig = require("./build.config.js");
var jslint = require("gulp-jslint");
var path = require("path");
var args = require("get-gulp-args")();
var os = require("os");
var xmlParser = require("xml2json");

function _get_ppkefu_version () {
    var xml = fs.readFileSync("./config.xml", "utf-8");
    var json = xmlParser.toJson(xml);
    var object = JSON.parse(json);
    return object.widget.version;
}

function _get_bootstrap_data () {
    var data = fs.readFileSync("../../bootstrap/data.py", "utf8");
    data = data.slice(data.search("BOOTSTRAP_DATA"));
    data = eval(data);
    return data;
}

var paths = {
    sass: ["./www/scss/*.scss"],
    css: ["./www/css/*.css"],
    scripts: [
        "./www/js/*.js",
        "./www/js/**/*.js"
    ],
    templates: ["./www/templates/*/*.html"],
    config: ["./build.config.js"],
};

var bootstrap_data = _get_bootstrap_data();
var server = bootstrap_data.server.name;
var developer_mode = bootstrap_data.js.min;
if (developer_mode == "no") {
    developer_mode = true;
} else {
    developer_mode = false;
}

var version = _get_ppkefu_version();

gulp.task("sass", generate_sass);
gulp.task("lib-css", generate_lib_css);
gulp.task("scripts", generate_scripts);
gulp.task("lib-scripts", generate_lib_scripts);
gulp.task("templatecache", generate_template_cache);
gulp.task("scripts-with-templatecache", ["templatecache"], generate_scripts);
gulp.task("refresh-config", refresh_config);
gulp.task("copy-jcrop-gif", copy_jcrop_gif);
gulp.task("copy-ionic-fonts", copy_ionic_fonts);

gulp.task("default", [
    "sass",
    "lib-css",
    "lib-scripts",
    "copy-jcrop-gif",
    "copy-ionic-fonts",
    "scripts-with-templatecache"
]);

gulp.task("watch", ["lib-css", "sass", "scripts-with-templatecache"], function() {
    gulp.watch(paths.sass, ["sass"]);
    gulp.watch(paths.css, ["lib-css"]);
    gulp.watch(paths.scripts, ["scripts"]);
    gulp.watch(paths.templates, ["scripts-with-templatecache"]);
    gulp.watch(paths.config, ["refresh-config", "scripts"]);
});

function generate_scripts (done) {
    var src = buildConfig.ppmessageScripts;
    var dest = buildConfig.buildScriptPath;
    
    gulp.src(src)
        .pipe(replace("{developer_mode}", developer_mode))
        .pipe(replace("{server}", server))
        .pipe(replace("{version}", version))
        .pipe(replace("{ppkefu_api_key}", bootstrap_data.PPKEFU.api_key))
        .pipe(concat("ppmessage.js"))
        .pipe(gulp.dest(dest))
        .pipe(uglify())
        .on("error", function(e) {
            console.log(e);
            done();
        })
        .pipe(rename({ extname: ".min.js" }))
        .pipe(gulp.dest(dest))
        .on("end", done);
}

function generate_template_cache (done) {
    var src = buildConfig.ppmessageTemplates;
    var dest = buildConfig.buildScriptPath;

    gulp.src(src)
        .pipe(templateCache({module: "ppmessage"}))
        .pipe(gulp.dest(dest))
        .on("end", done);
}

function generate_sass (done) {
    var src = "www/scss/ionic.ppmessage.scss";
    var dest = buildConfig.buildCssPath;

    gulp.src(src)
        .pipe(sass({errLogToConsole: true}))
        .pipe(gulp.dest(dest))
        .pipe(minifyCss({ keepSpecialComments: 0 }))
        .pipe(rename({ extname: ".min.css" }))
        .pipe(gulp.dest(dest))
        .on("end", done);
}

function generate_lib_scripts (done) {
    var src = buildConfig.libScripts;
    var dest = buildConfig.buildScriptPath;

    gulp.src(src)
        .pipe(concat("lib.js"))
        .pipe(gulp.dest(dest))
        .pipe(uglify())
        .on("error", function(e) { console.log(e); })
        .pipe(rename({ extname: ".min.js" }))
        .pipe(gulp.dest(dest))
        .on("end", done);
}

function generate_lib_css (done) {
    var src = buildConfig.libCss;
    var dest = buildConfig.buildCssPath;

    gulp.src(src)
        .pipe(concat("lib.css"))
        .pipe(gulp.dest(dest))
        .pipe(minifyCss({ keepSpecialComments: 0 }))
        .pipe(rename({ extname: ".min.css" }))
        .pipe(gulp.dest(dest))
        .on("end", done);
}

function refresh_config (done) {
    var pwd = path.resolve() + "/build.config.js";
    delete require.cache[pwd];
    buildConfig = require("./build.config.js");
    done();
}

function copy_ionic_fonts (done) {
    gulp.src("bower_components/ionic/fonts/*")
        .pipe(gulp.dest("www/build/fonts/"))
        .on("end", done);
}

function copy_jcrop_gif (done) {
    gulp.src("bower_components/Jcrop/css/Jcrop.gif")
        .pipe(gulp.dest("www/build/css/"))
        .on("end", done);
}


gulp.task("jslint", function (done) {
    gulp.src(buildConfig.ppmessageScripts)
        .pipe(jslint())
        .on("end", done);
});

gulp.task("lint", function (done) {
    gulp.src("www/js/services/db.js")
        .pipe(jslint({
            node: true,
            nomen: true,
            sloppy: true,
            plusplus: true,
            unparam: true,
            stupid: true
        }))
        .on("end", done);
});

gulp.task("install", ["git-check"], function() {
    return bower.commands.install()
        .on("log", function(data) {
            gutil.log("bower", gutil.colors.cyan(data.id), data.message);
        });
});

gulp.task("git-check", function(done) {
    if (!sh.which("git")) {
        console.log(
            "  " + gutil.colors.red("Git is not installed."),
            "\n  Git, the version control system, is required to download Ionic.",
            "\n  Download git here:", gutil.colors.cyan("http://git-scm.com/downloads") + ".",
            "\n  Once git is installed, run \"" + gutil.colors.cyan("gulp install") + "\" again."
        );
        process.exit(1);
    }
    done();
});
