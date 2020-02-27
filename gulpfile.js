// File paths
const files = {
    sassPath: './sass/**/*.scss'
}
const destinations = {
    cssPath: './public/stylesheets/'
}


//************************************
//
//
//use this when using old node and gulp
//
//
//
//************************************


// const gulp = require('gulp');
// const sass = require('gulp-sass');
// const browserSync = require('browser-sync').create();
// const cssnano = require('cssnano');
// const autoprefixer = require('autoprefixer');
// gulp.task('sass', function() {
//     gulp.src(files.sassPath)
//         .pipe(sass({ outputStyle: '' }).on('error', sass.logError))
//         .pipe(gulp.dest(destinations.cssPath))
//         .pipe(browserSync.stream());
// });
// // Static Server + watching scss/html files
// gulp.task('serve', ['sass'], function() {
//     browserSync.init(["stylesheets/*.css"], {
//         proxy: "http://localhost:3000",
//         port: 3010
//     });
//     //gulp.watch("index.html", { interval: 500 }).on('change', browserSync.reload);
//     gulp.watch([files.sassPath], ['sass']);
// });
// gulp.task('default', ['serve']);
//
//



//************************************
//
//
//use this when using new node and gulp
//
//
//
//************************************


//
const gulp = require("gulp");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass");

function doStyles(done) {
    return gulp.series(sassCompile, done => {
        done();
    })(done);
}

function sassCompile() {
    return gulp.src(files.sassPath)
    .pipe(sass({ outputStyle: 'compressed' }))
    .on("error", sass.logError)
        // .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(gulp.dest(destinations.cssPath)).pipe(browserSync.stream());
}

function reload(done) {
    browserSync.reload();
    done();
}

function watch() {
    browserSync.init({
        proxy: "http://localhost:3000",
        port: 3010
    });
    gulp.watch(files.sassPath, doStyles);
    // gulp.watch(paths.php.src, reload);
}
gulp.task("default", watch);
