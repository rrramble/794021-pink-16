"use strict";

var SOURCE_FOLDER = "source";
var RESULT_FOLDER = "build";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var sourcemap = require("gulp-sourcemaps");
var sass = require("gulp-sass");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var minifyCss = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var webp = require("gulp-webp");
var svgSprite = require("gulp-svgstore");
var postHtml = require("gulp-posthtml");
var include = require("posthtml-include");
var del = require("del");
var server = require("browser-sync").create();

gulp.task("css", function () {
  return gulp.src(SOURCE_FOLDER + "/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(minifyCss())
    .pipe(rename("style.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest(RESULT_FOLDER + "/css"));
});

gulp.task("sprite", function () {
  return gulp.src(SOURCE_FOLDER + "/img/icon-*.svg")
    .pipe(svgSprite({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest(RESULT_FOLDER + "/img"));
});

gulp.task("server", function () {
  server.init({
    server: RESULT_FOLDER + "/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch(SOURCE_FOLDER + "/sass/**/*.{scss,sass}", gulp.series("css"));
  gulp.watch(SOURCE_FOLDER + "/img/icon-*.svg", gulp.series("sprite", "html", "refresh"));
  gulp.watch(SOURCE_FOLDER + "/*.html", gulp.series("html", "refresh"));
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("images", function () {
  return gulp.src(SOURCE_FOLDER + "/img/**/*.{png,jpg,svg}")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 2}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest(RESULT_FOLDER + "/img"));
});

gulp.task("webp", function () {
  return gulp.src(SOURCE_FOLDER + "/img/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest(RESULT_FOLDER + "/img"));
});

gulp.task("html", function () {
  return gulp.src(SOURCE_FOLDER + "/*.html")
    .pipe(postHtml([
      include()
    ]))
    .pipe(gulp.dest(RESULT_FOLDER));
});

gulp.task("copy", function () {
  return gulp.src([
    SOURCE_FOLDER + "/fonts/**/*.{woff,woff2}",
    SOURCE_FOLDER + "/img/**",
    SOURCE_FOLDER + "/js/**",
    SOURCE_FOLDER + "/*.ico"
  ], {
    base: SOURCE_FOLDER
  })
  .pipe(gulp.dest("build"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("build", gulp.series(
  "clean",
  "copy",
  "css",
  "sprite",
  "html"
));

gulp.task("start", gulp.series("build", "server"));
