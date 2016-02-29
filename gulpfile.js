/*
-----------------------------------------------------------------------------------
|
| Gulp configuration
|
-----------------------------------------------------------------------------------
*/

var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    minifyCSS = require('gulp-minify-css');

gulp.task('browser-sync', function() {
    browserSync({
        proxy: 'http://localhost:3000'
    });
});

gulp.task('reload', function() {
    return browserSync.reload();
});

gulp.task('sass', function() {
    return gulp.src('./public/sass/*.scss')
      .pipe(plumber({errorHandler: printError}))
      .pipe(sass())
      .pipe(autoprefixer())
      .pipe(minifyCSS())
      .pipe(gulp.dest('./public/css'))
      .pipe(browserSync.reload({stream: true}))
});

gulp.task('default', ['sass', 'browser-sync', 'reload'], function() {
    gulp.watch('./public/sass/*', ['sass']);
    gulp.watch('./public/*.html', ['reload']);
    gulp.watch('./public/js/*', ['reload']);
});

/*
-----------------------------------------------------------------------------------
|
| Error handling
|
-----------------------------------------------------------------------------------
*/

function printError(error) {
    console.log(error.message);
    this.emit('end');
}
