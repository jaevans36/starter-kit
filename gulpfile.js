var gulp = require('gulp'),
    gutil = require('gulp-util'),
    sass = require('gulp-sass'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat');

// Copy index.html from the app to assets
gulp.task('copy', function() {
  gulp.src('app/index.html')
      .pipe(gulp.dest('assets'))
      .on('error', gutil.log)

  gutil.log(gutil.colors.green('HTML copied successfuly!'));
});

// SCSS process
gulp.task('sass', function() {
  gulp.src('app/styles/main.scss')
      .pipe(sass({style: 'expanded'}))
      .on('error', gutil.log)
      .pipe(gulp.dest('assets'))

  gutil.log(gutil.colors.green('CSS copied successfuly!'));
});

gulp.task('js', function() {
  gulp.src('app/scripts/*.js')
      .pipe(uglify())
      .pipe(concat('script.js'))
      .pipe(gulp.dest('assets'))

  gutil.log(gutil.colors.green('JS copied successfuly!'));
});

gulp.task('watch', function() {
  gulp.watch('app/*.html', ['copy']);
  gulp.watch('app/**/*.scss', ['sass']);
  gulp.watch('app/**/*.js', ['js']);
})

// Manually run all tasks
// gulp.task('default', ['copy','sass','js']);