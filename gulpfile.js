var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();

gulp.task('sass', function() {
    gulp.src('./sass/**/*.scss')
        .pipe(sass({ outputStyle: '' }).on('error', sass.logError))
        .pipe(gulp.dest('./public/stylesheets/'))
        .pipe(browserSync.stream());
});

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {
    browserSync.init(["stylesheets/*.css"], {
        proxy: "http://localhost:3000",
        port: 3010
    });
    // gulp.watch("index.html", { interval: 500 }).on('change', browserSync.reload);
    gulp.watch(['./sass/**/**/*.scss'], ['sass']);
});



gulp.task('default', ['serve']);