// Импорт пакетов
const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const rename = require('gulp-rename')
const cleanCSS = require('gulp-clean-css')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const concat = require('gulp-concat')
const sourcemaps = require('gulp-sourcemaps')
const autoprefixer = require('gulp-autoprefixer')
const imagemin = require('gulp-imagemin')
const htmlmin = require('gulp-htmlmin')
const size = require('gulp-size')
const newer = require('gulp-newer')
const browserSync = require('browser-sync').create()
const del = require('del')

// Пути исходных файлов src и пути к результирующим файлам dest
const paths = {
  html: {
    src: 'src/*.html',
    dest: 'dist/'
  },
  styles: {
    src: ['src/styles/**/*.scss', 'src/styles/**/*.css'],
    dest: 'dist/css/'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'dist/js/'
  },
  images: {
    src: 'src/img/**',
    dest: 'dist/img/'
  },
  fonts: {
    src: 'src/fonts/**',
    dest: 'dist/fonts/'
  }
}

// Очистить каталог dist, удалить все кроме изображений
function clean() {
  return del(['dist/*', '!dist/fonts', '!dist/img'])
}

// Обработка html
function html() {
  return gulp.src(paths.html.src)
  .pipe(htmlmin({ collapseWhitespace: true }))
  .pipe(size({
    showFiles:true
  }))
  .pipe(gulp.dest(paths.html.dest))
  .pipe(browserSync.stream())
}

// Обработка препроцессоров стилей
function styles() {
  return gulp.src(paths.styles.src)
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(autoprefixer({
    cascade: false
  }))
  .pipe(cleanCSS({
    level: 2
  }))
  .pipe(rename({
    basename: 'style',
    suffix: '.min'
  }))
  .pipe(sourcemaps.write('.'))
  .pipe(size({
    showFiles:true
  }))
  .pipe(gulp.dest(paths.styles.dest))
  .pipe(browserSync.stream())
}

// Обработка JavaScript
function scripts() {
  return gulp.src(paths.scripts.src)
  .pipe(sourcemaps.init())
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(uglify())
  .pipe(concat('main.min.js'))
  .pipe(sourcemaps.write('.'))
  .pipe(size({
    showFiles:true
  }))
  .pipe(gulp.dest(paths.scripts.dest))
  .pipe(browserSync.stream())
}

// Сжатие изображений
function img() {
  return gulp.src(paths.images.src)
  .pipe(newer(paths.images.dest))
  .pipe(imagemin({
    progressive: true,
    optimizationLevel: 5
  }))
  .pipe(size({
    showFiles:true
  }))
  .pipe(gulp.dest(paths.images.dest))
}

//Перенос шрифтов
function fonts() {
  return gulp.src(paths.fonts.src)
  .pipe(gulp.dest(paths.fonts.dest))
}

// Отслеживание изменений в файлах и запуск LiveServer
function watch() {
  browserSync.init({
    browser: ["chrome.exe"],
    server: {
      baseDir: "./dist"
    }
  })
  gulp.watch(paths.html.dest).on('change', browserSync.reload)
  gulp.watch(paths.html.src, html)
  gulp.watch(paths.styles.src, styles)
  gulp.watch(paths.scripts.src, scripts)
  gulp.watch(paths.images.src, img)
}

// Таски для ручного запуска
exports.clean = clean
exports.html = html
exports.styles = styles
exports.scripts = scripts
exports.img = img
exports.watch = watch

// Таск команде gulp
exports.default = gulp.series(clean, html, gulp.parallel(styles, scripts, img, fonts), watch)