/*"use strict";

var gulp = require("gulp");
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();

gulp.task("style", function() {
  gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("source/css"))
    .pipe(server.stream());
});

gulp.task("serve", ["style"], function() {
  server.init({
    server: "source/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("source/less/**//*.less", ["style"]);
  gulp.watch("source//*.html").on("change", server.reload);
});
*/

"use strict";

var gulp = require("gulp");
var rename = require("gulp-rename");
var less = require("gulp-less");
var del = require("del");
var server = require("browser-sync").create();

var posthtml = require("gulp-posthtml");
var include = require("posthtml-include");

var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var minify = require("gulp-csso");
var autoprefixer = require("autoprefixer");
var rename = require("gulp-rename");

var imagemin = require("gulp-imagemin"); //minimizing images
var webp = require("gulp-webp");         //convert to webp
var svgstore = require("gulp-svgstore");
var run = require("gulp-run");

// Collecting less -> css, minify and rename to min
gulp.task("style", function() {
  gulp.src("source/less/style.less")
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("build/css"))
    .pipe(minify())
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css"))
    .pipe(server.stream());
});

// Minimize and optimize images
gulp.task("images", function () {
  return gulp.src("source/img/**/*.{png,jpg,svg}")
  .pipe(imagemin([
    imagemin.optipng({optimizationlevel: 3}),
    imagemin.jpegtran({progressive: true}),
    imagemin.svgo()
  ]))
  .pipe(gulp.dest("build/img"));
})

// Convert to Webp
gulp.task("webp", function () {
  return gulp.src("source/img/**/*.{png,jpg}")
  .pipe(webp({quality: 90}))
  .pipe(gulp.dest("build/img"));
});

// Optimize svg
gulp.task("sprite", function () {
  return gulp.src("source/img/icon-*.svg")
  .pipe(svgstore({
    inLineSvg: true
  }))
  .pipe(rename("sprite.svg"))
  .pipe(gulp.dest("build/img"));
});

// PostHTML include
gulp.task("html", function () {
  return gulp.src("source/*.html")
  .pipe(posthtml([
    include()
  ]))
  .pipe(gulp.dest("build/"));
});

// Run copy files
gulp.task("copy", function () {
  return gulp.src([
  "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/js/**"
  ], {
    base: "build"
  })
  .pipe(gulp.dest("build"));
});

// Detete old files before compilling new
gulp.task("clean", function (){
  return del("build");
});

// Run server
gulp.task("serve", ["build"], function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

gulp.watch("source/less/**1/*.less", ["style"]);
  gulp.watch("source/*.html").on("change", server.reload);
});

gulp.task("build", function (done) {
  run(
    "clean",
    "copy",
    "style",
    "images",
    "sprite",
    "html",
    done
  );
});
