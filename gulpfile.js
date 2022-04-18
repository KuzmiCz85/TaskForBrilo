const gulp = require('gulp');
const nunjucksRender = require('gulp-nunjucks-render');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');
const { src, series, parallel, dest, watch } = require('gulp');

// Source paths
const htmlPath = 'src/pages/*.html';
const imgPath = 'src/images/*.jpg';
const stylePath = 'src/sass/*.scss';
const jsPath = 'src/js/*.js';

// Target distant path
const distantPath = 'build';

// Copy all Html files
function copyHtml() {
  return src(htmlPath)
    .pipe(nunjucksRender({ path: ['src/templates'], }))
    .pipe(dest(distantPath));
};

// Copy all images
function copyImages() {
  return src(imgPath)
    .pipe(dest(distantPath + '/images'));
};

// Transfer all SASS to CSS and merge into styles.css
function styleTask() {
  return src(stylePath)   
    .pipe(sass({ outputStyle: 'expanded', }).on('error', sass.logError))
    .pipe(concat('styles.css'))
    .pipe(dest(distantPath));
};

// Merge all Js into Scripts.js
function jsTask() {
  return src(jsPath)   
    .pipe(concat('scripts.js'))
    .pipe(dest(distantPath));
};

// Watch frequently changed files upon save
function watchTask() {
  watch([htmlPath, stylePath, jsPath], parallel(copyHtml, styleTask, jsTask));
};

// Single tasks
exports.copyHtml = copyHtml;
exports.copyImages = copyImages;
exports.styleTask = styleTask;
exports.jsTask = jsTask;
exports.watchTask = watchTask;

// Default task
exports.default = series(
  parallel(copyHtml, copyImages, styleTask, jsTask),
  watchTask
);