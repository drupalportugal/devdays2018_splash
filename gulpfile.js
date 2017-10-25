var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    cp = require('child_process'),
    harp = require('harp'),
    harpConfig = require('./harp.json'),
    jimp = require('gulp-jimp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    runSequence = require('run-sequence');


/**
 * Serve the Harp Site
 */
gulp.task('serve', ['fast-build'], function () {
  harp.server('.', {
    port: 3330
  }, function () {
    browserSync({
      proxy: "localhost:3330",
      open: false,
      port: 3333,
      ui: {
        port: 3335
      }
    });
    /**
     * Watch for scss changes, tell BrowserSync to refresh main.css
     */
    gulp.watch(["public/**/*.scss"], function () {
      reload("public/css/app.css", {stream: true});
      cp.exec('harp compile . www', {stdio: 'inherit'});
    });

    /**
     * Watch for all other changes, reload the whole page
     */
    gulp.watch(["public/**/*.jade", "public/**/*.json", "public/**/*.md", "public/**/*.ejs"], function () {
      reload();
      cp.exec('harp compile . www', {stdio: 'inherit'});
    });
  });
});


/**
 * Serve the Harp Site in production
 */
gulp.task('serveprod', ['build'], function() {
  harp.server('.', {
    port: process.env.PORT || 5000
  }, function () {
  });
});

/**
 * Build the Harp Site
 */
gulp.task('build', ['copy-css-assets'], function () {
  return cp.exec('harp compile . www', {stdio: 'inherit'});
});

/**
 * Build the Harp Site without jimp
 */
gulp.task('fast-build', ['copy-css-assets'], function () {
  return cp.exec('harp compile . www', {stdio: 'inherit'});
});

/**
 * Copy css assets from NODE Modules
 */
gulp.task('copy-css-assets', function() {
  return gulp.src(
  /** Insert below the css path **/
  ['  ']
  ).pipe(gulp.dest('./public/css/vendors'));
});

/**
 * Default task, running `gulp` will fire up the Harp site,
 * launch BrowserSync & watch files.
 */
gulp.task('default', ['serve']);

