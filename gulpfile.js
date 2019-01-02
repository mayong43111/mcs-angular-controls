var gulp = require('gulp');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var html2js = require('gulp-html2js');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var htmlmin = require('gulp-htmlmin');
var cleanCSS = require('gulp-clean-css');
var copy = require('gulp-copy');

gulp.task('html2js', function () {

    gulp.src('src/templates/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(html2js('templates.js', {
            adapter: 'angular',
            base: 'src',
            name: 'mcs.controls.templates'
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('ts-build', function () {

    var tsProject = ts.createProject('tsconfig.json');

    return gulp.src('src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(tsProject())
        .pipe(concat('mcs.controls.js'))
        .pipe(sourcemaps.mapSources(function (sourcePath, file) {
            return '../src/' + sourcePath;
        }))
        .pipe(sourcemaps.write('.', { includeContent: false }))
        .pipe(gulp.dest('dist'));
});

gulp.task('concat-css', function () {

    return gulp.src('src/styles/*.css')
        .pipe(concat('mcs.controls.css'))
        .pipe(gulp.dest('dist'));
});

gulp.task('compress-js', ['ts-build', 'html2js'], function () {

    gulp.src(['dist/*.js', '!dist/*.min.js'])
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist'));
});

gulp.task('compress-css', ['concat-css'], function () {

    gulp.src(['dist/*.css', '!dist/*.min.css'])
        .pipe(sourcemaps.init())
        .pipe(cleanCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(sourcemaps.write('.', { includeContent: false }))
        .pipe(gulp.dest('dist'));
});

gulp.task('img-copy', function () {

    gulp
        .src('src/img/**/*')
        .pipe(copy('dist/img', { prefix: 2 }));
});

gulp.task('all', ['compress-js', 'compress-css', 'img-copy'], function () {

});

gulp.task('default', ['compress-js'], function () {

});