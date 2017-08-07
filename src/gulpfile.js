// require all the necessary stuff here
﻿var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const autoprefixer = require('gulp-autoprefixer');
// Error handling
// --------------
const handle_error = notify.onError({
    title: "Oops!",
    message: "<%= error.message %>",
});
const plumber_notifier = ()=>
    plumber({ errorHandler: handle_error });

function compile(watch) {
  // browserify will look for our entry files
  var bundler = watchify(browserify(
    { entries: ['./assets/app.jsx'], debug: true, extensions: ['.js', '.jsx'] }
  ).transform(babel));

  function rebundle() {
    bundler.bundle()
      .on('error', function (err) { 
        // make sure to handle error, just in case so that you know what happen when the build process break
        console.error(err); 
        this.emit('end'); 
       })
      .pipe(source('app.js')) // this will generate the non minify version of bundle script
      .pipe(buffer())
      .pipe(gulp.dest('./public/build'))
      .pipe(rename('app.min.js')) // rename the original file for minify version
      .pipe(uglify()) // uglify will do the minified version of our based scripts.
      .pipe(gulp.dest('./build'));
  }

  if (watch) {
    bundler.on('update', function() {
      console.log('-> bundling...');
      rebundle();
    });
  }

  rebundle();
}

function watch() {
  return compile(true);
}

gulp.task('watch', function () { return watch(); });

gulp.task('sass', [],  function () {
    return gulp.src('./assets/sass/**/*.s[ac]ss')
        .pipe(plumber_notifier())
        .pipe(rename('youtube.css'))
        .pipe(sourcemaps.init())
        .pipe(sass({
            style: 'expanded'
        }))
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/css'))
    ;
});

// set our default task to watch so that the gulp process will monitor
// for any change and rebuilding the javascript files.﻿
gulp.task('default', [
    'watch',
    'sass'
], function () {
    gulp.watch('./assets/sass/**/*.s[ac]ss', [ 'sass' ]);
});


// gulp.task('default', ['watch']);