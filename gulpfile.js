/* Requiring necessary packages */
const { src, dest, parallel, series, watch } = require("gulp");
const autoprefixer = require("gulp-autoprefixer");
const browsersync = require("browser-sync").create();
const changed = require("gulp-changed");
const concat = require("gulp-concat");
const cssnano = require("gulp-cssnano");
const htmlmin = require("gulp-htmlmin");
const imagemin = require("gulp-imagemin");
const sass = require("gulp-sass");
const del = require("del");

/* Setting base project constants */
const paths = {
  src: "./src/",
  dest: "./dist/",
};

/*
 * BASIC
 *
 * Tasks basicas e globais, direcionada a todos
 */

function clean() {
  return del(paths.dest, { force: true });
}

function html() {
  return src([paths.src + "*.html"])
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(changed(paths.dest))
    .pipe(dest(paths.dest));
}

function images() {
  return src([
    paths.src + "img/*.jpg",
    paths.src + "img/*.gif",
    paths.src + "img/*.png",
    paths.src + "img/*.svg",
  ])
    .pipe(changed(paths.dest + "img"))
    .pipe(imagemin())
    .pipe(dest(paths.dest + "img"));
}

function css() {
  return src([paths.src + "scss/**/*.scss"])
    .pipe(changed(paths.dest))
    .pipe(
      sass({ includePaths: paths.src, outputStyle: "compressed" }).on(
        "error",
        sass.logError
      )
    )
    .pipe(autoprefixer())
    .pipe(cssnano({ zindex: false, reduceIdents: false }))
    .pipe(concat("style.css"))
    .pipe(dest(paths.dest));
}

// BrowserSync
function browserInit() {
  browsersync.init({
    proxy: "http://127.0.0.1:3000",
    open: "local"
  });
}

// BrowserSync reload
function browserReload() {
  return browsersync.reload;
}

// Watch files
function watchFiles() {
  // Watch SCSS changes
  watch(paths.src + "scss/**/*.scss", parallel(css)).on("change", browserReload());
  // Watch javascripts changes
  watch(paths.src + "*.html", parallel(html)).on("change", browserReload());
}

const watching = parallel(watchFiles, browserInit);

exports.default = series(clean, images, css, html, watching);
exports.build = series(clean,images,css,html);