// File paths
const files = {
    sassPath: './sass/',
    jsPath: './public/javascripts/'
};
const destinations = {
    cssPath: './public/stylesheets/',
    jsPath: './public/javascripts/prod/'
};


//* ***********************************
//
//
// use this when using old node and gulp
//
//
//
//* ***********************************


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
//     browserSync.init(['stylesheets/*.css'], {
//         proxy: 'http://localhost:3000',
//         port: 3010
//     });
//     //gulp.watch('index.html', { interval: 500 }).on('change', browserSync.reload);
//     gulp.watch([files.sassPath], ['sass']);
// });
// gulp.task('default', ['serve']);
//
//


//* ***********************************
//
//
// use this when using new node and gulp
//
//
//
//* ***********************************


//
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const minify = require("gulp-minify");


/**
 * do style
 * @param done
 * @returns {*}
 */
function doStyles(done) {
    return gulp.series(sassCompile, (done) => {
        done();
    })(done);
}

/**
 * sass complie
 * @returns {*|void}
 */
function sassCompile() {
    return gulp.src(files.sassPath + '**/*.scss')
        .pipe(sass({outputStyle: 'compressed'}))
        .on('error', sass.logError)
        .pipe(concat('final.css'))
        .pipe(gulp.dest(destinations.cssPath)).pipe(browserSync.stream());
}

/**
 * Compile scripts
 * @param  {Function} done [description]
 * @return {[type]}        [description]
 */
function doScripts1(done) {
    return gulp.series(jsCompileLogin, (done) => {
        done();
    })(done);
}
function doScripts2(done) {
    return gulp.series(jsCompileApp, (done) => {
        done();
    })(done);
}

/**
 * JS complie
 * @returns {*|void}
 */
function jsCompileLogin() {
    return gulp.src([
            // './node_modules/jquery/dist/jquery.min.js',
            './node_modules/socket.io-client/dist/socket.io.slim.js',
            './node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js',
            files.jsPath + 'app.js',
            files.jsPath + 'GlobalEventDispatcher.js',
            files.jsPath + 'APIHandler.js',
            files.jsPath + 'user.js',
            files.jsPath + 'signup.js'
        ])
        .pipe(concat('login.js'))
        .pipe(gulp.dest(destinations.jsPath)).pipe(browserSync.stream());
}
/**
 * [jsCompileApp description]
 * @return {[type]} [description]
 */
function jsCompileApp() {
    return gulp.src([
            // './node_modules/jquery/dist/jquery.min.js',
            './node_modules/socket.io-client/dist/socket.io.slim.js',
            './node_modules/bootstrap-sass/assets/javascripts/bootstrap.min.js',
            files.jsPath + 'app.js',
            files.jsPath + 'GlobalEventDispatcher.js',
            files.jsPath + 'APIHandler.js',
            files.jsPath + 'baseMessage.js',
            files.jsPath + 'chat.js',
            files.jsPath + 'privateChat.js',
            files.jsPath + 'announcements.js',
            files.jsPath + 'user.js',
            files.jsPath + 'userList.js',
            files.jsPath + 'userProfile.js',
            files.jsPath + 'userProfileForm.js',
            files.jsPath + 'signup.js',
            files.jsPath + 'signout.js',
            files.jsPath + 'status_selection_popup.js',
            files.jsPath + 'spam_form_popup.js',
            files.jsPath + 'resources.js',
            files.jsPath + 'resources_list.js',
            files.jsPath + 'emergency_status_detail.js'
        ])
        .pipe(concat('application.js'))
        .pipe(gulp.dest(destinations.jsPath)).pipe(browserSync.stream());
}
/**
 * [minifyJs description]
 * @return {[type]} [description]
 */
function minifyJs() {
  return gulp
    .src([destinations.jsPath + "application.js"])
    .pipe(
      minify({
        ext: {
          src: ".js"
          // min: ".min.js"
        }
      })
    )
    .pipe(gulp.dest(destinations.jsPath));
}

/**
 * reload
 * @param done
 */
function reload(done) {
    browserSync.reload();
    done();
}

/**
 * watch
 */
function watch() {
    browserSync.init({
        proxy: 'http://localhost:3000',
        port: 3010
    });
    gulp.watch(files.sassPath + '**/*.scss', doStyles);
    gulp.watch(files.jsPath + '*.js', doScripts1);
    gulp.watch(files.jsPath + '*.js', doScripts2);
    // gulp.watch(files.jsPath + '*.js', minifyJs);
    // gulp.watch([destinations.jsPath + 'application.js', destinations.jsPath + 'login.js'], minifyJs);
}
gulp.task('default', watch);
